"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Play, Search, Volume2, VolumeX, X } from "lucide-react";
import {
  matchesCategory,
  PROJECT_FILTERS,
  PROJECTS,
  type Project,
  type ProjectCategory,
  type ProjectFilter,
} from "@/data/projects";
import { useStudioSound } from "@/lib/studioSound";

export type WorkspaceNavTarget = "inicio" | "projetos" | "sobre" | "contato";

interface WorkspaceTopBarProps {
  activeSection: WorkspaceNavTarget;
  activeFilter: ProjectFilter;
  onNavigate: (target: WorkspaceNavTarget) => void;
  onSelectFilter: (filter: ProjectFilter) => void;
  onSelectProject: (project: Project) => void;
  onPreviewProject: (project: Project) => void;
  onPlayShowreel?: () => void;
}

const NAV_TABS: readonly {
  id: WorkspaceNavTarget;
  label: string;
  href: string;
}[] = [
  { id: "inicio", label: "Início", href: "#inicio" },
  { id: "projetos", label: "Projetos", href: "#projetos" },
  { id: "sobre", label: "Sobre", href: "#sobre" },
  { id: "contato", label: "Contato", href: "#contato" },
];

const PASTEL_CATEGORY_DOT: Record<ProjectCategory, string> = {
  Audiovisual: "#93C5FD",
  Reels: "#C4B5FD",
  Eventos: "#FDBA74",
  Agência: "#6EE7B7",
};

