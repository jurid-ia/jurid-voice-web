"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";

export function SearchBarTrigger() {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(
      typeof navigator !== "undefined" &&
        /Mac|iPhone|iPad|iPod/.test(navigator.platform),
    );
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full max-w-xl items-center gap-3 rounded-xl border border-stone-200 bg-white/80 px-4 py-2.5 text-left shadow-sm transition-all hover:border-[#AB8E63]/40 hover:shadow focus-visible:border-[#AB8E63] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#AB8E63]/30"
      >
        <Search className="h-4 w-4 text-gray-400" />
        <span className="flex-1 text-sm text-gray-400">
          Buscar reuniões, compromissos, gravações...
        </span>
        <kbd className="hidden rounded-md border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 sm:inline">
          {isMac ? "⌘ K" : "Ctrl K"}
        </kbd>
      </button>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </>
  );
}
