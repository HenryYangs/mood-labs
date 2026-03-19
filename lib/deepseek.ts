import type { Movie } from '@/types/movie';
import type { Mood } from '@/types/mood';
import { getRequiredEnv } from '@/lib/env';

type DeepSeekMessage = {
  role: 'system' | 'user';
  content: string;
};

type DeepSeekChoice = {
  message?: {
    content?: string;
  };
};

type DeepSeekResponse = {
  choices?: DeepSeekChoice[];
};

function buildPrompt(mood: Mood, language: 'en' | 'zh'): DeepSeekMessage[] {
  const languageInstruction =
    language === 'zh'
      ? 'Reply in Chinese. All text fields (title, reason) must be in Chinese.'
      : 'Reply in English.';

  return [
    {
      role: 'system',
      content:
        'You are a movie recommendation assistant. Return five movie recommendations in JSON format. Strictly follow the JSON format.',
    },
    {
      role: 'user',
      content: `User mood: ${mood}

Return JSON in the following format:
{
  "title": "string",
  "date": "string",
  "rating": "string",
  "source": "object",
  "duration": "string",
  "reason": "string"
}

Rules:
- Return exactly five movies
- "date" is the original release date of the movie, formatted as "YYYY-MM-DD"
- "reason" is the recommendation reason, limited to 100 words
- "duration" is the movie runtime in minutes
- "source" contains movie metadata as an object with:
  - url: full-length YouTube link for the movie
  - rating: ratings on each platform out of 10, numeric type
  - tag: movie tags, up to five, as an array
- Do not use Markdown format
- No newlines inside JSON content
${languageInstruction}
`,
    },
  ];
}

export async function fetchRecommendationFromDeepSeek(
  mood: Mood,
  language: 'en' | 'zh' = 'en',
): Promise<Movie[]> {
  const apiKey = getRequiredEnv('DEEPSEEK_API_KEY');
  const requestBody = {
    model: 'deepseek-chat',
    temperature: 0.8,
    response_format: { type: 'json_object' },
    messages: buildPrompt(mood, language),
    stream: false,
    max_tokens: 5000,
  };
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
    cache: 'no-store',
  });
  const responseText = await response.clone().text();
  if (!response.ok) {
    throw new Error(
      `DeepSeek request failed: ${response.status} ${responseText}`,
    );
  }

  const payload = (await response.json()) as DeepSeekResponse;
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Invalid DeepSeek response');
  }
  return JSON.parse(content).movies;
}
