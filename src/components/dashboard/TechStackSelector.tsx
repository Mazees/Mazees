'use client';

import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import type { TechStack } from '@/types/techstack';
import TechIcon from '@/components/TechIcon';

interface TechStackSelectorProps {
  availableTechStacks: TechStack[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export default function TechStackSelector({
  availableTechStacks,
  selectedIds,
  onChange,
}: TechStackSelectorProps) {
  const [search, setSearch] = useState('');

  function toggleId(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((item) => item !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  const filtered = availableTechStacks.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-textSecondary absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter tech stack..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-xl text-xs text-textPrimary placeholder:text-textSecondary/50 focus:outline-none focus:border-primary transition-all"
        />
      </div>

      <div className="max-h-52 overflow-y-auto p-2 bg-background/50 border border-border rounded-xl flex flex-wrap gap-1.5">
        {filtered.length === 0 ? (
          <div className="text-xs text-textSecondary p-2 w-full text-center">
            No matching tech stack found.
          </div>
        ) : (
          filtered.map((tech) => {
            const isSelected = selectedIds.includes(tech.id);
            return (
              <button
                key={tech.id}
                type="button"
                onClick={() => toggleId(tech.id)}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface hover:bg-border text-textSecondary border border-border hover:text-textPrimary'
                }`}
              >
                {isSelected ? (
                  <Check className="w-3 h-3 shrink-0" />
                ) : (
                  <TechIcon
                    name={tech.name}
                    icon={tech.icon}
                    iconUrl={tech.icon_url}
                    color={tech.color}
                    className="w-3 h-3 shrink-0"
                  />
                )}
                <span>{tech.name}</span>
              </button>
            );
          })
        )}
      </div>

      <div className="text-[11px] text-textSecondary flex items-center justify-between">
        <span>Selected: <strong className="text-primary">{selectedIds.length}</strong> technologies</span>
      </div>
    </div>
  );
}
