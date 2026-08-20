"use server";

import { generateGeminiWebResponse } from "@/lib/services/gemini-web";
import { executeTool } from "@/lib/agent/tools";

/**
 * Server Action as LLM Provider for react-agent-js on client side
 */
export async function llmProviderAction(messages: any[]) {
  try {
    const MAX_HISTORY = 10;
    const systemMessage = messages[0];
    let chatHistory = messages.slice(1);

    if (chatHistory.length > MAX_HISTORY) {
      chatHistory = chatHistory.slice(-MAX_HISTORY);
    }

    const limitedMessages = [systemMessage, ...chatHistory];

    const promptStr = limitedMessages
      .map((m) => {
        const prefix =
          m.role.toUpperCase() === "SYSTEM"
            ? "SYSTEM INSTRUCTION"
            : m.role.toUpperCase();
        return `${prefix}:\n${m.content}`;
      })
      .join("\n\n---\n\n");

    const response = await generateGeminiWebResponse(promptStr);
    return response;
  } catch (error: any) {
    console.error("[LLM Provider Action Error]:", error);
    throw new Error(error.message || "Gagal memanggil Gemini Web");
  }
}

/**
 * Server Action to execute agent tools on server
 */
export async function executeToolAction(name: string, params: Record<string, any>) {
  try {
    return await executeTool(name, params);
  } catch (error: any) {
    console.error(`[Tool Execution Error] ${name}:`, error);
    return { error: error?.message || "Failed to execute tool" };
  }
}
