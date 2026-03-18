import { generateText } from 'ai';
import { openai } from '@/lib/ai';

export async function POST(req: Request) {
  const { mood } = await req.json();
  const result = await generateText({
    model: openai.chat('gpt-4o-mini'),

    prompt: `
User mood: ${mood}

Recommend 5 books that emotionally resonate with this mood.

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
`,
  });
  // @ts-ignore
  return Response.json(JSON.parse(result._output));
}
