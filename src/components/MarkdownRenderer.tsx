'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={`markdown-content space-y-4 text-textSecondary text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl md:text-3xl font-bold text-textPrimary mt-8 mb-4 border-b border-border pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl md:text-2xl font-bold text-textPrimary mt-6 mb-3 flex items-center space-x-2" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold text-textPrimary mt-5 mb-2" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-base font-semibold text-textPrimary mt-4 mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-4 leading-relaxed text-textSecondary text-sm" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5 marker:text-primary" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal list-outside pl-5 mb-4 space-y-1.5 marker:text-primary font-medium" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-textSecondary text-sm leading-relaxed" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-1.5 my-4 bg-surface/60 rounded-r-xl italic text-textSecondary" {...props} />
          ),
          code: ({ node, className, children, ...props }: any) => {
            const isInline = !className && typeof children === 'string' && !children.includes('\n');
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded-md bg-surface border border-border text-primary-light font-mono text-xs" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="block p-4 rounded-xl bg-surface border border-border text-textPrimary font-mono text-xs overflow-x-auto my-4" {...props}>
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre className="overflow-x-auto rounded-xl my-4" {...props} />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 border border-border rounded-xl">
              <table className="w-full text-left text-xs border-collapse divide-y divide-border" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-surface text-textPrimary font-semibold" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="p-3 border-b border-border font-semibold text-textPrimary" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="p-3 border-b border-border/50 text-textSecondary" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light underline decoration-primary/40 underline-offset-2 transition-colors font-medium"
              {...props}
            />
          ),
          hr: ({ node, ...props }) => (
            <hr className="my-8 border-border" {...props} />
          ),
          img: ({ node, ...props }) => (
            <img className="rounded-2xl border border-border my-6 max-h-[450px] w-full object-cover shadow-lg" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
