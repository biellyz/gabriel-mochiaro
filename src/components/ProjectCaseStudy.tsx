"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  Film,
  Layers,
  Scissors,
  Sparkles,
} from "lucide-react";
import {
  CATEGORY_TRACK_STYLES,
  getEmbedVideoUrl,
  isEmbedUrl,
  type Project,
  type ProjectCategory,
} from "@/data/projects";
import { MediaThumbnail } from "./MediaThumbnail";

interface ProjectCaseStudyProps {
  project: Project;
  nextProject: Project;
  projectIndex: number;
  totalProjects: number;
}

const PASTEL_DOTS: Record<ProjectCategory, string> = {
  Audiovisual: "#93C5FD",
  Reels: "#C4B5FD",
  Eventos: "#FDBA74",
  Agência: "#6EE7B7",
};

/**
 * Página leve e direta do vídeo (/projetos/[slug]):
 * - Foco imediato em assistir ao vídeo + informações diretas e agradáveis
 * - Sem "Estudo de Caso", sem jargão técnico pesado
 */
export function ProjectCaseStudy({
  project,
  nextProject,
}: ProjectCaseStudyProps) {
  const track = CATEGORY_TRACK_STYLES[project.category];
  const nextTrack = CATEGORY_TRACK_STYLES[nextProject.category];
  const pastelDot = PASTEL_DOTS[project.category];
  const nextPastelDot = PASTEL_DOTS[nextProject.category];
  const isVertical = project.aspectRatio === "9:16";
  const hasYear = Boolean(project.year && project.year !== "—");

  const tools = project.tools?.length
    ? project.tools
    : ["Edição de Vídeo", "Pós-Produção"];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--bg-canvas)] text-[var(--text-primary)]">
      {/* Floating Soft Top Bar */}
      <header className="sticky top-0 z-40 px-4 pt-3 sm:px-6">
        <div className="mx-auto flex h-15 max-w-[1160px] items-center justify-between gap-3 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel)]/90 px-3 shadow-[var(--shadow-soft)] backdrop-blur-xl sm:px-4">
          <Link
            href="/#projetos"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--bg-panel-alt)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent)] sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4 text-[var(--accent)] transition-transform duration-300 group-hover:-translate-x-0.5" />
            <span>Voltar aos projetos</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              aria-label="Ir para o início"
              className="flex items-center gap-2 pr-1 font-display text-sm font-bold text-[var(--text-primary)]"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6C8CFF] via-[#8B7BFF] to-[#65C4B6] text-[11px] font-bold text-white">
                GM
              </span>
              <span className="hidden sm:inline">Gabriel Mochiaro</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1160px] space-y-8 px-4 pt-7 pb-16 sm:space-y-10 sm:px-6 sm:pt-10 sm:pb-20">
        {/* 1. Video First: Clean Title + Immediate Rounded Video Player */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[32px] border border-[var(--border-panel)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-soft)] sm:p-8"
        >
          {/* Soft Metadata Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-3.5 py-1 text-xs font-semibold text-[var(--text-primary)]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: pastelDot }}
              />
              {project.category}
            </span>

            {project.clientOrContext && (
              <span className="rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-3.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                {project.clientOrContext}
              </span>
            )}

            <span className="rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-3.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
              {project.aspectRatio === "16:9"
                ? "Horizontal (16:9)"
                : "Vertical (9:16)"}
            </span>

            {hasYear && (
              <span className="rounded-full bg-[var(--accent-soft)] px-3.5 py-1 text-xs font-semibold text-[var(--accent)]">
                {project.year}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-2xl leading-tight font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
            {project.title}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            {project.summary}
          </p>

          {/* Rounded Video Player */}
          <div className="mt-6 overflow-hidden rounded-[24px] border border-[var(--border-panel)] bg-[#141622] p-2 sm:p-3">
            <div className={isVertical ? "py-2 sm:py-6" : ""}>
              <div
                className={`relative overflow-hidden rounded-2xl bg-[#0F101A] ${
                  isVertical
                    ? "mx-auto aspect-[9/16] max-h-[70dvh] w-full max-w-[390px] shadow-[0_24px_60px_rgba(0,0,0,0.65)] sm:max-h-none"
                    : "aspect-video w-full"
                }`}
              >
                {project.videoUrl ? (
                  isEmbedUrl(project.videoUrl) ? (
                    <iframe
                      src={getEmbedVideoUrl(project.videoUrl)}
                      title={project.title}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={project.videoUrl}
                      controls
                      playsInline
                      className="h-full w-full object-contain"
                    />
                  )
                ) : (
                  <div className="relative flex h-full w-full flex-col items-center justify-center p-6 text-center text-white">
                    <MediaThumbnail
                      src={project.thumbnailUrl}
                      alt={project.title}
                      fallbackGradient={track.fallbackGradient}
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
                    />
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 text-[#93C5FD] backdrop-blur-md">
                      <Film className="h-7 w-7" />
                    </div>
                    <p className="relative z-10 mt-4 font-display text-lg font-bold text-white">
                      {project.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 2. Light & Direct Project Info Cards */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          aria-label="Informações do vídeo"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
              <Scissors className="h-4 w-4 text-[#93C5FD]" />
              <span>Atuação</span>
            </div>
            <p className="mt-2.5 font-display text-sm font-bold text-[var(--text-primary)] sm:text-base">
              {project.role}
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
              <Layers className="h-4 w-4 text-[#C4B5FD]" />
              <span>Categoria</span>
            </div>
            <p className="mt-2.5 flex items-center gap-2 font-display text-sm font-bold text-[var(--text-primary)] sm:text-base">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: pastelDot }}
              />
              <span>{project.category}</span>
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
              <Clapperboard className="h-4 w-4 text-[#FDBA74]" />
              <span>Formato</span>
            </div>
            <p className="mt-2.5 font-display text-sm font-bold text-[var(--text-primary)] sm:text-base">
              {project.aspectRatio === "16:9"
                ? "Widescreen (16:9)"
                : "Vertical (9:16)"}
            </p>
          </div>

          <div className="rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
              <Sparkles className="h-4 w-4 text-[#6EE7B7]" />
              <span>Etapas</span>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full bg-[var(--bg-panel-alt)] px-3 py-1 text-xs font-medium text-[var(--text-primary)]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 3. Next Video Card */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          aria-label="Próximo vídeo"
          className="space-y-4"
        >
          <Link
            href={`/projetos/${nextProject.slug}`}
            className="group relative block overflow-hidden rounded-[32px] border border-[var(--border-panel)] bg-[#1B1D2B] p-6 text-white shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-[#6C8CFF]/60 sm:p-10"
          >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <MediaThumbnail
                src={nextProject.thumbnailUrl}
                alt={nextProject.title}
                fallbackGradient={nextTrack.fallbackGradient}
                className={`h-full w-full object-cover ${
                  nextProject.aspectRatio === "9:16"
                    ? "object-top"
                    : "object-center"
                } opacity-25 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-35`}
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#161824] via-[#161824]/90 to-[#161824]/65"
            />

            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-xs font-semibold text-[#93C5FD]">
                    Próximo vídeo
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-white">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: nextPastelDot }}
                    />
                    {nextProject.category}
                  </span>
                </div>

                <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
                  {nextProject.title}
                </h2>

                <p className="mt-2 max-w-xl text-sm text-[#CBD2E6]">
                  {nextProject.summary}
                </p>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#6C8CFF] text-white shadow-[0_12px_28px_-6px_rgba(108,140,255,0.75)] transition-transform duration-300 group-hover:scale-105">
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          </Link>

          <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)] px-5 py-4 sm:flex-row sm:rounded-full">
            <Link
              href="/#projetos"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-4 w-4 text-[var(--accent)]" />
              <span>Ver todos os projetos</span>
            </Link>

            <Link
              href="/#contato"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#5A7BFF]"
            >
              <span>Vamos criar juntos</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
