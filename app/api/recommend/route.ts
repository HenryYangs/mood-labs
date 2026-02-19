import { getDeepSeekRecommendationAction } from '@/app/actions/recommend';
import type { Movie } from '@/types/movie';
import { moodOptions, type Mood } from '@/types/mood';
import { NextResponse } from 'next/server';

type RecommendRequestBody = {
  mood?: string;
};

const DEV_RECOMMEND_MOVIES: Movie[] = [
  {
    title: 'The Secret Life of Walter Mitty',
    date: '2013-12-25',
    rating: '7.3',
    source: {
      url: 'https://www.youtube.com/watch?v=HddkucmzMAY',
      rating: 7.3,
      tag: ['Adventure', 'Drama', 'Comedy', 'Inspirational', 'Fantasy'],
    },
    duration: '114',
    reason:
      '这部电影讲述一个平凡人通过冒险找到生活意义的故事，能帮助缓解焦虑，鼓励勇敢面对挑战。',
  },
  {
    title: 'The Pursuit of Happyness',
    date: '2006-12-15',
    rating: '8.0',
    source: {
      url: 'https://www.youtube.com/watch?v=89Kq8SDyvfg',
      rating: 8,
      tag: ['Biography', 'Drama', 'Inspirational', 'Family', 'Struggle'],
    },
    duration: '117',
    reason:
      '基于真实故事，展现坚韧不拔的精神，能激励焦虑中的观众看到希望和坚持的力量。',
  },
  {
    title: 'Inside Out',
    date: '2015-06-19',
    rating: '8.1',
    source: {
      url: 'https://www.youtube.com/watch?v=yRUAzGQ3nSY',
      rating: 8.1,
      tag: ['Animation', 'Adventure', 'Comedy', 'Family', 'Emotional'],
    },
    duration: '95',
    reason:
      '通过动画形式探讨情绪管理，帮助理解焦虑等复杂情感，提供轻松而深刻的安慰。',
  },
  {
    title: 'The Shawshank Redemption',
    date: '1994-09-23',
    rating: '9.3',
    source: {
      url: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
      rating: 9.3,
      tag: ['Drama', 'Crime', 'Inspirational', 'Hope', 'Friendship'],
    },
    duration: '142',
    reason:
      '经典电影讲述希望与救赎，在困境中保持乐观，能缓解焦虑并带来心灵慰藉。',
  },
  {
    title: 'Amélie',
    date: '2001-04-25',
    rating: '8.3',
    source: {
      url: 'https://www.youtube.com/watch?v=HUECWi5pX7o',
      rating: 8.3,
      tag: ['Comedy', 'Romance', 'Fantasy', 'Whimsical', 'Heartwarming'],
    },
    duration: '122',
    reason:
      '充满奇幻和温暖的电影，通过主角的小善举带来快乐，能分散焦虑并提升心情。',
  },
];

function isMood(input: string): input is Mood {
  return moodOptions.includes(input as Mood);
}

function shouldUseMockRecommend(): boolean {
  if (process.env.NODE_ENV === 'development') {
    return process.env.FORCE_MOCK === 'true';
  }

  return false;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as RecommendRequestBody;
    const moodInput = body.mood;

    if (!moodInput || !isMood(moodInput)) {
      return NextResponse.json({ error: 'Invalid mood' }, { status: 400 });
    }

    if (shouldUseMockRecommend()) {
      return NextResponse.json(DEV_RECOMMEND_MOVIES, { status: 200 });
    }

    const data = await getDeepSeekRecommendationAction(moodInput);
    return NextResponse.json(data, { status: 200 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Recommend service unavailable' },
      { status: 500 },
    );
  }
}
