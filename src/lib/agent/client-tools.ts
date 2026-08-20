"use client";

import { createTool } from "react-agent-js";
import { executeToolAction } from "@/lib/actions/agent-actions";

export const clientAgentTools = [
  createTool(
    "search_projects",
    "Search for projects by keyword, technology, type ('client', 'opensource', 'personal'), or range (e.g. '1-5', '5-10', 'all'). Query parameter is the search string.",
    async (query: string) => {
      return await executeToolAction("search_projects", { query });
    }
  ),
  createTool(
    "get_project_detail",
    "Get full case study, architecture, tech stack, and links of a specific project by slug. Query parameter is the project slug.",
    async (slug: string) => {
      return await executeToolAction("get_project_detail", { slug });
    }
  ),
  createTool(
    "get_tech_stacks",
    "Get list of technologies and frameworks Mada specializes in. Query parameter is optional category filter or technology keyword (e.g. 'frontend', 'backend', 'ai', 'all').",
    async (query: string) => {
      return await executeToolAction("get_tech_stacks", { query });
    }
  ),
  createTool(
    "get_repositories",
    "Get public open-source GitHub repositories from @Mazees on GitHub. Query parameter can be a range (e.g. '1-5', '5-10', '1 to 10'), a keyword (e.g. 'agent', 'react'), 'all' for no limit, or empty.",
    async (query: string) => {
      return await executeToolAction("get_repositories", { query });
    }
  ),
  createTool(
    "get_contact_info",
    "Get official contact channels (WhatsApp, Telegram @mazeesid, Email, GitHub, LinkedIn). Query parameter can be empty.",
    async (query: string) => {
      return await executeToolAction("get_contact_info", { query });
    }
  ),
  createTool(
    "get_about_info",
    "Get biographical overview, education (UPN Veteran Jatim), and persona of Mada. Query parameter can be empty.",
    async (query: string) => {
      return await executeToolAction("get_about_info", { query });
    }
  ),
];
