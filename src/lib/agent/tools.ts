import { getPublishedProjects, getProjectBySlug } from "@/lib/supabase/projects";
import { getTechStacks } from "@/lib/supabase/techstack";
import { getGitHubRepositories, getGitHubProfile } from "@/lib/github";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
}

export const PORTFOLIO_TOOLS: ToolDefinition[] = [
  {
    name: "search_projects",
    description:
      "Search for projects built by Mada by keyword, technology, or project type ('client', 'opensource', 'personal').",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search keyword e.g. 'AI', 'dashboard', 'automation', 'Next.js'",
        },
        type: {
          type: "string",
          description: "Filter by project type: 'client', 'opensource', or 'personal'",
        },
      },
    },
  },
  {
    name: "get_project_detail",
    description:
      "Get full detailed case study, architecture, tech stack, and links of a specific project using its slug.",
    parameters: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description: "The unique slug identifier of the project",
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_tech_stacks",
    description:
      "Get list of technologies, frameworks, and programming languages Mada specializes in.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description:
            "Optional category filter: 'frontend', 'backend', 'ai', 'desktop', 'infrastructure', or 'other'",
        },
      },
    },
  },
  {
    name: "get_repositories",
    description:
      "Get public open-source GitHub repositories, stars count, and contribution statistics from @Mazees on GitHub.",
    parameters: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of repositories to return (default 6)",
        },
      },
    },
  },
  {
    name: "get_contact_info",
    description:
      "Get official contact channels, links, and direct contact details for Mada.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "get_about_info",
    description:
      "Get biographical overview, education (UPN Veteran Jatim), persona (Agentic AI Explorer), and core focus areas of Mada.",
    parameters: {
      type: "object",
      properties: {},
    },
  },
];

