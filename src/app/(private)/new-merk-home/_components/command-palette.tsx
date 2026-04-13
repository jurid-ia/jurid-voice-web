"use client";

import { cn } from "@/utils/cn";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  CalendarClock,
  CheckSquare,
  CornerDownLeft,
  FileAudio,
  Search,
  User,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { searchIndexMock } from "../_mocks/search-index";
import { SearchResult, SearchResultCategory } from "../_types";
import { useDebouncedValue } from "./use-debounced-value";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryConfig: Record<
  SearchResultCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  meeting: {
    label: "Reuniões",
    icon: CalendarClock,
    color: "text-blue-600 bg-blue-50",
  },
  commitment: {
    label: "Compromissos",
    icon: CheckSquare,
    color: "text-amber-600 bg-amber-50",
  },
  recording: {
    label: "Gravações",
    icon: FileAudio,
    color: "text-[#8f7652] bg-[#AB8E63]/10",
  },
  client: {
    label: "Clientes",
    icon: User,
    color: "text-emerald-600 bg-emerald-50",
  },
};

const categoryOrder: SearchResultCategory[] = [
  "meeting",
  "commitment",
  "recording",
  "client",
];

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const nText = normalize(text);
  const nQuery = normalize(query);
  const idx = nText.indexOf(nQuery);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-[#AB8E63]/30 px-0.5 text-gray-900">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface GroupedResults {
  category: SearchResultCategory;
  items: SearchResult[];
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query, 250);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const { grouped, flat } = useMemo(() => {
    const q = normalize(debounced.trim());
    const filtered = q
      ? searchIndexMock.filter(
          (r) =>
            normalize(r.title).includes(q) ||
            (r.subtitle && normalize(r.subtitle).includes(q)),
        )
      : searchIndexMock.slice(0, 16);

    const byCategory = new Map<SearchResultCategory, SearchResult[]>();
    for (const cat of categoryOrder) byCategory.set(cat, []);
    for (const r of filtered) byCategory.get(r.category)?.push(r);

    const grouped: GroupedResults[] = categoryOrder
      .map((cat) => ({ category: cat, items: byCategory.get(cat) || [] }))
      .filter((g) => g.items.length > 0);

    const flat: SearchResult[] = grouped.flatMap((g) => g.items);
    return { grouped, flat };
  }, [debounced]);

  useEffect(() => {
    setActiveIndex(0);
  }, [debounced]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      // Mock: just log and close
      console.log("[new-merk-home] search select:", result);
      onOpenChange(false);
    },
    [onOpenChange],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (flat.length === 0 ? 0 : (i + 1) % flat.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        flat.length === 0 ? 0 : (i - 1 + flat.length) % flat.length,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (flat[activeIndex]) handleSelect(flat[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-active="true"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let runningIndex = -1;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          onKeyDown={handleKeyDown}
          data-lenis-prevent
          className="fixed left-1/2 top-[12%] z-50 flex w-[95vw] max-w-2xl -translate-x-1/2 flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          <DialogPrimitive.Title className="sr-only">
            Busca universal
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Pesquise reuniões, compromissos, gravações e clientes
          </DialogPrimitive.Description>

          <div className="flex items-center gap-3 border-b border-stone-200 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar reuniões, compromissos, gravações, clientes..."
              aria-label="Campo de busca"
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none focus-visible:outline-none"
            />
            <DialogPrimitive.Close
              className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-stone-100 hover:text-gray-700"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </div>

          <div
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto p-2"
            role="listbox"
          >
            {grouped.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <Search className="h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-500">
                  Nenhum resultado para &ldquo;{debounced}&rdquo;
                </p>
                <p className="text-xs text-gray-400">
                  Tente outro termo ou revise a grafia
                </p>
              </div>
            ) : (
              grouped.map((group) => {
                const cfg = categoryConfig[group.category];
                const Icon = cfg.icon;
                return (
                  <div key={group.category} className="mb-2 last:mb-0">
                    <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      {cfg.label}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {group.items.map((r) => {
                        runningIndex += 1;
                        const isActive = runningIndex === activeIndex;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            data-active={isActive}
                            onMouseEnter={() => setActiveIndex(runningIndex)}
                            onClick={() => handleSelect(r)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                              isActive ? "bg-stone-100" : "hover:bg-stone-50",
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                cfg.color,
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-gray-800">
                                {highlightMatch(r.title, debounced)}
                              </p>
                              {r.subtitle && (
                                <p className="truncate text-xs text-gray-500">
                                  {highlightMatch(r.subtitle, debounced)}
                                </p>
                              )}
                            </div>
                            {r.meta && (
                              <span className="shrink-0 text-[11px] text-gray-400">
                                {r.meta}
                              </span>
                            )}
                            {isActive && (
                              <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-stone-200 bg-stone-50 px-4 py-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 text-[9px] font-medium">
                  ↑
                </kbd>
                <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 text-[9px] font-medium">
                  ↓
                </kbd>
                navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 text-[9px] font-medium">
                  Enter
                </kbd>
                abrir
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-stone-300 bg-white px-1 py-0.5 text-[9px] font-medium">
                  Esc
                </kbd>
                fechar
              </span>
            </div>
            <span>{flat.length} resultado(s)</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
