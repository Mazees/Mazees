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
  createTool(
    "navigate_to_page",
    "Navigate the user's browser to a specific route on the website. Allowed paths: '/', '/projects', '/projects/[slug]', '/repositories', '/contact', '/dashboard'. Query parameter is the target route path (e.g. '/contact' or '/projects').",
    async (path: string) => {
      const cleanPath = path.trim().replace(/^['"]|['"]$/g, "");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("mark-navigate", { detail: { path: cleanPath } })
        );
      }
      return {
        status: "navigated",
        target_path: cleanPath,
        message: `Navigated browser to ${cleanPath}`,
      };
    }
  ),
  createTool(
    "scroll_to_section",
    "Smoothly scroll the browser viewport to a specific section on the homepage. Valid sections: 'hero', 'showcase', 'skills', 'contact'. Query parameter is the section id.",
    async (sectionId: string) => {
      const cleanId = sectionId.trim().replace(/^#/, "");
      if (typeof window !== "undefined") {
        const el = document.getElementById(cleanId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          return { status: "scrolled", section: cleanId };
        }
      }
      return { status: "section_not_found", section: cleanId };
    }
  ),
  createTool(
    "filter_projects_view",
    "Filter the visible projects showcase on the /projects page by search keyword or category ('all', 'client', 'opensource', 'personal'). Query parameter is the filter query or category.",
    async (filterQuery: string) => {
      const cleanQuery = filterQuery.trim().replace(/^['"]|['"]$/g, "");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("mark-filter-projects", { detail: { query: cleanQuery } })
        );
      }
      return {
        status: "filter_applied",
        filter: cleanQuery,
      };
    }
  ),
  createTool(
    "compose_contact_message",
    "Draft a professional collaboration/hiring inquiry message and generate pre-filled direct WhatsApp, Telegram, and Email links. Query parameter is the project topic or collaboration subject.",
    async (topic: string) => {
      return await executeToolAction("compose_contact_message", { topic });
    }
  ),
  createTool(
    "analyze_project_fit",
    "Evaluate project requirements against Mada's tech stack capabilities (Next.js, LangChain/react-agent-js, Supabase, Tailwind, Electron) and provide architecture recommendations. Query parameter is the project requirements description.",
    async (requirements: string) => {
      return await executeToolAction("analyze_project_fit", { requirements });
    }
  ),
  createTool(
    "get_live_github_activity",
    "Fetch live recent public GitHub commits and activity for @Mazees on GitHub. Query parameter can be empty.",
    async () => {
      return await executeToolAction("get_live_github_activity", {});
    }
  ),
];