export async function executeTool(name: string, args: Record<string, any> = {}): Promise<any> {
  const rawQuery = String(args.query || args.slug || args.category || "").trim();

  switch (name) {
    case "search_projects": {
      const all = await getPublishedProjects();
      const q = rawQuery.toLowerCase();
      const type = (args.type || "").toLowerCase();

      // Check if range query e.g. "1-5", "5-10"
      const rangeMatch = q.match(/^(\d+)\s*(?:-|to|sampai|\.\.)\s*(\d+)$/);
      if (rangeMatch) {
        const start = Math.max(1, parseInt(rangeMatch[1], 10)) - 1;
        const end = Math.max(start + 1, parseInt(rangeMatch[2], 10));
        const sliced = all.slice(start, end);
        return {
          range: `${start + 1}-${Math.min(end, all.length)}`,
          total: all.length,
          projects: sliced.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            description: p.description,
            project_type: p.project_type,
            is_featured: p.is_featured,
            demo_url: p.demo_url,
            repo_url: p.repo_url,
            tech_stacks: p.tech_stacks?.map((t) => t.name) || [],
          })),
        };
      }

      const isAll = q === "all" || q === "semua" || q === "no limit" || q === "nolimit" || !q;

      const matched = all.filter((p) => {
        const matchesQuery =
          isAll ||
          p.title.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.tech_stacks?.some((t) => t.name.toLowerCase().includes(q));

        const matchesType =
          !type ||
          (type === "client" && p.project_type === "client") ||
          (type === "opensource" && p.project_type === "opensource") ||
          (type === "personal" && (!p.project_type || p.project_type === "personal"));

        return matchesQuery && matchesType;
      });

      const limit = args.limit || (isAll ? matched.length : 10);

      return {
        total_found: matched.length,
        projects: matched.slice(0, limit).map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          description: p.description,
          project_type: p.project_type,
          is_featured: p.is_featured,
          demo_url: p.demo_url,
          repo_url: p.repo_url,
          tech_stacks: p.tech_stacks?.map((t) => t.name) || [],
        })),
      };
    }

    case "get_project_detail": {
      const slug = rawQuery || args.slug;
      if (!slug) {
        return { error: "Please provide a project slug." };
      }
      const project = await getProjectBySlug(slug);
      if (!project) {
        return { error: `Project with slug '${slug}' was not found.` };
      }
      return {
        title: project.title,
        slug: project.slug,
        description: project.description,
        long_description: project.long_description,
        project_type: project.project_type,
        demo_url: project.demo_url,
        repo_url: project.repo_url,
        tech_stacks: project.tech_stacks?.map((t) => t.name) || [],
      };
    }

    case "get_tech_stacks": {
      const stacks = await getTechStacks();
      const q = rawQuery.toLowerCase();
      const isAll = q === "all" || q === "semua" || !q;

      const filtered = isAll
        ? stacks
        : stacks.filter(
            (s) =>
              s.category.toLowerCase().includes(q) ||
              s.name.toLowerCase().includes(q)
          );

      return {
        total: filtered.length,
        tech_stacks: filtered.map((s) => ({
          name: s.name,
          category: s.category,
        })),
      };
    }

    case "get_repositories": {
      const [repos, profile] = await Promise.all([
        getGitHubRepositories(),
        getGitHubProfile(),
      ]);

      const q = rawQuery.toLowerCase();

      // Check if range query e.g. "1-5", "5-10", "1 to 5", "5 sampai 10"
      const rangeMatch = q.match(/(\d+)\s*(?:-|to|sampai|\.\.)\s*(\d+)/);
      if (rangeMatch) {
        const startNum = Math.max(1, parseInt(rangeMatch[1], 10));
        const endNum = Math.max(startNum, parseInt(rangeMatch[2], 10));
        const startIndex = startNum - 1;
        const endIndex = endNum;
        const sliced = repos.slice(startIndex, endIndex);

        return {
          range_requested: `${startNum}-${endNum}`,
          returned_count: sliced.length,
          total_repos: repos.length,
          followers: profile?.followers || 0,
          repositories: sliced.map((r, i) => ({
            index: startIndex + i + 1,
            name: r.name,
            description: r.description,
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language,
            url: r.html_url,
          })),
        };
      }

      // Check if keyword query or specific limit
      const isAll = q === "all" || q === "semua" || q === "no limit" || q === "nolimit" || q === "full";

      let filtered = repos;
      if (q && !isAll) {
        const numOnly = q.match(/^(\d+)$/);
        if (numOnly) {
          const count = parseInt(numOnly[1], 10);
          filtered = repos.slice(0, count);
        } else {
          filtered = repos.filter(
            (r) =>
              r.name.toLowerCase().includes(q) ||
              (r.description && r.description.toLowerCase().includes(q)) ||
              (r.language && r.language.toLowerCase().includes(q))
          );
        }
      }

      // If 'all' or no specific limit, return all without limit
      return {
        query_applied: q || "all",
        total_repos: repos.length,
        returned_count: filtered.length,
        followers: profile?.followers || 0,
        repositories: filtered.map((r, i) => ({
          index: i + 1,
          name: r.name,
          description: r.description,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          url: r.html_url,
        })),
      };
    }

    case "get_contact_info": {
      return {
        name: "Mada Putra Adhadriyanto",
        email: "madaadha21@gmail.com",
        linkedin: "https://www.linkedin.com/in/mada-putra-adhadriyanto-063434329/",
        whatsapp: "https://wa.me/6281234489008 (+62 812-3448-9008)",
        telegram: "https://t.me/mazeesid (@mazeesid)",
        github: "https://github.com/Mazees",
        instagram: "https://instagram.com/madaputra21 (@madaputra21)",
        location: "Mojokerto, Jawa Timur, Indonesia",
      };
    }

    case "get_about_info": {
      return {
        name: "Mada Putra Adhadriyanto",
        alias: "Mazees",
        persona: "Agentic AI Explorer · Full-Stack Developer",
        education: "Informatics Student at Universitas Pembangunan Nasional 'Veteran' Jawa Timur",
        specialization: [
          "Agentic AI workflows, LLM tools, Autonomous agents",
          "Modern full-stack web applications (Next.js, React, Tailwind CSS, Supabase)",
          "Cross-platform desktop tools (Electron, Node.js)",
        ],
        interests: "Exploring cutting-edge AI agent systems and creating real-world practical tools.",
      };
    }

    case "compose_contact_message": {
      const topic = args.topic || rawQuery || "Collaboration Inquiry";
      const details = args.details || "";
      const name = args.name || "Guest";

      const formattedMsg = `Halo Mada, saya ${name}. Saya tertarik untuk berdiskusi mengenai: ${topic}.${details ? ` Detail: ${details}` : ""}`;
      const encodedMsg = encodeURIComponent(formattedMsg);

      return {
        status: "drafted",
        subject: topic,
        message_preview: formattedMsg,
        whatsapp_link: `https://wa.me/6281234489008?text=${encodedMsg}`,
        telegram_link: "https://t.me/mazeesid",
        email_link: `mailto:madaadha21@gmail.com?subject=${encodeURIComponent(topic)}&body=${encodedMsg}`,
      };
    }

    case "analyze_project_fit": {
      const stacks = await getTechStacks();
      const projects = await getPublishedProjects();

      return {
        user_requirements: args.requirements || rawQuery || "",
        available_tech_stacks: stacks.map((s) => ({
          name: s.name,
          category: s.category,
        })),
        reference_projects: projects.slice(0, 5).map((p) => ({
          title: p.title,
          slug: p.slug,
          description: p.description,
          tech_stacks: p.tech_stacks?.map((t) => t.name),
        })),
        instruction:
          "Analyze the user's requirements against Mada's tech stacks from the database. Formulate your architectural evaluation, compatibility rating, recommended stack, and relevant projects directly in your final response.",
      };
    }

    case "get_live_github_activity": {
      try {
        const res = await fetch(
          "https://api.github.com/users/Mazees/events/public?per_page=5",
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
              "User-Agent": "Mazees-Portfolio",
              ...(process.env.GITHUB_TOKEN
                ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
                : {}),
            },
            next: { revalidate: 60 },
          }
        );
        if (!res.ok) {
          return {
            message: "GitHub activity currently cached or unavailable.",
            username: "Mazees",
          };
        }
        const events = await res.json();
        return {
          username: "Mazees",
          recent_events_count: Array.isArray(events) ? events.length : 0,
          latest_events: Array.isArray(events)
            ? events.map((e: any) => ({
                type: e.type,
                repo: e.repo?.name,
                created_at: e.created_at,
                summary: e.payload?.commits
                  ? `${e.payload.commits.length} commits pushed`
                  : e.type,
              }))
            : [],
        };
      } catch (err: any) {
        return { message: "Unable to fetch live GitHub events.", error: err.message };
      }
    }

    default:
      return { error: `Tool '${name}' is not recognized.` };
  }
}
