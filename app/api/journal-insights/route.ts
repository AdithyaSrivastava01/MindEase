import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content, mood } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a compassionate mental health AI that provides supportive insights on journal entries.

Your role is to:
- Acknowledge the user's feelings with empathy
- Identify positive patterns, strengths, or coping strategies mentioned
- Gently highlight any cognitive distortions (if present) using CBT principles
- Offer 1-2 actionable suggestions or reframing techniques
- Be encouraging and validating

Keep your response to 2-3 sentences. Be warm, supportive, and therapeutically meaningful.`
        },
        {
          role: "user",
          content: `Journal Entry (Mood: ${mood}/10):\n\n${content}\n\nProvide supportive insight on this journal entry.`
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const insight = completion.choices[0].message.content || "Thank you for sharing your thoughts. Journaling is a valuable tool for self-reflection.";

    return NextResponse.json({ insight });
  } catch (error) {
    console.error("Error generating journal insights:", error);
    return NextResponse.json(
      { insight: "Thank you for journaling. This is a meaningful step in understanding yourself better." },
      { status: 200 }
    );
  }
}
