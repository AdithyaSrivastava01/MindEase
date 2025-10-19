import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a compassionate mental health AI that analyzes journal entries.

Your task is to:
1. Analyze the emotional tone and content of the journal entry
2. Assign a mood score from 1-10 where:
   - 1-3: Very low mood, significant distress
   - 4-6: Moderate mood, some challenges
   - 7-10: Good to excellent mood, positive outlook
3. Identify 2-4 dominant emotions (e.g., "anxious", "hopeful", "stressed", "grateful")
4. Provide supportive insights using CBT/ACT principles (2-3 sentences)

Return your response in this EXACT JSON format:
{
  "score": <number 1-10>,
  "emotions": ["emotion1", "emotion2", ...],
  "insights": "<your supportive insight>"
}

Be empathetic, accurate, and therapeutically helpful.`
        },
        {
          role: "user",
          content: `Analyze this journal entry:\n\n${content}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"score": 5, "emotions": [], "insights": "Thank you for journaling."}');

    return NextResponse.json({
      score: Math.max(1, Math.min(10, result.score || 5)), // Ensure score is 1-10
      emotions: result.emotions || [],
      insights: result.insights || "Thank you for sharing your thoughts. Journaling is a valuable tool for self-reflection."
    });
  } catch (error) {
    console.error("Error analyzing journal:", error);
    return NextResponse.json(
      {
        score: 5,
        emotions: [],
        insights: "Thank you for journaling. This is a meaningful step in understanding yourself better."
      },
      { status: 200 }
    );
  }
}
