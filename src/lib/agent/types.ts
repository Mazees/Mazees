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