export function WorkspaceTopBar({
  activeSection,
  activeFilter,
  onNavigate,
  onSelectFilter,
  onSelectProject,
  onPreviewProject,
  onPlayShowreel,
}: WorkspaceTopBarProps) {
  const { soundEnabled, toggleSound } = useStudioSound();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setMobileDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? PROJECTS.filter((project) => {
        const haystack = [
          project.title,
          project.category,
          project.clientOrContext ?? "",
          project.year,
          project.aspectRatio,
          project.summary,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalizedQuery);
      })
    : PROJECTS.slice(0, 6);

  return (
    <>
      <header className="safe-px sticky top-0 z-40 max-w-full pt-3">
        <div className="mx-auto max-w-[1280px] rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel)]/88 shadow-[var(--shadow-soft)] backdrop-blur-xl">
          <div className="flex h-14 items-center justify-between gap-2 px-2.5 sm:h-15 sm:gap-3 sm:px-4">
            {/* Left: Cute GM Squircle + Name */}
            <a
              href="#inicio"
              onClick={(event) => {
                event.preventDefault();
                onNavigate("inicio");
              }}
              className="flex min-w-0 items-center gap-2 pl-0.5 transition-opacity hover:opacity-85 sm:gap-2.5 sm:pl-1"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C8CFF] via-[#8B7BFF] to-[#65C4B6] font-display text-[11px] font-bold tracking-[-0.04em] text-white shadow-[0_8px_20px_-6px_rgba(108,140,255,0.65)] sm:h-9 sm:w-9 sm:text-xs">
                GM
              </span>
              <span className="truncate font-display text-xs font-bold tracking-tight text-[var(--text-primary)] sm:text-sm">
                Gabriel Mochiaro
              </span>
            </a>

            {/* Center: Soft Rounded Pill Navigation */}
            <nav
              aria-label="Navegação principal"
              className="hidden items-center gap-1 rounded-full bg-[var(--bg-panel-alt)] p-1 lg:flex"
            >
              {NAV_TABS.map((tab) => {
                const isActive = activeSection === tab.id;
                return (
                  <a
                    key={tab.id}
                    href={tab.href}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(tab.id);
                    }}
                    className={`relative rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "text-white"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="topbar-active-tab"
                        transition={{
                          type: "spring",
                          stiffness: 360,
                          damping: 30,
                        }}
                        className="absolute inset-0 rounded-full bg-[var(--tab-active-bg)] shadow-[0_6px_16px_-4px_rgba(108,140,255,0.65)]"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right: Availability Pill + Search + Sound + Mobile Menu */}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => onNavigate("contato")}
                className="hidden cursor-pointer items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/12 px-3.5 py-1.5 text-xs font-medium text-[#86EFAC] transition-colors hover:bg-emerald-400/20 md:inline-flex"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span>Disponível</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen((prev) => !prev)}
                aria-label="Buscar projetos"
                aria-expanded={searchOpen}
                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-all lg:h-9 lg:w-9 ${
                  searchOpen
                    ? "border-transparent bg-[var(--accent)] text-white shadow-[0_6px_16px_-4px_rgba(108,140,255,0.7)]"
                    : "border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-primary)] hover:border-[var(--accent)]/60"
                }`}
              >
                <Search className="h-4 w-4" />
              </button>

              <button
                type="button"
                data-sound="custom"
                onClick={toggleSound}
                aria-label={
                  soundEnabled
                    ? "Desativar sons da interface"
                    : "Ativar sons da interface"
                }
                aria-pressed={soundEnabled}
                title={soundEnabled ? "Som ativado" : "Som silenciado"}
                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-all lg:h-9 lg:w-9 ${
                  soundEnabled
                    ? "border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-primary)] hover:border-[var(--accent)]/60"
                    : "border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-muted)] opacity-75 hover:opacity-100"
                }`}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4 text-[#6EE7B7]" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileDrawerOpen((prev) => !prev)}
                aria-label={
                  mobileDrawerOpen ? "Fechar menu" : "Abrir menu de navegação"
                }
                aria-expanded={mobileDrawerOpen}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]/60 lg:hidden"
              >
                {mobileDrawerOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Soft Floating Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-2.5 max-w-[1280px] overflow-hidden rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)]/95 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:p-5"
            >
              <div className="flex items-center gap-2.5 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-4 py-2.5">
                <Search className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Buscar vídeo por nome, categoria ou formato..."
                  className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="cursor-pointer rounded-full px-2.5 py-0.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    Limpar
                  </button>
                )}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.length > 0 ? (
                  searchResults.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between gap-2.5 rounded-2xl border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-3.5 py-2.5"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProject(project);
                          setSearchOpen(false);
                          onNavigate("projetos");
                        }}
                        className="min-w-0 flex-1 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor:
                                PASTEL_CATEGORY_DOT[project.category],
                            }}
                          />
                          <span>{project.category}</span>
                          <span>•</span>
                          <span>{project.aspectRatio}</span>
                        </div>
                        <p className="truncate font-display text-sm font-semibold text-[var(--text-primary)]">
                          {project.title}
                        </p>
                      </button>

                      <div className="flex shrink-0 items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            onPreviewProject(project);
                            setSearchOpen(false);
                          }}
                          aria-label={`Assistir ${project.title}`}
                          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-white transition-transform hover:scale-105"
                        >
                          <Play className="ml-0.5 h-3.5 w-3.5 fill-white" />
                        </button>
                        <Link
                          href={`/projetos/${project.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel)] px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)]"
                        >
                          Abrir
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-2 text-sm text-[var(--text-muted)]">
                    Nenhum vídeo encontrado para &ldquo;{searchQuery}&rdquo;.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Cozy Mobile Drawer (< 1024px) */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm lg:hidden"
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="flex h-full w-[86vw] max-w-[330px] flex-col rounded-r-[32px] border-r border-[var(--border-panel)] bg-[var(--bg-panel)] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-panel)] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C8CFF] via-[#8B7BFF] to-[#65C4B6] font-display text-xs font-bold text-white">
                    GM
                  </span>
                  <span className="font-display text-sm font-bold text-[var(--text-primary)]">
                    Menu
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Fechar menu"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[var(--bg-panel-alt)] text-[var(--text-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto p-5">
                {/* Main Sections */}
                <div>
                  <p className="mb-2.5 text-xs font-semibold text-[var(--text-muted)]">
                    Navegação
                  </p>
                  <div className="space-y-2">
                    {NAV_TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          onNavigate(tab.id);
                          setMobileDrawerOpen(false);
                        }}
                        className={`flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-colors ${
                          activeSection === tab.id
                            ? "bg-[var(--accent)] text-white shadow-[0_8px_20px_-6px_rgba(108,140,255,0.65)]"
                            : "bg-[var(--bg-panel-alt)] text-[var(--text-primary)]"
                        }`}
                      >
                        <span>{tab.label}</span>
                      </button>
                    ))}

                    {onPlayShowreel && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileDrawerOpen(false);
                          onPlayShowreel();
                        }}
                        className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[var(--accent)]/35 bg-[var(--accent-soft)] px-4 py-3 text-sm font-semibold text-[var(--accent)]"
                      >
                        <Play className="h-4 w-4 fill-current" />
                        <span>Assistir Showreel</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Filters */}
                <div>
                  <p className="mb-2.5 text-xs font-semibold text-[var(--text-muted)]">
                    Categorias
                  </p>
                  <div className="space-y-2">
                    {PROJECT_FILTERS.map((filter) => {
                      const count = PROJECTS.filter((p) =>
                        matchesCategory(p, filter)
                      ).length;
                      const isActive = activeFilter === filter;
                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => {
                            onSelectFilter(filter);
                            onNavigate("projetos");
                            setMobileDrawerOpen(false);
                          }}
                          className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-2xl border px-4 py-2.5 text-left text-xs font-semibold transition-colors ${
                            isActive
                              ? "border-transparent bg-[var(--accent)] text-white"
                              : "border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-primary)]"
                          }`}
                        >
                          <span className="truncate">{filter}</span>
                          <span className="rounded-full bg-black/15 px-2 py-0.5 text-[11px]">
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border-panel)] px-5 py-4 text-xs font-medium text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>Disponível para projetos</span>
                </span>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
