"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Play,
  Sparkles,
} from "lucide-react";
import {
  CATEGORY_TRACK_STYLES,
  CONTACT_LINKS,
  type Project,
} from "@/data/projects";
import { MediaThumbnail } from "./MediaThumbnail";

export type InspectorTabId = "projeto" | "informacoes";

interface WorkspaceInspectorProps {
  activeTab: InspectorTabId;
  onChangeTab: (tab: InspectorTabId) => void;
  selectedProject: Project;
  onPreviewProject: (project: Project) => void;
}

const EXPERTISE_AREAS = [
  "Edição de Vídeo",
  "Pós-Produção",
  "Projetos Audiovisuais Gerais",
  "Cobertura de Eventos",
  "Reels e Novelas Verticais",
] as const;

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const CONTACT_ITEMS = [
  { key: "whatsapp", icon: MessageCircle, ...CONTACT_LINKS.whatsapp },
  { key: "email", icon: Mail, ...CONTACT_LINKS.email },
  { key: "instagram", icon: InstagramIcon, ...CONTACT_LINKS.instagram },
  { key: "linkedin", icon: LinkedInIcon, ...CONTACT_LINKS.linkedin },
] as const;

/**
 * Painel Direito (Inspetor) do NLE Workspace:
 * - Aba "Projeto" (padrão): Sobre Mim (texto exato) + Áreas de atuação (5 tags exatas)
 * - Aba "Informações": Detalhes do projeto ativo (Estudo de Caso + Preview) + Links de Contato
 */
