import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are a compassionate, evidence-based mental health companion for college students, trained in Cognitive Behavioral Therapy (CBT) and Acceptance and Commitment Therapy (ACT).

Core Therapeutic Approaches:

CBT Techniques:
- Help identify automatic negative thoughts and cognitive distortions (catastrophizing, all-or-nothing thinking, overgeneralizing)
- Guide students to examine evidence for/against negative beliefs
- Use Socratic questioning to challenge unhelpful thinking patterns
- Suggest behavioral experiments and gradual exposure for anxiety
- Promote thought records and cognitive reframing

ACT Techniques:
- Encourage psychological flexibility and present-moment awareness
- Help students identify their core values and committed actions
- Teach cognitive defusion (observing thoughts without getting entangled)
- Practice acceptance of difficult emotions rather than avoidance
- Use metaphors to illustrate psychological concepts
- Guide values-based decision making

Guidelines:
- Be warm, non-judgmental, and supportive while being therapeutically effective
- Ask powerful open-ended questions that promote insight
- Normalize mental health struggles and validate emotions
- Use collaborative language ("Let's explore together...")
- When appropriate, suggest in-app features:
  * Breathing exercises for acute anxiety/stress/panic
  * Mood journal for tracking patterns and self-reflection
  * ASMR/calming audio for severe distress or overwhelm
- Gently challenge unhelpful patterns while maintaining rapport
- Keep responses conversational (2-5 sentences) but therapeutically meaningful
- Use encouraging, hope-instilling language rooted in evidence-based practice

Important: You complement but do NOT replace professional mental health services. Encourage professional help when needed.`;

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
    "worried", "tense", "can't calm down", "freaking out",
    "distressed", "distress", "need to relax", "help me relax"
  ];

  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword));
}

function detectMoodJournalNeed(messages: ChatMessage[]): boolean {
  // Suggest mood journal for self-reflection, pattern tracking, or processing emotions
  const userMessage = messages[messages.length - 1].content.toLowerCase();

  const journalKeywords = [
    "always feel", "lately i", "recently i", "every day", "pattern",
    "keep feeling", "don't know why i feel", "mood swings", "ups and downs",
    "feelings change", "emotional", "can't figure out", "confused about",
    "track", "notice", "happening to me", "going through", "write",
    "express myself", "process", "reflect", "understand myself"
  ];

  return journalKeywords.some(keyword => userMessage.includes(keyword));
}

function detectASMRNeed(message: string): boolean {
  // Suggest ASMR/calming audio for severe distress, overwhelm, relaxation requests, or when highly stressed
  const keywords = [
    "can't take it", "too much", "overwhelming", "drowning", "breaking down",
    "falling apart", "can't cope", "exhausted", "burnt out", "hopeless",
    "give up", "can't handle", "breaking point", "spiraling", "losing it",
    "need escape", "need to relax", "need calm", "can't think straight",
    "soothing", "calm down", "relax", "asmr", "calming", "peaceful",
    "help me relax", "something soothing", "listen to something", "calm music",
    "need peace", "meditation", "tranquil", "destress", "unwind"
  ];

  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword));
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, userContext }: { messages: ChatMessage[], userContext?: any } = await req.json();
    const userMessage = messages[messages.length - 1].content;

    // Build dynamic system prompt with user context
    let contextualPrompt = systemPrompt;
    if (userContext?.persona) {
      const personaAdditions = {
        gentle: "\n\nCurrent Persona: GENTLE - Use extra soft, nurturing language. Be patient and reassuring. Offer comfort first, then gentle guidance.",
        direct: "\n\nCurrent Persona: DIRECT - Be clear and straightforward while remaining supportive. Focus on actionable advice and practical solutions.",
        humorous: "\n\nCurrent Persona: HUMOROUS - Use light humor and playful language when appropriate to lift mood. Balance levity with genuine support."
      };
      contextualPrompt += personaAdditions[userContext.persona as keyof typeof personaAdditions] || "";
    }

    // Send full conversation history to maintain context
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: contextualPrompt
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
    const suggestMoodJournal = detectMoodJournalNeed(messages);
    const suggestASMR = detectASMRNeed(userMessage);

    return NextResponse.json({
      content: aiResponse,
      crisisDetected: hasCrisisKeywords,
      crisisLevel: hasCrisisKeywords ? 'critical' : 'none',
      suggestions: {
        breathingExercise: suggestBreathing,
        moodJournal: suggestMoodJournal,
        calmingAudio: suggestASMR
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