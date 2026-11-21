"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Play,
  Sparkles,
} from "lucide-react";
import {
  CATEGORY_TRACK_STYLES,
  FILTER_TO_CATEGORY,
  matchesCategory,
  PROJECT_FILTERS,
  PROJECTS,
  type Project,
  type ProjectCategory,
  type ProjectFilter,
} from "@/data/projects";
import { MediaThumbnail } from "./MediaThumbnail";

interface ProjectsSectionProps {
  activeFilter: ProjectFilter;
  selectedProjectId: string;
  onChangeFilter: (filter: ProjectFilter) => void;
  onSelectProject: (project: Project) => void;
  onPreviewProject: (project: Project) => void;
}

type ViewMode = "grid" | "list";
type MobileViewMode = "column" | "carousel";

const PASTEL_DOTS: Record<ProjectCategory, string> = {
  Audiovisual: "#93C5FD",
  Reels: "#C4B5FD",
  Eventos: "#FDBA74",
  Agência: "#6EE7B7",
};

/**
 * Card cinematográfico, arredondado e direto ao vídeo:
 * - Clique na capa ou botão Play abre o vídeo imediatamente
 * - Título clicável mantém acesso leve à página /projetos/[slug] sem botões pesados
 */
function SoftProjectCard({
  project,
  isSelected,
  onSelect,
  onPreview,
}: {
  project: Project;
  isSelected: boolean;
  onSelect: (project: Project) => void;
  onPreview: (project: Project) => void;
}) {
  const track = CATEGORY_TRACK_STYLES[project.category];
  const pastelDot = PASTEL_DOTS[project.category];
  const isVertical = project.aspectRatio === "9:16";
  const hasYear = Boolean(project.year && project.year !== "—");
  const subtitleMeta = hasYear
    ? `${project.category} • ${project.year}`
    : `${project.category} • ${project.aspectRatio}`;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => onSelect(project)}
      className={`group flex flex-col overflow-hidden rounded-3xl border bg-[var(--bg-surface)] shadow-[0_14px_34px_-22px_rgba(4,6,18,0.65)] transition-all duration-300 hover:-translate-y-1 ${
        isSelected
          ? "border-[#C4B5FD]/65 ring-2 ring-[#C4B5FD]/25"
          : "border-[var(--border-panel)] hover:border-[#6E94FF]/55"
      }`}
    >
      {/* Thumbnail — Clean, Uncluttered, Direct Play */}
      <div
        onClick={() => {
          onSelect(project);
          onPreview(project);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onSelect(project);
            onPreview(project);
          }
        }}
        aria-label={`Assistir ${project.title}`}
        className="relative aspect-video w-full cursor-pointer overflow-hidden bg-[#0D0F17]"
      >
        <MediaThumbnail
          src={project.thumbnailUrl}
          alt={project.title}
          fallbackGradient={track.fallbackGradient}
          className={`h-full w-full object-cover ${
            isVertical ? "object-top" : "object-center"
          } transition-transform duration-500 ease-out group-hover:scale-105`}
        />

        {/* Delicate Format Pill */}
        <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#0D0F17]/88 px-2.5 py-1 text-[11px] font-medium text-white lg:bg-[#0D0F17]/78 lg:backdrop-blur-sm">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: pastelDot }}
          />
          {project.aspectRatio}
        </span>
      </div>

      {/* Soft Readable Card Footer */}
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-sm font-bold tracking-tight text-[var(--text-primary)]">
            <Link
              href={`/projetos/${project.slug}`}
              className="transition-colors hover:text-[var(--accent)]"
            >
              {project.title}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
            {subtitleMeta}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            onSelect(project);
            onPreview(project);
          }}
          aria-label={`Reproduzir ${project.title}`}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#6E94FF] text-white shadow-[0_8px_20px_-6px_rgba(110,148,255,0.75)] transition-transform duration-200 hover:scale-105 hover:bg-[#5B83FA]"
        >
          <Play className="ml-0.5 h-4 w-4 fill-white" />
        </button>
      </div>
    </motion.article>
  );
}

