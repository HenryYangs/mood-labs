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

function buildPrompt(mood: Mood): DeepSeekMessage[] {
  return [
    {
      role: 'system',
      content:
        '你是一个电影推荐助手. 请返回五部电影推荐, 返回的格式为JSON, 请严格遵守JSON格式.',
    },
    {
      role: 'user',
      content: `用户心情: ${mood}

返回JSON, 格式如下:
{
  "title": "string",
  "date": "string",
  "rating": "string",
  "source": "object",
  "duration": "string",
  "reason": "string"
}

规则:
- 请返回五部电影
- "date" 电影首次上映的时间，格式为"YYYY-MM-DD"
- "reason" 推荐理由，请控制在100个字以内
- "duration" 是电影时长，请返回分钟数
- "source" 是电影的信息，请返回一个对象，包含以下信息：
  - url: 电影在YouTube的播放链接，必须是完整版的电影链接
  - rating：电影在每个平台的评分，满分为10分，数字类型
  - tag：电影的标签，最多返回前五个，数组形式
- 不要使用Markdown格式
- JSON内容无需换行符
`,
    },
  ];
}

export async function fetchRecommendationFromDeepSeek(
  mood: Mood,
): Promise<Movie[]> {
  const apiKey = getRequiredEnv('DEEPSEEK_API_KEY');
  const requestBody = {
    model: 'deepseek-chat',
    temperature: 0.8,
    response_format: { type: 'json_object' },
    messages: buildPrompt(mood),
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
