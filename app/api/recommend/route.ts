import { getDeepSeekRecommendationAction } from '@/app/actions/recommend';
import { moodOptions, type Mood } from '@/types/mood';
import { createClient } from '@vercel/kv';
import { NextResponse } from 'next/server';

type RecommendRequestBody = {
  mood?: string;
};

// Per-IP short window limit: one request in N seconds.
const IP_WINDOW_SECONDS_LIMIT = 5;
// Per-IP daily hard cap.
const IP_DAILY_REQUEST_LIMIT = 1000;
// Global daily hard cap for the whole project.
const PROJECT_DAILY_REQUEST_LIMIT = 100000;
const kvRestApiUrl =
  process.env.mood_labs_KV_REST_API_URL ??
  process.env.MOOD_LABS_KV_REST_API_URL ??
  process.env.KV_REST_API_URL;
const kvRestApiToken =
  process.env.mood_labs_KV_REST_API_TOKEN ??
  process.env.MOOD_LABS_KV_REST_API_TOKEN ??
  process.env.KV_REST_API_TOKEN;
const hasKvConfig = Boolean(kvRestApiUrl) && Boolean(kvRestApiToken);
const kvClient = hasKvConfig
  ? createClient({
      url: kvRestApiUrl as string,
      token: kvRestApiToken as string,
    })
  : null;

function logInfo(message: string, data?: Record<string, unknown>): void {
  console.info(`[api/recommend] ${message}`, data ?? {});
}

function logError(message: string, data?: Record<string, unknown>): void {
  console.error(`[api/recommend] ${message}`, data ?? {});
}

function isMood(input: string): input is Mood {
  return moodOptions.includes(input as Mood);
}

// Resolve a stable client IP from common proxy headers.
function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }
  return request.headers.get('x-real-ip') ?? 'unknown';
}

async function checkIpWindowLimit(request: Request): Promise<boolean> {
  if (!kvClient) {
    return true;
  }
  const ip = getClientIp(request);
  const key = `rate_limit:ip_5s:${ip}`;
  const setResult = await kvClient.set(key, '1', {
    ex: IP_WINDOW_SECONDS_LIMIT,
    nx: true,
  });
  return setResult === 'OK';
}

// Build a UTC day key in YYYY-MM-DD format.
function getDayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

// Enforce per-IP daily quota.
async function checkIpDailyLimit(request: Request): Promise<boolean> {
  if (!kvClient) {
    return true;
  }
  const ip = getClientIp(request);
  const dayKey = getDayKey();
  const key = `rate_limit:ip_daily:${dayKey}:${ip}`;
  const count = await kvClient.incr(key);
  if (count === 1) {
    await kvClient.expire(key, 60 * 60 * 24);
  }
  return count <= IP_DAILY_REQUEST_LIMIT;
}

// Enforce global daily quota across all requests.
async function checkProjectDailyLimit(): Promise<boolean> {
  if (!kvClient) {
    return true;
  }
  const dayKey = getDayKey();
  const key = `rate_limit:project_daily:${dayKey}`;
  const count = await kvClient.incr(key);
  if (count === 1) {
    await kvClient.expire(key, 60 * 60 * 24);
  }
  return count <= PROJECT_DAILY_REQUEST_LIMIT;
}

// Recommend endpoint with layered rate-limit checks.
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    logInfo('request_received', {
      ip,
      contentType: request.headers.get('content-type') ?? null,
    });

    if (!hasKvConfig) {
      logInfo('rate_limit_skipped_missing_kv_env', {
        hasKvRestApiUrl: Boolean(kvRestApiUrl),
        hasKvRestApiToken: Boolean(kvRestApiToken),
      });
    }

    const withinLimit = hasKvConfig ? await checkIpWindowLimit(request) : true;
    const withinIpDailyLimit = hasKvConfig ? await checkIpDailyLimit(request) : true;
    const withinProjectDailyLimit = hasKvConfig
      ? await checkProjectDailyLimit()
      : true;
    logInfo('rate_limit_check_completed', {
      ip,
      withinLimit,
      withinIpDailyLimit,
      withinProjectDailyLimit,
    });

    if (!withinLimit) {
      logInfo('rate_limited_short_window', { ip });
      return NextResponse.json(
        {
          error: `Too many requests, please retry after ${IP_WINDOW_SECONDS_LIMIT} seconds`,
        },
        { status: 429 },
      );
    }
    if (!withinIpDailyLimit) {
      logInfo('rate_limited_ip_daily', { ip });
      return NextResponse.json(
        { error: 'Daily request limit exceeded for this IP' },
        { status: 429 },
      );
    }
    if (!withinProjectDailyLimit) {
      logInfo('rate_limited_project_daily', { ip });
      return NextResponse.json(
        { error: 'Daily project request limit exceeded' },
        { status: 429 },
      );
    }

    const body = (await request.json()) as RecommendRequestBody;
    const moodInput = body.mood;
    logInfo('request_body_parsed', { ip, mood: moodInput ?? null });

    if (!moodInput || !isMood(moodInput)) {
      logInfo('invalid_mood', { ip, mood: moodInput ?? null });
      return NextResponse.json({ error: 'Invalid mood' }, { status: 400 });
    }

    logInfo('recommendation_started', { ip, mood: moodInput });
    const data = await getDeepSeekRecommendationAction(moodInput);
    logInfo('recommendation_succeeded', { ip, mood: moodInput, count: data.length });
    return NextResponse.json(data, { status: 200 });
  } catch (_error) {
    const error = _error as Error;
    logError('recommendation_failed', {
      errorName: error?.name ?? null,
      errorMessage: error?.message ?? null,
    });
    return NextResponse.json(
      { error: 'Recommend service unavailable' },
      { status: 500 },
    );
  }
}
