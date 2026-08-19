import { NextRequest, NextResponse } from "next/server";
import { runMarkAgent, ChatMessage } from "@/lib/agent/engine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = body.prompt;
    const history: ChatMessage[] = body.history || [];

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required and must be a string." },
        { status: 400 }
      );
    }

    const result = await runMarkAgent(prompt, history);

    return NextResponse.json({
      success: true,
      text: result.finalAnswer,
      type: result.type,
      steps: result.steps,
    });
  } catch (err: any) {
    console.error("[MarkAgent API Error]:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "Failed to process Mark Agent request.",
        text: "I encountered an error processing your query. Please try again or reach out to Mada directly at madaadha21@gmail.com.",
        type: "short",
        steps: [],
      },
      { status: 500 }
    );
  }
}