export function WorkspaceInspector({
  activeTab,
  onChangeTab,
  selectedProject,
  onPreviewProject,
}: WorkspaceInspectorProps) {
  const track = CATEGORY_TRACK_STYLES[selectedProject.category];
  const hasYear = Boolean(selectedProject.year && selectedProject.year !== "—");

  return (
    <aside
      aria-label="Inspetor de Projeto e Informações"
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border-panel)] bg-[var(--bg-panel)] shadow-[0_14px_34px_-24px_rgba(15,23,42,0.22)]"
    >
      {/* Inspector Tab Bar */}
      <div className="flex items-center justify-between border-b border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-3 py-2">
        <div
          role="tablist"
          aria-label="Abas do Inspetor"
          className="flex items-center gap-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "projeto"}
            onClick={() => onChangeTab("projeto")}
            className={`relative cursor-pointer rounded-lg px-3 py-1.5 font-mono text-[11px] font-medium transition-colors ${
              activeTab === "projeto"
                ? "text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {activeTab === "projeto" && (
              <motion.span
                layoutId="inspector-tab-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-[var(--tab-active-bg)]"
              />
            )}
            <span className="relative z-10">Projeto</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "informacoes"}
            onClick={() => onChangeTab("informacoes")}
            className={`relative cursor-pointer rounded-lg px-3 py-1.5 font-mono text-[11px] font-medium transition-colors ${
              activeTab === "informacoes"
                ? "text-white"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {activeTab === "informacoes" && (
              <motion.span
                layoutId="inspector-tab-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-lg bg-[var(--tab-active-bg)]"
              />
            )}
            <span className="relative z-10">Informações</span>
          </button>
        </div>

        <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)] uppercase">
          INSPETOR
        </span>
      </div>

      {/* Inspector Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        <AnimatePresence mode="wait">
          {activeTab === "projeto" ? (
            <motion.div
              key="inspector-projeto"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="space-y-5"
            >
              <div>
                <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#3B82F6] uppercase">
                  SOBRE MIM
                </p>
                <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--text-primary)]">
                  Sou Gabriel Mochiaro, um criativo focado no audiovisual e nas
                  mídias digitais. Unindo os conhecimentos da Publicidade com a
                  prática do mercado, atuo de ponta a ponta em projetos de
                  comunicação: desde a captação e edição de vídeo até a produção
                  de conteúdo e marketing.
                </p>
              </div>

              <div className="border-t border-[var(--border-panel)] pt-4">
                <p className="flex items-center gap-1.5 font-mono text-[10px] font-semibold tracking-[0.16em] text-[var(--text-secondary)] uppercase">
                  <Sparkles className="h-3.5 w-3.5 text-[#3B82F6]" />
                  <span>Áreas de atuação</span>
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {EXPERTISE_AREAS.map((area) => (
                    <span
                      key={area}
                      className="rounded-lg border border-[var(--border-panel)] bg-[var(--bg-surface)] px-2.5 py-1.5 font-mono text-[11px] font-medium text-[var(--text-primary)] transition-colors hover:border-[#3B82F6]"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Switch to Contact / Active Clip */}
              <div className="rounded-xl border border-[var(--border-panel)] bg-[#181A1F] p-3.5 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] tracking-[0.12em] text-[#93C5FD] uppercase">
                    CLIPE ATIVO
                  </span>
                  <span className="font-mono text-[10px] text-[#9CA3AF]">
                    {selectedProject.aspectRatio}
                  </span>
                </div>
                <p className="mt-1.5 truncate font-display text-sm font-semibold text-white">
                  {selectedProject.title}
                </p>
                <button
                  type="button"
                  onClick={() => onChangeTab("informacoes")}
                  className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#3B82F6] px-3 py-2 font-mono text-[10px] font-medium tracking-[0.1em] text-white uppercase transition-colors hover:bg-[#2563EB]"
                >
                  <span>Ver detalhes &amp; contato</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="inspector-informacoes"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="space-y-5"
            >
              {/* Selected Project Details */}
              <div className="overflow-hidden rounded-xl border border-[#14161B]/15 bg-[#14161B] text-white">
                <div className="relative aspect-video w-full overflow-hidden bg-[#0E1014]">
                  <MediaThumbnail
                    src={selectedProject.thumbnailUrl}
                    alt={selectedProject.title}
                    fallbackGradient={track.fallbackGradient}
                    className={`h-full w-full object-cover ${
                      selectedProject.aspectRatio === "9:16"
                        ? "object-top"
                        : "object-center"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14161B] via-transparent to-black/35" />
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#14161B]/90 px-2.5 py-0.5 font-mono text-[10px] text-white">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: track.hex }}
                    />
                    {selectedProject.category}
                  </span>
                  {hasYear && (
                    <span className="absolute top-2.5 right-2.5 rounded-full bg-[#14161B]/90 px-2 py-0.5 font-mono text-[10px] text-white">
                      {selectedProject.year}
                    </span>
                  )}
                </div>

                <div className="p-3.5">
                  <h3 className="font-display text-sm font-bold leading-snug text-white">
                    {selectedProject.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[#B4BAC6]">
                    {selectedProject.summary}
                  </p>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onPreviewProject(selectedProject)}
                      className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#3B82F6] px-3 py-2 font-mono text-[10px] font-medium tracking-[0.1em] text-white uppercase hover:bg-[#2563EB]"
                    >
                      <Play className="h-3 w-3 fill-white" />
                      <span>Preview</span>
                    </button>
                    <Link
                      href={`/projetos/${selectedProject.slug}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 font-mono text-[10px] font-medium tracking-[0.1em] text-white uppercase hover:border-[#3B82F6]"
                    >
                      <span>Estudo</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Direct Contact Links */}
              <div className="border-t border-[var(--border-panel)] pt-4">
                <p className="font-mono text-[10px] font-semibold tracking-[0.16em] text-[#3B82F6] uppercase">
                  CONTATO DIRETO
                </p>

                <div className="mt-2.5 space-y-2">
                  {CONTACT_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isExternal = item.href.startsWith("http");
                    return (
                      <a
                        key={item.key}
                        href={item.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={isExternal ? "noopener noreferrer" : undefined}
                        className="group flex items-center justify-between gap-2 rounded-xl border border-[var(--border-panel)] bg-[var(--bg-surface)] px-3 py-2.5 transition-colors hover:border-[#3B82F6]"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#181A1F] text-[#60A5FA]">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-display text-xs font-semibold text-[var(--text-primary)]">
                              {item.label}
                            </p>
                            <p className="truncate font-mono text-[10px] text-[var(--text-muted)]">
                              {item.handle}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[var(--text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#3B82F6]" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
}
