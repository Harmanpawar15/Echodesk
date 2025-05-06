// src/app/api/chat/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-project-domain.com', // replace this later
        'X-Title': 'Echodesk AI'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages,
      })
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error:', err);
    return new NextResponse('Error fetching AI response', { status: 500 });
  }
}
