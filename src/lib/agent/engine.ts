import { ReActAgent, createTool } from "react-agent-js";
import { generateGeminiWebResponse } from "@/lib/services/gemini-web";
import { executeTool } from "./tools";

export interface AgentStep {
  type: "thought" | "tool_call" | "tool_result" | "final_answer";
  name?: string;
  input?: any;
  output?: any;
  text?: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const MARK_SYSTEM_PROMPT = `You are MARK, the dedicated AI assistant and portfolio copilot for Mada Putra Adhadriyanto (https://mazees.dev).

Scope & Strict Boundaries:
1. YOUR ALLOWED TOPICS:
   - Information about Mada Putra Adhadriyanto (biography, education at UPN "Veteran" Jawa Timur, persona, achievements).
   - Mada's software projects, applications, case studies, and open-source repositories (@Mazees on GitHub).
   - Mada's tech stack, technical skills, coding/architecture methodologies, and software development practices.
   - Contact channels (Email, LinkedIn, WhatsApp, Telegram) and professional collaboration/hiring inquiries.

2. STRICT OUT-OF-SCOPE REFUSALS:
   - You MUST REFUSE to answer queries that are unrelated to Mada, his projects, his tech stack, or software development.
   - Examples of out-of-scope queries: cooking recipes, politics, general world history, celebrity gossip, school homework in non-coding subjects, medical/legal advice, or general chat unrelated to Mada's work.
   - When receiving an out-of-scope query, decline politely and concisely in the user's language (e.g., "I am MARK, an AI copilot specifically built for Mada's portfolio. I can only assist with questions regarding Mada Putra Adhadriyanto, his engineering projects, technical stack, and software development inquiries.") without calling unrelated tools.

Tone & Format Guidelines:
- Professional, authentic, direct, and concise developer tone.
- Strictly ZERO emojis in all responses.
- Always use the provided tools to fetch real data about projects, repositories, tech stacks, and contact info before responding to relevant queries.`;

export async function runMarkAgent(
  userPrompt: string,
  history: ChatMessage[] = []
): Promise<{ finalAnswer: string; steps: AgentStep[]; type: "short" | "long" }> {
  const steps: AgentStep[] = [];

  // Define LLM Provider function using Gemini Web RPC
  const llmProvider = async (messages: { role: string; content: string }[]) => {
    // Format full conversational prompt for Gemini Web
    const promptString = messages
      .map((m) => {
        if (m.role === "system") return `[SYSTEM INSTRUCTION]\n${m.content}\n`;
        if (m.role === "user") return `[USER]\n${m.content}\n`;
        return `[MARK]\n${m.content}\n`;
      })
      .join("\n");

    return await generateGeminiWebResponse(promptString);
  };

  // Define tools using react-agent-js createTool
  const tools = [
    createTool(
      "search_projects",
      "Search for projects by keyword, technology, type ('client', 'opensource', 'personal'), or range (e.g. '1-5', '5-10', 'all'). Query parameter is the search string.",
      async (query: string) => {
        return await executeTool("search_projects", { query });
      }
    ),
    createTool(
      "get_project_detail",
      "Get full case study, architecture, tech stack, and links of a specific project by slug. Query parameter is the project slug.",
      async (slug: string) => {
        return await executeTool("get_project_detail", { slug });
      }
    ),
    createTool(
      "get_tech_stacks",
      "Get list of technologies and frameworks Mada specializes in. Query parameter is optional category filter or technology keyword (e.g. 'frontend', 'backend', 'ai', 'all').",
      async (query: string) => {
        return await executeTool("get_tech_stacks", { query });
      }
    ),
    createTool(
      "get_repositories",
      "Get public open-source GitHub repositories from @Mazees on GitHub. Query parameter can be a range (e.g. '1-5', '5-10', '1 to 10'), a keyword (e.g. 'agent', 'react'), 'all' for no limit, or empty.",
      async (query: string) => {
        return await executeTool("get_repositories", { query });
      }
    ),
    createTool(
      "get_contact_info",
      "Get official contact channels (WhatsApp, Telegram @mazeesid, Email, GitHub). Query parameter can be empty.",
      async (query: string) => {
        return await executeTool("get_contact_info", { query });
      }
    ),
    createTool(
      "get_about_info",
      "Get biographical overview, education (UPN Veteran Jatim), and persona of Mada. Query parameter can be empty.",
      async (query: string) => {
        return await executeTool("get_about_info", { query });
      }
    ),
  ];

  // Convert incoming chat history into format expected by ReActAgent
  const initialHistory = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Instantiate react-agent-js ReActAgent core
  const agent = new ReActAgent(
    llmProvider,
    tools,
    MARK_SYSTEM_PROMPT,
    initialHistory
  );

  let finalAnswer = "";

  try {
    finalAnswer = await agent.run(userPrompt, (stepInfo: any) => {
      if (stepInfo.status === "decision" && stepInfo.decision) {
        if (stepInfo.decision.thought) {
          steps.push({
            type: "thought",
            text: stepInfo.decision.thought,
          });
        }
      } else if (stepInfo.status === "executing_tool") {
        steps.push({
          type: "tool_call",
          name: stepInfo.tool,
          input: stepInfo.query,
        });
      } else if (stepInfo.status === "observation") {
        steps.push({
          type: "tool_result",
          output: stepInfo.result,
        });
      }
    });
  } catch (err: any) {
    console.error("[react-agent-js error]:", err);
    finalAnswer =
      "I encountered a temporary connection issue while querying data. You can explore Mada's showcase in the Projects tab or contact him directly via Telegram (@mazeesid) or WhatsApp (+62 812-3448-9008).";
  }

  steps.push({
    type: "final_answer",
    text: finalAnswer,
  });

  const isLong = finalAnswer.length > 250 || finalAnswer.includes("\n\n");

  return {
    finalAnswer,
    steps,
    type: isLong ? "long" : "short",
  };
}
