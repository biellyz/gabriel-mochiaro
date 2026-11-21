"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Clapperboard,
  FileText,
  Folder,
  FolderOpen,
  Home,
  Mail,
  PlayCircle,
  User,
} from "lucide-react";
import {
  CATEGORY_TRACK_STYLES,
  FILTER_TO_CATEGORY,
  matchesCategory,
  PROJECT_FILTERS,
  PROJECTS,
  type ProjectFilter,
} from "@/data/projects";
import type { WorkspaceNavTarget } from "./WorkspaceTopBar";

interface WorkspaceMediaLibraryProps {
  activeSection: WorkspaceNavTarget;
  activeFilter: ProjectFilter;
  onNavigate: (target: WorkspaceNavTarget) => void;
  onSelectFilter: (filter: ProjectFilter) => void;
  onPlayShowreel: () => void;
}

const DOCK_ACTIONS: readonly {
  id: WorkspaceNavTarget | "reel";
  label: string;
  icon: typeof Home;
}[] = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "projetos", label: "Projetos", icon: Clapperboard },
  { id: "sobre", label: "Sobre Mim", icon: User },
  { id: "contato", label: "Contato", icon: Mail },
  { id: "reel", label: "Assistir Showreel", icon: PlayCircle },
];

/**
 * Coluna Esquerda do NLE Workspace:
 * - Barra vertical escura (#181A1F) com ícones de navegação rápida
 * - Árvore de pastas interativa e expansível:
 *   GABRIEL_MOCHIARO > Projetos (Todos, Reels, Eventos, Agência Experimental UVA Barra), Sobre Mim, Contato
 */
export function WorkspaceMediaLibrary({
  activeSection,
  activeFilter,
  onNavigate,
  onSelectFilter,
  onPlayShowreel,
}: WorkspaceMediaLibraryProps) {
  const [rootOpen, setRootOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);

  return (
    <aside
      aria-label="Dock e Biblioteca de Mídia"
      className="flex h-full overflow-hidden rounded-2xl border border-[var(--border-panel)] bg-[var(--bg-panel)] shadow-[0_14px_34px_-24px_rgba(15,23,42,0.22)]"
    >
      {/* Vertical Dark Tool Dock (#181A1F) */}
      <div className="flex w-12 shrink-0 flex-col items-center justify-between border-r border-white/10 bg-[var(--dock-bg)] py-3">
        <div className="flex flex-col items-center gap-2">
          {DOCK_ACTIONS.map((action) => {
            const Icon = action.icon;
            const isActive = action.id === activeSection;
            return (
              <button
                key={action.id}
                type="button"
                title={action.label}
                aria-label={action.label}
                onClick={() => {
                  if (action.id === "reel") {
                    onPlayShowreel();
                  } else {
                    onNavigate(action.id);
                  }
                }}
                className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-[#3B82F6] text-white shadow-[0_6px_18px_-4px_rgba(59,130,246,0.7)]"
                    : "text-[#9CA3AF] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        <span
          aria-hidden="true"
          className="font-mono text-[9px] tracking-[0.18em] text-[#6B7280] uppercase [writing-mode:vertical-rl]"
        >
          NLE • v2
        </span>
      </div>

      {/* Expandable Media Library Tree */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-3.5 py-2.5">
          <span className="font-mono text-[10px] font-semibold tracking-[0.14em] text-[var(--text-primary)] uppercase">
            Biblioteca de Mídia
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            {PROJECTS.length} itens
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {/* Root Folder: GABRIEL_MOCHIARO */}
          <button
            type="button"
            onClick={() => setRootOpen((prev) => !prev)}
            aria-expanded={rootOpen}
            className="flex w-full cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[var(--bg-panel-alt)]"
          >
            {rootOpen ? (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
            )}
            {rootOpen ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-[#3B82F6]" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-[#3B82F6]" />
            )}
            <span className="truncate font-mono text-[11px] font-semibold text-[var(--text-primary)]">
              GABRIEL_MOCHIARO
            </span>
          </button>

          <AnimatePresence initial={false}>
            {rootOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                className="ml-3.5 overflow-hidden border-l border-[var(--border-panel)] pl-2.5 pt-1"
              >
                {/* Subtree: Projetos */}
                <button
                  type="button"
                  onClick={() => setProjectsOpen((prev) => !prev)}
                  aria-expanded={projectsOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-[var(--bg-panel-alt)]"
                >
                  <span className="flex min-w-0 items-center gap-1.5">
                    {projectsOpen ? (
                      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
                    )}
                    {projectsOpen ? (
                      <FolderOpen className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                    ) : (
                      <Folder className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                    )}
                    <span className="truncate text-xs font-semibold text-[var(--text-primary)]">
                      Projetos
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {PROJECTS.length}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {projectsOpen && (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="ml-3 mt-1 space-y-1 overflow-hidden border-l border-[var(--border-panel)] pl-2"
                    >
                      {PROJECT_FILTERS.map((filter) => {
                        const isActive = activeFilter === filter;
                        const mappedCategory = FILTER_TO_CATEGORY[filter];
                        const dotHex = mappedCategory
                          ? CATEGORY_TRACK_STYLES[mappedCategory].hex
                          : "#3B82F6";
                        const count = PROJECTS.filter((p) =>
                          matchesCategory(p, filter)
                        ).length;

                        return (
                          <li key={filter}>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectFilter(filter);
                                onNavigate("projetos");
                              }}
                              className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                                isActive
                                  ? "bg-[#3B82F6] font-medium text-white shadow-sm"
                                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                              }`}
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor: isActive
                                      ? "#FFFFFF"
                                      : dotHex,
                                  }}
                                />
                                <span className="truncate">{filter}</span>
                              </span>
                              <span className="shrink-0 font-mono text-[10px] opacity-80">
                                {String(count).padStart(2, "0")}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>

                {/* File node: Sobre Mim */}
                <button
                  type="button"
                  onClick={() => onNavigate("sobre")}
                  className={`mt-1.5 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    activeSection === "sobre"
                      ? "bg-[#181A1F] font-medium text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
                  <span>Sobre Mim</span>
                </button>

                {/* File node: Contato */}
                <button
                  type="button"
                  onClick={() => onNavigate("contato")}
                  className={`mt-1 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs transition-colors ${
                    activeSection === "contato"
                      ? "bg-[#181A1F] font-medium text-white"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-[#10B981]" />
                  <span>Contato</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Library Status Bar */}
        <div className="border-t border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-3.5 py-2.5 font-mono text-[10px] text-[var(--text-muted)]">
          <div className="flex items-center justify-between">
            <span>SEQ: MASTER</span>
            <span className="text-[#3B82F6]">24FPS</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
