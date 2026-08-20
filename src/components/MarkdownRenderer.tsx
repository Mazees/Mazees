import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaExternalLinkAlt,
} from 'react-icons/fa';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: "default" | "emerald";
}

export default function MarkdownRenderer({
  content,
  className = "",
  variant = "default",
}: MarkdownRendererProps) {
  const isEmerald = variant === "emerald";
  const markerClass = isEmerald ? "marker:text-emerald-400" : "marker:text-primary";
  const borderQuoteClass = isEmerald ? "border-emerald-500" : "border-primary";
  const codeInlineClass = isEmerald ? "text-emerald-400" : "text-primary-light";
  const linkClass = isEmerald
    ? "text-emerald-400 hover:text-emerald-300 underline decoration-emerald-400/40 underline-offset-2 transition-colors font-medium"
    : "text-primary hover:text-primary-light underline decoration-primary/40 underline-offset-2 transition-colors font-medium";

  const processedContent = useMemo(() => {
    if (!content) return "";
    // Turn naked emails into mailto links if they are not already in a markdown link
    return content.replace(
      /(?<!\[[^\]]*\]\()(?<!mailto:)\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g,
      "[Kirim Email ($1)](mailto:$1)"
    );
  }, [content]);

  if (!content) return null;

  return (
    <div
      className={`markdown-content space-y-4 text-textSecondary text-sm leading-relaxed ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1
              className="text-2xl md:text-3xl font-bold text-textPrimary mt-8 mb-4 border-b border-border pb-2"
              {...props}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-xl md:text-2xl font-bold text-textPrimary mt-6 mb-3 flex items-center space-x-2"
              {...props}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-lg font-semibold text-textPrimary mt-5 mb-2"
              {...props}
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              className="text-base font-semibold text-textPrimary mt-4 mb-2"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="mb-4 leading-relaxed text-textSecondary text-sm"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className={`list-disc list-outside pl-5 mb-4 space-y-1.5 ${markerClass}`}
              {...props}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className={`list-decimal list-outside pl-5 mb-4 space-y-1.5 font-medium ${markerClass}`}
              {...props}
            />
          ),
          li: ({ node, ...props }) => (
            <li
              className="text-textSecondary text-sm leading-relaxed"
              {...props}
            />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className={`border-l-4 ${borderQuoteClass} pl-4 py-1.5 my-4 bg-surface/60 rounded-r-xl italic text-textSecondary`}
              {...props}
            />
          ),
          code: ({ node, className, children, ...props }: any) => {
            const isInline =
              !className &&
              typeof children === "string" &&
              !children.includes("\n");
            if (isInline) {
              return (
                <code
                  className={`px-1.5 py-0.5 rounded-none bg-surface border border-border ${codeInlineClass} font-mono text-xs`}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                className="block p-4 rounded-none bg-surface border border-border text-textPrimary font-mono text-xs overflow-x-auto my-4"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="overflow-x-auto rounded-none my-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 border border-border rounded-none">
              <table
                className="w-full text-left text-xs border-collapse divide-y divide-border"
                {...props}
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead
              className="bg-surface text-textPrimary font-semibold"
              {...props}
            />
          ),
          th: ({ node, ...props }) => (
            <th
              className="p-3 border-b border-border font-semibold text-textPrimary"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td
              className="p-3 border-b border-border/50 text-textSecondary"
              {...props}
            />
          ),
          a: ({ node, href, children, ...props }: any) => {
            const linkUrl = String(href || "");
            const isWa = linkUrl.includes("wa.me") || linkUrl.includes("whatsapp");
            const isTele = linkUrl.includes("t.me") || linkUrl.includes("telegram");
            const isMail = linkUrl.startsWith("mailto:") || linkUrl.includes("@gmail.com");
            const isLinkedIn = linkUrl.includes("linkedin.com");
            const isGitHub = linkUrl.includes("github.com");

            const label = typeof children === "string" ? children : "";
            const isRawUrl = label.startsWith("http://") || label.startsWith("https://") || label.startsWith("mailto:");

            if (isWa) {
              return (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-medium transition-all shadow-[0_0_12px_rgba(31,184,84,0.15)] hover:shadow-[0_0_16px_rgba(31,184,84,0.3)] my-1 mr-2 no-underline"
                  {...props}
                >
                  <FaWhatsapp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{!isRawUrl && label ? label : "Hubungi via WhatsApp"}</span>
                </a>
              );
            }

            if (isTele) {
              return (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 text-sky-400 text-xs font-mono font-medium transition-all shadow-[0_0_12px_rgba(14,165,233,0.15)] hover:shadow-[0_0_16px_rgba(14,165,233,0.3)] my-1 mr-2 no-underline"
                  {...props}
                >
                  <FaTelegramPlane className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{!isRawUrl && label ? label : "Chat via Telegram"}</span>
                </a>
              );
            }

            if (isMail) {
              return (
                <a
                  href={linkUrl.startsWith("mailto:") ? linkUrl : `mailto:${linkUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-400 text-xs font-mono font-medium transition-all shadow-[0_0_12px_rgba(244,63,94,0.15)] hover:shadow-[0_0_16px_rgba(244,63,94,0.3)] my-1 mr-2 no-underline"
                  {...props}
                >
                  <FaEnvelope className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{!isRawUrl && label ? label : "Kirim Email"}</span>
                </a>
              );
            }

            if (isLinkedIn) {
              return (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-400 text-xs font-mono font-medium transition-all shadow-[0_0_12px_rgba(59,130,246,0.15)] hover:shadow-[0_0_16px_rgba(59,130,246,0.3)] my-1 mr-2 no-underline"
                  {...props}
                >
                  <FaLinkedin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{!isRawUrl && label ? label : "LinkedIn Profile"}</span>
                </a>
              );
            }

            if (isGitHub) {
              return (
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs font-mono font-medium transition-all my-1 mr-2 no-underline"
                  {...props}
                >
                  <FaGithub className="w-3.5 h-3.5 shrink-0" />
                  <span>{children}</span>
                </a>
              );
            }

            return (
              <a
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
                {...props}
              >
                {children}
              </a>
            );
          },
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-border" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img
              className="rounded-none border border-border my-6 max-h-[450px] w-full object-cover shadow-lg"
              {...props}
            />
          ),
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
