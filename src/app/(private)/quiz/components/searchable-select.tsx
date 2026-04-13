"use client";

import { cn } from "@/utils/cn";
import { Check, ChevronDown, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface SearchableOption {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  loading?: boolean;
  disabledMessage?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum resultado encontrado.",
  disabled = false,
  loading = false,
  disabledMessage,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlighted, setHighlighted] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = useMemo(
    () => options.find((o) => o.value === value),
    [options, value],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return options.filter((o) => {
      const haystack = `${o.label} ${o.sublabel ?? ""}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      return haystack.includes(q);
    });
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlighted(0);
      setTimeout(() => searchRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setHighlighted(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[highlighted];
      if (item) {
        onChange(item.value);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[highlighted] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [highlighted, open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-lg border px-4 text-left text-sm transition-all",
          "hover:border-primary focus:border-primary focus:outline-none",
          "disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-60 disabled:hover:border-neutral-200",
          open ? "border-primary shadow-sm" : "border-neutral-200",
          selected ? "text-neutral-900" : "text-neutral-400",
        )}
      >
        <span className="flex min-w-0 flex-1 items-center gap-2">
          {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />}
          <span className="truncate">
            {loading
              ? "Carregando..."
              : disabled && disabledMessage
                ? disabledMessage
                : selected
                  ? selected.label
                  : placeholder}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-neutral-400 transition-transform",
            open && "rotate-180 text-primary",
          )}
        />
      </button>

      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-neutral-100 px-3 py-2">
            <Search className="h-4 w-4 text-neutral-400" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm text-neutral-800 outline-none placeholder:text-neutral-400"
            />
          </div>
          <ul
            ref={listRef}
            className="max-h-64 overflow-y-auto py-1"
            role="listbox"
          >
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-neutral-400">
                {emptyMessage}
              </li>
            ) : (
              filtered.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlighted;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlighted(idx)}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm transition-colors",
                      isHighlighted && "bg-primary/5",
                      isSelected && "text-primary",
                    )}
                  >
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-medium">{opt.label}</span>
                      {opt.sublabel && (
                        <span className="truncate text-xs text-neutral-400">
                          {opt.sublabel}
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