/**
 * Galeria de Projetos cinematográfica, curva e espaçosa:
 * - Filtros: Todos, Reels, Eventos, Agência Experimental UVA Barra
 * - Alternador Grade/Lista (desktop) e Lista/Carrossel (mobile)
 */
export function ProjectsSection({
  activeFilter,
  selectedProjectId,
  onChangeFilter,
  onSelectProject,
  onPreviewProject,
}: ProjectsSectionProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [mobileViewMode, setMobileViewMode] =
    useState<MobileViewMode>("column");
  const [showAllProjects, setShowAllProjects] = useState(false);

  const filteredProjects = PROJECTS.filter((project) =>
    matchesCategory(project, activeFilter)
  );

  const isAllFilter = activeFilter === "Todos";
  const hasMoreToShow = isAllFilter && filteredProjects.length > 4;
  const visibleProjects =
    hasMoreToShow && !showAllProjects
      ? filteredProjects.slice(0, 4)
      : filteredProjects;
  const hiddenCount = filteredProjects.length - visibleProjects.length;

  return (
    <section
      id="projetos"
      aria-label="Galeria de Projetos"
      className="scroll-mt-24 overflow-hidden rounded-[28px] border border-[var(--border-panel)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-soft)] sm:p-7"
    >
      {/* Clean Header & Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--lavender-soft)] text-[#C4B5FD]">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
                  Projetos
                </h2>
                <span className="rounded-full bg-[var(--bg-panel-alt)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">
                  {filteredProjects.length}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Clique em qualquer vídeo para assistir na hora
              </p>
            </div>
          </div>

          {/* Mobile Lista / Carrossel Pill */}
          <div className="inline-flex rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] p-1 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileViewMode("column")}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                mobileViewMode === "column"
                  ? "bg-[var(--tab-active-bg)] text-white"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              Lista
            </button>
            <button
              type="button"
              onClick={() => setMobileViewMode("carousel")}
              className={`cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                mobileViewMode === "carousel"
                  ? "bg-[var(--tab-active-bg)] text-white"
                  : "text-[var(--text-secondary)]"
              }`}
            >
              Carrossel
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Filtros de projetos"
            className="filmstrip-scroll flex max-w-full items-center gap-2 overflow-x-auto pb-1 lg:pb-0"
          >
            {PROJECT_FILTERS.map((filter) => {
              const isActive = activeFilter === filter;
              const mappedCategory = FILTER_TO_CATEGORY[filter];
              const dotHex = mappedCategory
                ? PASTEL_DOTS[mappedCategory]
                : "#93C5FD";

              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onChangeFilter(filter)}
                  className={`relative inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "border-transparent text-white"
                      : "border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-[var(--text-primary)]"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="workspace-filter-pill"
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-full bg-[var(--accent)] shadow-[0_8px_20px_-6px_rgba(110,148,255,0.65)]"
                    />
                  )}
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: isActive ? "#FFFFFF" : dotHex,
                      }}
                    />
                    <span>{filter}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Desktop Grade / Lista Pill */}
          <div className="hidden shrink-0 items-center rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] p-1 lg:inline-flex">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Visualização em grade"
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-[var(--tab-active-bg)] text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grade</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="Visualização em lista"
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--tab-active-bg)] text-white"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Lista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Body */}
      <div className="mt-6">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-6 py-14 text-center">
            <p className="text-xs font-semibold text-[var(--accent)]">
              {activeFilter}
            </p>
            <p className="mt-2 font-display text-lg font-bold text-[var(--text-primary)]">
              Novos vídeos desta categoria chegando em breve
            </p>
            <button
              type="button"
              onClick={() => onChangeFilter("Todos")}
              className="mt-5 cursor-pointer rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#5B83FA]"
            >
              Ver todos os projetos
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Gallery (< 1024px) */}
            <div className="lg:hidden">
              {mobileViewMode === "carousel" ? (
                <div className="filmstrip-scroll flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
                  {visibleProjects.map((project) => (
                    <div
                      key={project.id}
                      className="w-[84vw] max-w-[360px] shrink-0 snap-start"
                    >
                      <SoftProjectCard
                        project={project}
                        isSelected={project.id === selectedProjectId}
                        onSelect={onSelectProject}
                        onPreview={onPreviewProject}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {visibleProjects.map((project) => (
                    <SoftProjectCard
                      key={project.id}
                      project={project}
                      isSelected={project.id === selectedProjectId}
                      onSelect={onSelectProject}
                      onPreview={onPreviewProject}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Gallery (lg+) */}
            <div className="hidden lg:block">
              {viewMode === "grid" ? (
                <motion.div
                  layout
                  className="grid grid-cols-3 gap-5 xl:grid-cols-4"
                >
                  <AnimatePresence mode="popLayout">
                    {visibleProjects.map((project) => (
                      <SoftProjectCard
                        key={project.id}
                        project={project}
                        isSelected={project.id === selectedProjectId}
                        onSelect={onSelectProject}
                        onPreview={onPreviewProject}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  {visibleProjects.map((project) => {
                    const track = CATEGORY_TRACK_STYLES[project.category];
                    const isSelected = project.id === selectedProjectId;
                    const isVertical = project.aspectRatio === "9:16";
                    const hasYear = Boolean(
                      project.year && project.year !== "—"
                    );

                    return (
                      <div
                        key={project.id}
                        onMouseEnter={() => onSelectProject(project)}
                        className={`flex items-center justify-between gap-4 rounded-2xl border bg-[var(--bg-surface)] p-3 transition-colors ${
                          isSelected
                            ? "border-[#C4B5FD]/65 ring-2 ring-[#C4B5FD]/20"
                            : "border-[var(--border-panel)] hover:border-[#6E94FF]/50"
                        }`}
                      >
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            onClick={() => onPreviewProject(project)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                onPreviewProject(project);
                              }
                            }}
                            className="relative h-14 w-24 shrink-0 cursor-pointer overflow-hidden rounded-xl bg-[#0D0F17]"
                          >
                            <MediaThumbnail
                              src={project.thumbnailUrl}
                              alt={project.title}
                              fallbackGradient={track.fallbackGradient}
                              className={`h-full w-full object-cover ${
                                isVertical ? "object-top" : "object-center"
                              }`}
                            />
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/projetos/${project.slug}`}
                              className="block truncate font-display text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent)]"
                            >
                              {project.title}
                            </Link>
                            <p className="mt-0.5 truncate text-xs text-[var(--text-secondary)]">
                              {project.category}
                              {hasYear
                                ? ` • ${project.year}`
                                : ` • ${project.aspectRatio}`}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onPreviewProject(project)}
                          aria-label={`Reproduzir ${project.title}`}
                          className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full bg-[#6E94FF] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#5B83FA]"
                        >
                          <Play className="h-3.5 w-3.5 fill-white" />
                          <span>Assistir</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Expand / Collapse Button on Default "Todos" View */}
            {hasMoreToShow && (
              <div className="mt-7 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllProjects((prev) => !prev)}
                  className="inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-6 py-2.5 text-xs font-semibold text-[var(--text-primary)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-[var(--bg-surface)] sm:text-sm"
                >
                  <span>
                    {showAllProjects
                      ? "Ver menos projetos"
                      : "Ver mais projetos"}
                  </span>
                  {!showAllProjects && hiddenCount > 0 && (
                    <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 font-mono text-[11px] font-semibold text-[var(--accent)]">
                      +{hiddenCount}
                    </span>
                  )}
                  {showAllProjects ? (
                    <ChevronUp className="h-4 w-4 text-[var(--accent)]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-[var(--accent)]" />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
