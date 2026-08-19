'use client';

import React, { useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Strikethrough,
  Quote,
  Code,
  FileCode,
  Link2,
  List,
  ListOrdered,
  Table,
  Minus,
  Eye,
  Edit3,
  Sparkles,
} from 'lucide-react';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write full description with markdown...',
  rows = 10,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Helper function to insert markdown tags around selection or at cursor position
   */
  function insertFormat(prefix: string, suffix: string = '', defaultPlaceholder: string = 'text') {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || defaultPlaceholder;

    const replacement = `${prefix}${textToInsert}${suffix}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + replacement.length);
      } else {
        const cursorStart = start + prefix.length;
        textarea.setSelectionRange(cursorStart, cursorStart + textToInsert.length);
      }
    }, 10);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Shortcuts: Ctrl+B / Cmd+B for bold, Ctrl+I for italic, Ctrl+K for link
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      insertFormat('**', '**', 'bold text');
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      insertFormat('*', '*', 'italic text');
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      insertFormat('[', '](https://example.com)', 'link text');
    }
  }

  return (
    <div className="border border-border/80 rounded-2xl overflow-hidden bg-background shadow-md">
      {/* Top Bar: Visual Toolbar & View Mode Switcher */}
      <div className="bg-surface border-b border-border p-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Formatting Toolbar */}
        {tab === 'write' ? (
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => insertFormat('**', '**', 'bold text')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all font-bold"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat('*', '*', 'italic text')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat('~~', '~~', 'strikethrough')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-border mx-1" />

            <button
              type="button"
              onClick={() => insertFormat('\n## ', '\n', 'Heading 2')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat('\n### ', '\n', 'Heading 3')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-border mx-1" />

            <button
              type="button"
              onClick={() => insertFormat('`', '`', 'code')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all font-mono"
              title="Inline Code"
            >
              <Code className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat('\n```typescript\n', '\n```\n', '// your code here')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all font-mono"
              title="Code Block"
            >
              <FileCode className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat('\n> ', '\n', 'Quote text')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Quote / Blockquote"
            >
              <Quote className="w-4 h-4" />
            </button>

            <div className="w-px h-5 bg-border mx-1" />

            <button
              type="button"
              onClick={() => insertFormat('[', '](https://example.com)', 'Link Title')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Insert Link (Ctrl+K)"
            >
              <Link2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat('\n- ', '\n- item 2\n- item 3', 'item 1')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat('\n1. ', '\n2. item 2\n3. item 3', 'item 1')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() =>
                insertFormat(
                  '\n| Feature | Description |\n|---|---|\n| ',
                  ' | Example description |\n',
                  'Feature Name'
                )
              }
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Insert Table"
            >
              <Table className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => insertFormat('\n---\n', '', '')}
              className="p-2 rounded-lg text-textSecondary hover:text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all"
              title="Horizontal Divider"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="text-xs text-primary font-medium flex items-center space-x-1.5 px-2 py-1">
            <Sparkles className="w-4 h-4" />
            <span>Markdown Live Preview</span>
          </div>
        )}

        {/* Action Controls: Tab Buttons */}
        <div className="flex items-center space-x-2 ml-auto">
          <div className="flex items-center p-1 bg-background rounded-xl border border-border">
            <button
              type="button"
              onClick={() => setTab('write')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                tab === 'write'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                tab === 'preview'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Body */}
      {tab === 'write' ? (
        <textarea
          ref={textareaRef}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-4 bg-background text-textPrimary text-xs font-mono placeholder:text-textSecondary/40 focus:outline-none leading-relaxed resize-y border-none min-h-[220px]"
        />
      ) : (
        <div className="p-6 bg-background min-h-[220px] max-h-[500px] overflow-y-auto">
          {value.trim() ? (
            <MarkdownRenderer content={value} />
          ) : (
            <p className="text-xs text-textSecondary italic text-center py-12">
              No description written yet. Switch to "Write" tab to start typing your markdown.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
