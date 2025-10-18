import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are a compassionate mental health companion for college students. Your role is to:

1. Listen actively and empathetically to students' concerns
2. Use evidence-based techniques from Cognitive Behavioral Therapy (CBT)
3. Help students identify and challenge negative thought patterns
4. Suggest healthy coping strategies
5. Validate their feelings while encouraging positive perspectives
6. Recognize when professional help may be needed

Guidelines:
- Be warm, non-judgmental, and supportive
- Ask open-ended questions to encourage reflection
- Normalize mental health struggles
- Suggest concrete coping strategies (breathing exercises, journaling, physical activity)
- When appropriate, suggest using our in-app features:
  * Breathing exercises for anxiety, stress, or panic
  * Mood tracking to help identify patterns and triggers
- If crisis indicators are detected, emphasize the importance of reaching out to professionals
- Keep responses concise and conversational (2-4 sentences typically)
- Use encouraging and hopeful language

Important: You are NOT a replacement for professional mental health services. Always encourage students to seek professional help when needed.`;

function detectCrisisKeywords(message: string): boolean {
  const crisisKeywords = [
    "suicide", "suicidal", "kill myself", "end my life", "want to die",
    "self harm", "self-harm", "cut myself", "hurt myself",
    "no reason to live", "better off dead", "can't go on"
  ];

  const lowerMessage = message.toLowerCase();
  return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
}

function detectBreathingExerciseNeed(message: string): boolean {
  const keywords = [
    "anxious", "anxiety", "panic", "panicking", "stressed", "stress",
    "overwhelmed", "can't breathe", "heart racing", "nervous",
    "worried", "tense", "can't calm down", "freaking out"
  ];

  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword));
}

function detectMoodTrackingNeed(messages: ChatMessage[]): boolean {
  // Only suggest mood tracking when user is discussing emotional patterns or struggling to identify feelings
  const userMessage = messages[messages.length - 1].content.toLowerCase();

  const moodPatternKeywords = [
    "always feel", "lately i", "recently i", "every day", "pattern",
    "keep feeling", "don't know why i feel", "mood swings", "ups and downs",
    "feelings change", "emotional", "can't figure out", "confused about",
    "track", "notice", "happening to me", "going through"
  ];

  return moodPatternKeywords.some(keyword => userMessage.includes(keyword));
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    // Send full conversation history to maintain context
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...messages.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        }))
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0].message.content || "I'm here to listen. Could you tell me more?";
    const hasCrisisKeywords = detectCrisisKeywords(userMessage);
    const suggestBreathing = detectBreathingExerciseNeed(userMessage);
    const suggestMoodTracking = detectMoodTrackingNeed(messages);

    return NextResponse.json({
      content: aiResponse,
      crisisDetected: hasCrisisKeywords,
      crisisLevel: hasCrisisKeywords ? 'critical' : 'none',
      suggestions: {
        breathingExercise: suggestBreathing,
        moodTracking: suggestMoodTracking
      }
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}