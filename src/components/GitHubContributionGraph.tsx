'use client';

import React, { useEffect, useState, useRef } from 'react';
import { GitHubCalendar } from 'react-github-calendar';
import { Loader2 } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

interface GitHubContributionGraphProps {
  username?: string;
}

export default function GitHubContributionGraph({
  username = 'Mazees',
}: GitHubContributionGraphProps) {
  const [mounted, setMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-scroll all the way to the right when calendar data finishes loading & rendering
  useEffect(() => {
    if (!mounted || !scrollContainerRef.current) return;
    const el = scrollContainerRef.current;

    const scrollToRight = () => {
      if (el) {
        el.scrollLeft = el.scrollWidth;
      }
    };

    // Watch for when GitHubCalendar finishes async network fetch and injects the SVG
    const mutationObserver = new MutationObserver(() => {
      scrollToRight();
    });
    mutationObserver.observe(el, { childList: true, subtree: true, attributes: true });

    const resizeObserver = new ResizeObserver(() => {
      scrollToRight();
    });
    resizeObserver.observe(el);

    // Multiple backup timers to guarantee scroll after data loads
    const t1 = setTimeout(scrollToRight, 100);
    const t2 = setTimeout(scrollToRight, 400);
    const t3 = setTimeout(scrollToRight, 800);
    const t4 = setTimeout(scrollToRight, 1500);
    const t5 = setTimeout(scrollToRight, 2500);

    return () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [mounted]);

  const customTheme = {
    dark: ['#1c1c1c', '#7c2d12', '#c2410c', '#ea580c', '#f97316'],
    light: ['#1c1c1c', '#7c2d12', '#c2410c', '#ea580c', '#f97316'],
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-2">
            // GitHub Activity
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight">
            My Activity On Github
          </h1>
        </div>

        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-textSecondary hover:text-primary transition-colors py-2 px-4 rounded-xl bg-surface hover:bg-border border border-border self-start sm:self-auto shrink-0 group"
        >
          <FaGithub className="w-4 h-4 text-textPrimary group-hover:text-primary transition-colors" />
          <span>Visit @{username} on GitHub</span>
        </a>
      </div>

      {/* Calendar Viewport (Frameless, Auto-scrolled to the right) */}
      <div
        ref={scrollContainerRef}
        className="w-full overflow-x-auto py-4 scrollbar-none min-h-[160px] flex md:justify-center items-center"
      >
        <div className="min-w-fit shrink-0">
          {mounted ? (
            <GitHubCalendar
              username={username}
              colorScheme="dark"
              theme={customTheme}
              blockSize={16}
              blockMargin={4}
              fontSize={12}
              labels={{
                totalCount: '{{count}} contributions in the last year',
              }}
              renderBlock={(block, activity) =>
                React.cloneElement(block, {
                  onClick: () => {
                    window.open(
                      `https://github.com/${username}?tab=overview&from=${activity.date}&to=${activity.date}#year-list-container`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  },
                  style: {
                    ...block.props.style,
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, filter 0.15s ease',
                  },
                  children: (
                    <title>{`${activity.count} contributions on ${activity.date}`}</title>
                  ),
                })
              }
            />
          ) : (
            <div className="flex items-center space-x-2 text-textSecondary text-xs py-8">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Loading contribution activity...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
