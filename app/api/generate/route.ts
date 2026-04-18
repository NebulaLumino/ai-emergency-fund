import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a financial planner. Calculate the ideal emergency fund target, recommend monthly savings rate, suggest high-yield accounts, and outline withdrawal strategies.`;

async function getClient() {
  if (!process.env.DEEPSEEK_API_KEY) {
    throw new Error('Missing DEEPSEEK_API_KEY environment variable');
  }
  const { default: OpenAI } = await import('openai');
  return new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: 'https://api.deepseek.com/v1',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const client = await getClient();
    const fieldList = ['monthly_expenses', 'income_stability', 'dependents', 'health_factors'];
    const userMessage = fieldList
      .map((f) => (body[f] ? f + ': ' + body[f] : null))
      .filter(Boolean)
      .join('\n');

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: 'Please generate based on the following inputs:\n\n' + userMessage },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const result = completion.choices[0]?.message?.content || 'No output generated.';
    return NextResponse.json({ result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
