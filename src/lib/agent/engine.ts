import { ReActAgent, createTool } from "react-agent-js";
import { generateGeminiWebResponse } from "@/lib/services/gemini-web";
import { executeTool } from "./tools";
import { AgentStep, ChatMessage } from "./types";
import { MARK_SYSTEM_PROMPT } from "./prompt";

export type { AgentStep, ChatMessage };
export { MARK_SYSTEM_PROMPT };

export type AgentStepEvent =
  | { type: "thought"; thought: string }
  | { type: "executing_tool"; tool: string; query: any }
  | { type: "observation"; result: any }
  | { type: "done"; finalAnswer: string; answerType: "short" | "long" };

export async function runMarkAgentStream(
  userPrompt: string,
  history: ChatMessage[] = [],
  onStepCallback: (event: AgentStepEvent) => Promise<void> | void
): Promise<{
  finalAnswer: string;
  steps: AgentStep[];
  type: "short" | "long";
}> {
  const steps: AgentStep[] = [];

  const llmProvider = async (messages: { role: string; content: string }[]) => {
    const promptString = messages
      .map((m) => {
        if (m.role === "system") return `[SYSTEM INSTRUCTION]\n${m.content}\n`;
        if (m.role === "user") return `[USER]\n${m.content}\n`;
        return `[MARK]\n${m.content}\n`;
      })
      .join("\n");

    return await generateGeminiWebResponse(promptString);
  };

  const tools = [
    createTool(
      "search_projects",
      "Search for projects by keyword, technology, type ('client', 'opensource', 'personal'), or range (e.g. '1-5', '5-10', 'all'). Query parameter is the search string.",
      async (query: string) => {
        return await executeTool("search_projects", { query });
      },
    ),
    createTool(
      "get_project_detail",
      "Get full case study, architecture, tech stack, and links of a specific project by slug. Query parameter is the project slug.",
      async (slug: string) => {
        return await executeTool("get_project_detail", { slug });
      },
    ),
    createTool(
      "get_tech_stacks",
      "Get list of technologies and frameworks Mada specializes in. Query parameter is optional category filter or technology keyword (e.g. 'frontend', 'backend', 'ai', 'all').",
      async (query: string) => {
        return await executeTool("get_tech_stacks", { query });
      },
    ),
    createTool(
      "get_repositories",
      "Get public open-source GitHub repositories from @Mazees on GitHub. Query parameter can be a range (e.g. '1-5', '5-10', '1 to 10'), a keyword (e.g. 'agent', 'react'), 'all' for no limit, or empty.",
      async (query: string) => {
        return await executeTool("get_repositories", { query });
      },
    ),
    createTool(
      "get_contact_info",
      "Get official contact channels (WhatsApp, Telegram @mazeesid, Email, GitHub, LinkedIn). Query parameter can be empty.",
      async (query: string) => {
        return await executeTool("get_contact_info", { query });
      },
    ),
    createTool(
      "get_about_info",
      "Get biographical overview, education (UPN Veteran Jatim), and persona of Mada. Query parameter can be empty.",
      async (query: string) => {
        return await executeTool("get_about_info", { query });
      },
    ),
  ];

  const initialHistory = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const agent = new ReActAgent(
    llmProvider,
    tools,
    MARK_SYSTEM_PROMPT,
    initialHistory,
  );

  let finalAnswer = "";

  try {
    finalAnswer = await agent.run(userPrompt, async (stepInfo: any) => {
      if (stepInfo.status === "decision" && stepInfo.decision) {
        if (stepInfo.decision.thought) {
          steps.push({
            type: "thought",
            text: stepInfo.decision.thought,
          });
          await onStepCallback({
            type: "thought",
            thought: stepInfo.decision.thought,
          });
        }
      } else if (stepInfo.status === "executing_tool") {
        steps.push({
          type: "tool_call",
          name: stepInfo.tool,
          input: stepInfo.query,
        });
        await onStepCallback({
          type: "executing_tool",
          tool: stepInfo.tool,
          query: stepInfo.query,
        });
      } else if (stepInfo.status === "observation") {
        steps.push({
          type: "tool_result",
          output: stepInfo.result,
        });
        await onStepCallback({
          type: "observation",
          result: stepInfo.result,
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
  const answerType = isLong ? "long" : "short";

  await onStepCallback({
    type: "done",
    finalAnswer,
    answerType,
  });

  return {
    finalAnswer,
    steps,
    type: answerType,
  };
}

export async function runMarkAgent(
  userPrompt: string,
  history: ChatMessage[] = [],
): Promise<{
  finalAnswer: string;
  steps: AgentStep[];
  type: "short" | "long";
}> {
  return await runMarkAgentStream(userPrompt, history, () => {});
}
