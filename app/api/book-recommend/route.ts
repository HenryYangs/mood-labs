import { generateText } from 'ai';
import { openai } from '@/lib/ai';

export async function POST(req: Request) {
  const { mood, history } = await req.json();
  const rawLang = req.headers.get('Language') ?? '';
  const language: 'en' | 'zh' = rawLang === 'zh' ? 'zh' : 'en';

  const excludeClause =
    history && history.length > 0
      ? `\nexclude following ISBN code of book: ${history.join(',')}`
      : '';

  const languageInstruction =
    language === 'zh'
      ? 'Reply in Chinese. All text fields (title, author, tags, description, reason) must be in Chinese.'
      : 'Reply in English.';

  const result = await generateText({
    model: openai.chat('gpt-4o-mini'),

    prompt: `
    You are a book recommendation assistant. 
User mood: ${mood}

Recommend 5 books that emotionally resonate with this mood.${excludeClause}

Return an array and each item with:
title
author
year
tags
description
reason
ISBNCode

year is the published year of the book.
ISBNCode is the ISBN code of the book.
description should be limited in 200 words.
reason should be limited in 100 words.

Do not use Markdown format.
${languageInstruction}
`,
  });
  // @ts-ignore
  return Response.json(JSON.parse(result._output));
}
