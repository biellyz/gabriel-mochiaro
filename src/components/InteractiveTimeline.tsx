"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Film,
  Maximize2,
  Music2,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import {
  CATEGORY_TRACK_STYLES,
  getEmbedVideoUrl,
  isEmbedUrl,
  type Project,
  type ProjectCategory,
} from "@/data/projects";
import { MediaThumbnail } from "./MediaThumbnail";
import { playTimelineTick } from "@/lib/studioSound";

interface InteractiveTimelineProps {
  projects: Project[];
  activeProjectId: string;
  isAudioSync?: boolean;
  onSelectProject: (project: Project) => void;
  onPreviewProject: (project: Project) => void;
}

const PASTEL_CLIP_THEMES: Record<
  ProjectCategory,
  {
    dot: string;
    cardBg: string;
    cardActiveBg: string;
    cardBorder: string;
    badgeBg: string;
    badgeText: string;
    lightBadgeText: string;
    glow: string;
  }
> = {
  Audiovisual: {
    dot: "#93C5FD",
    cardBg: "rgba(147, 197, 253, 0.08)",
    cardActiveBg: "rgba(147, 197, 253, 0.19)",
    cardBorder: "rgba(147, 197, 253, 0.34)",
    badgeBg: "rgba(147, 197, 253, 0.16)",
    badgeText: "#BFDBFE",
    lightBadgeText: "#1D4ED8",
    glow: "rgba(147, 197, 253, 0.22)",
  },
  Reels: {
    dot: "#C4B5FD",
    cardBg: "rgba(196, 181, 253, 0.09)",
    cardActiveBg: "rgba(196, 181, 253, 0.21)",
    cardBorder: "rgba(196, 181, 253, 0.36)",
    badgeBg: "rgba(196, 181, 253, 0.16)",
    badgeText: "#DDD6FE",
    lightBadgeText: "#6D28D9",
    glow: "rgba(196, 181, 253, 0.24)",
  },
  Eventos: {
    dot: "#FDBA74",
    cardBg: "rgba(253, 186, 116, 0.09)",
    cardActiveBg: "rgba(253, 186, 116, 0.21)",
    cardBorder: "rgba(253, 186, 116, 0.36)",
    badgeBg: "rgba(253, 186, 116, 0.16)",
    badgeText: "#FED7AA",
    lightBadgeText: "#C2410C",
    glow: "rgba(253, 186, 116, 0.22)",
  },
  Agência: {
    dot: "#6EE7B7",
    cardBg: "rgba(110, 231, 183, 0.08)",
    cardActiveBg: "rgba(110, 231, 183, 0.19)",
    cardBorder: "rgba(110, 231, 183, 0.34)",
    badgeBg: "rgba(110, 231, 183, 0.16)",
    badgeText: "#A7F3D0",
    lightBadgeText: "#047857",
    glow: "rgba(110, 231, 183, 0.22)",
  },
};

const AUDIO_WAVEFORM = [
  32, 54, 40, 74, 62, 36, 84, 66, 48, 90, 58, 42, 78, 64, 46, 86, 60, 38, 72,
  50, 80, 60, 44, 76, 54, 36, 68, 80, 48, 64, 40, 76, 56, 46, 70, 52, 76, 56,
  64, 44, 78, 54,
];

const MOBILE_WAVEFORM = [
  34, 58, 44, 78, 62, 40, 86, 68, 48, 82, 56, 42, 74, 60, 46, 84, 58, 38, 70,
  52, 78, 54, 44, 72, 50, 38, 66, 76,
];

/**
 * Player de Preview com autoplay mudo automático (carrega apenas o vídeo do clipe selecionado):
 * - Alterna som ao vivo (YouTube postMessage / video.muted) sem recarregar o player
 * - Mantém enquadramento elegante para 16:9 e 9:16 + botão discreto de som e tela cheia
 */
function AutoplayPreviewStage({
  project,
  pastel,
  trackFallback,
  shouldMountPlayer,
  muted,
  compactMobile = false,
  onToggleMute,
  onExpand,
}: {
  project: Project;
  pastel: (typeof PASTEL_CLIP_THEMES)[ProjectCategory];
  trackFallback: string;
  shouldMountPlayer: boolean;
  muted: boolean;
  compactMobile?: boolean;
  onToggleMute: () => void;
  onExpand: () => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVertical = project.aspectRatio === "9:16";
  const hasVideo = Boolean(project.videoUrl);
  const isEmbed = hasVideo && isEmbedUrl(project.videoUrl);

  useEffect(() => {
    if (!shouldMountPlayer) return;

    if (videoRef.current) {
      videoRef.current.muted = muted;
      return;
    }

    if (isEmbed && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: muted ? "mute" : "unMute",
          args: [],
        }),
        "*"
      );
    }
  }, [muted, shouldMountPlayer, isEmbed]);

  const mediaInner = (
    <div className="relative h-full w-full overflow-hidden bg-[#0B0D14]">
      {/* Poster Thumbnail Shown Immediately While Embed Buffers */}
      <MediaThumbnail
        src={project.thumbnailUrl}
        alt={project.title}
        fallbackGradient={trackFallback}
        className={`h-full w-full object-cover ${
          isVertical ? "object-top" : "object-center"
        }`}
      />

      {shouldMountPlayer && hasVideo && (
        isEmbed ? (
          <iframe
            ref={iframeRef}
            key={`preview-embed-${project.id}`}
            src={getEmbedVideoUrl(project.videoUrl, {
              autoplay: true,
              muted: true,
              loop: true,
              controls: false,
            })}
            title={`Preview automático — ${project.title}`}
            className="pointer-events-none absolute inset-0 h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <video
            ref={videoRef}
            key={`preview-video-${project.id}`}
            src={project.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        )
      )}
    </div>
  );

  return (
    <div
      className={`group relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#10131C] ${
        isVertical
          ? compactMobile
            ? "flex h-[226px] items-center justify-center p-2.5"
            : "flex h-[242px] items-center justify-center p-3"
          : "aspect-video"
      }`}
    >
      {isVertical ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 45%, ${pastel.glow}, transparent 68%)`,
            }}
          />
          <div className="relative z-10 aspect-[9/16] h-full overflow-hidden rounded-xl border border-white/15 bg-[#0B0D14] shadow-[0_16px_34px_-10px_rgba(0,0,0,0.8)]">
            {mediaInner}
          </div>
        </>
      ) : (
        mediaInner
      )}

      {/* Top-Left Category / Format Pill */}
      <span className="pointer-events-none absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#0D0F17]/82 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: pastel.dot }}
        />
        <span>
          {compactMobile
            ? `${project.category} • ${project.aspectRatio}`
            : project.aspectRatio}
        </span>
      </span>

      {/* Top-Right Discreet Mute/Unmute + Expand Video Controls */}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5">
        {hasVideo && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onToggleMute();
            }}
            aria-label={
              muted ? "Ativar som do preview" : "Silenciar som do preview"
            }
            title={muted ? "Ativar som" : "Silenciar"}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#0D0F17]/82 text-white backdrop-blur-md transition-colors hover:border-[#6E94FF] hover:bg-[#161B2B]"
          >
            {muted ? (
              <VolumeX className="h-3.5 w-3.5 text-[#CBD3E8]" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-[#6EE7B7]" />
            )}
          </button>
        )}

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onExpand();
          }}
          aria-label={`Abrir ${project.title} em destaque`}
          title="Abrir vídeo em destaque"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-[#0D0F17]/82 text-white backdrop-blur-md transition-colors hover:border-[#6E94FF] hover:bg-[#161B2B]"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/**
 * Conjunto Timeline + Preview:
 * - Preview reproduz automaticamente no mudo apenas o clipe selecionado (com botão de som e destaque)
 * - Desktop (lg+): Timeline unificada sem espaço vazio no meio, trilhas de vídeo e áudio equivalentes
 * - Mobile (< 1024px): Preview compacto no topo -> Controles -> Timeline horizontal logo abaixo
 */
export function InteractiveTimeline({
  projects,
  activeProjectId,
  isAudioSync = false,
  onSelectProject,
  onPreviewProject,
}: InteractiveTimelineProps) {
  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean | null>(
    null
  );
  const [previewMuted, setPreviewMuted] = useState(true);
  const desktopRailRef = useRef<HTMLDivElement>(null);
  const mobileRailRef = useRef<HTMLDivElement>(null);
  const desktopClipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const mobileClipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hasMountedRef = useRef(false);

  // Garante que apenas UM player de preview (desktop OU mobile) fique montado por vez
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const updateViewport = () => setIsDesktopViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);
    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  const activeIndex = Math.max(
    0,
    projects.findIndex((p) => p.id === activeProjectId)
  );
  const activeProject = projects[activeIndex] ?? projects[0];

  // Sempre inicia o novo clipe selecionado em mudo ao trocar de projeto
  useEffect(() => {
    const id = window.setTimeout(() => setPreviewMuted(true), 0);
    return () => window.clearTimeout(id);
  }, [activeProject?.id]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (!activeProject) return;

    const scrollCenter = (
      rail: HTMLDivElement | null,
      el: HTMLButtonElement | null
    ) => {
      if (!rail || !el) return;
      const targetLeft =
        el.offsetLeft - rail.clientWidth / 2 + el.clientWidth / 2;
      rail.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: "smooth",
      });
    };

    scrollCenter(desktopRailRef.current, desktopClipRefs.current[activeProject.id]);
    scrollCenter(mobileRailRef.current, mobileClipRefs.current[activeProject.id]);
  }, [activeProject]);

  if (projects.length === 0 || !activeProject) return null;

  const activeTrack = CATEGORY_TRACK_STYLES[activeProject.category];
  const activePastel = PASTEL_CLIP_THEMES[activeProject.category];

  const playheadPercent =
    projects.length === 1
      ? 50
      : ((activeIndex + 0.5) / projects.length) * 100;

  const formattedIndex = String(activeIndex + 1).padStart(2, "0");
  const formattedTotal = String(projects.length).padStart(2, "0");

  const handleStep = (delta: number) => {
    playTimelineTick();
    const nextIdx = (activeIndex + delta + projects.length) % projects.length;
    onSelectProject(projects[nextIdx]);
  };

  const handleScrub = (rawValue: number) => {
    const clamped = Math.max(0, Math.min(projects.length - 1, rawValue));
    if (clamped !== activeIndex) {
      playTimelineTick();
      onSelectProject(projects[clamped]);
    }
  };

  const handleSelectClip = (clip: Project) => {
    playTimelineTick();
    onSelectProject(clip);
  };

  return (
    <section aria-label="Timeline interativa e preview de vídeos">
      {/* =================================================================
          MOBILE & FOLDABLE (< 1024px) — CAPCUT-INSPIRED SOFT STUDIO CARD
          - Tela externa 5,36" (< md): Preview compacto -> Controles -> Timeline
          - Tela interna dobrável 7,6" (md:): Preview + Controles lado a lado -> Timeline ampla
         ================================================================= */}
      <div className="max-w-full overflow-hidden rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)] p-4 shadow-[var(--shadow-soft)] sm:p-5 lg:hidden">
        {/* Top Compact Bar */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <Film className="h-4 w-4" />
            </span>
            <span className="truncate font-display text-sm font-bold text-[var(--text-primary)] sm:text-base">
              Preview &amp; Timeline
            </span>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-3 py-1 font-mono text-[11px] font-semibold text-[var(--text-primary)] tabular-nums">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: activePastel.dot }}
            />
            {formattedIndex} / {formattedTotal}
          </span>
        </div>

        {/* 1 & 2. Preview + Info/Controls (Stacked on 5.36" cover, Side-by-Side on 7.6" unfolded md:) */}
        <div className="md:grid md:grid-cols-12 md:items-center md:gap-5">
          <div className="min-w-0 md:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={`mobile-preview-${activeProject.id}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              >
                <AutoplayPreviewStage
                  project={activeProject}
                  pastel={activePastel}
                  trackFallback={activeTrack.fallbackGradient}
                  shouldMountPlayer={isDesktopViewport === false}
                  muted={previewMuted}
                  compactMobile
                  onToggleMute={() => setPreviewMuted((prev) => !prev)}
                  onExpand={() => onPreviewProject(activeProject)}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="min-w-0 md:col-span-5 md:flex md:flex-col md:justify-between">
            <div className="mt-3 flex items-center justify-between gap-2 px-0.5 md:mt-0">
              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-bold text-[var(--text-primary)] md:line-clamp-2 md:whitespace-normal md:text-lg">
                  {activeProject.title}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-[var(--text-secondary)] md:mt-1.5 md:line-clamp-3">
                  {activeProject.summary}
                </p>
              </div>
              <Link
                href={`/projetos/${activeProject.slug}`}
                aria-label={`Abrir página de ${activeProject.title}`}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-secondary)]"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            {/* CapCut-Style Transport Bar (Anterior | Assistir vídeo | Próximo) */}
            <div className="mt-3.5 flex items-center gap-2 md:mt-5">
              <button
                type="button"
                data-sound="custom"
                onClick={() => handleStep(-1)}
                aria-label="Vídeo anterior"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-primary)] active:scale-95"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                data-primary-cta="true"
                onClick={() => onPreviewProject(activeProject)}
                className="studio-accent-bg inline-flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-3.5 text-xs font-semibold text-white shadow-[0_10px_24px_-6px_rgba(110,148,255,0.65)] active:scale-[0.99] sm:px-4 sm:text-sm"
              >
                <Play className="h-4 w-4 shrink-0 fill-white" />
                <span className="truncate">Assistir vídeo</span>
              </button>

              <button
                type="button"
                data-sound="custom"
                onClick={() => handleStep(1)}
                aria-label="Próximo vídeo"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-primary)] active:scale-95"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. CapCut-Style Mobile Timeline Bed Directly Below (Tightly Paired Video + Audio) */}
        <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#12151E] p-3 text-white">
          {/* Top Thin Scrubber Track */}
          <div className="relative mb-2.5 flex h-5 items-center">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                animate={{ width: `${playheadPercent}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="h-full rounded-full bg-gradient-to-r from-[#93C5FD] via-[#C4B5FD] to-[#6EE7B7]"
              />
            </div>
            <motion.span
              aria-hidden="true"
              animate={{ left: `${playheadPercent}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              style={{ backgroundColor: "var(--studio-accent)" }}
              className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white shadow-[0_0_10px_rgba(196,181,253,0.85)] transition-colors duration-400"
            />
            <input
              type="range"
              aria-label="Deslizar agulha da timeline mobile"
              min={0}
              max={Math.max(0, projects.length - 1)}
              step={1}
              value={activeIndex}
              onChange={(event) => handleScrub(Number(event.target.value))}
              className="absolute inset-0 z-30 cursor-ew-resize opacity-0"
            />
          </div>

          {/* Tightly Stacked Video + Audio Tracks */}
          <div className="relative space-y-2">
            {/* Synchronized Vertical Playhead Line */}
            <motion.div
              aria-hidden="true"
              animate={{ left: `${playheadPercent}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="pointer-events-none absolute inset-y-0 z-20 w-[2px] -translate-x-1/2 rounded-full bg-white/85 shadow-[0_0_10px_rgba(196,181,253,0.85)]"
            />

            {/* Mobile Video Track */}
            <div
              ref={mobileRailRef}
              className="filmstrip-scroll flex items-stretch gap-2 overflow-x-auto pb-0.5"
            >
              {projects.map((clip, idx) => {
                const clipTrack = CATEGORY_TRACK_STYLES[clip.category];
                const pastel = PASTEL_CLIP_THEMES[clip.category];
                const clipIsVertical = clip.aspectRatio === "9:16";
                const isSelected = clip.id === activeProject.id;

                return (
                  <button
                    key={clip.id}
                    ref={(el) => {
                      mobileClipRefs.current[clip.id] = el;
                    }}
                    type="button"
                    data-sound="custom"
                    onClick={() => handleSelectClip(clip)}
                    style={{
                      backgroundColor: isSelected
                        ? pastel.cardActiveBg
                        : pastel.cardBg,
                      borderColor: isSelected ? pastel.dot : pastel.cardBorder,
                    }}
                    className={`flex h-[74px] w-[178px] shrink-0 cursor-pointer items-center gap-2.5 overflow-hidden rounded-2xl border p-1.5 text-left transition-all ${
                      isSelected ? "ring-1 ring-white/30" : "opacity-80"
                    }`}
                  >
                    <div className="relative h-full w-13 shrink-0 overflow-hidden rounded-xl bg-[#0B0D14]">
                      <MediaThumbnail
                        src={clip.thumbnailUrl}
                        alt={clip.title}
                        fallbackGradient={clipTrack.fallbackGradient}
                        className={`h-full w-full object-cover ${
                          clipIsVertical ? "object-top" : "object-center"
                        }`}
                      />
                      <span className="absolute right-1 bottom-1 rounded-full bg-black/70 px-1.5 py-0.5 font-mono text-[8px] text-white">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pr-1">
                      <span className="line-clamp-2 font-display text-[11px] leading-tight font-semibold text-white">
                        {clip.title}
                      </span>
                      <span
                        className="mt-1 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                        style={{
                          backgroundColor: pastel.badgeBg,
                          color: pastel.badgeText,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: pastel.dot }}
                        />
                        <span className="truncate">{clip.category}</span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mobile Aligned Audio Track (Equivalent Visual Weight) */}
            <div className="relative flex h-[68px] items-center overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0D1018] px-3">
              <motion.div
                aria-hidden="true"
                animate={{ width: `${playheadPercent}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-[#93C5FD]/14 via-[#C4B5FD]/18 to-[#6EE7B7]/16"
              />

              <span className="pointer-events-none absolute top-1.5 left-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-[#12151E]/85 px-2 py-0.5 text-[9px] font-medium text-[#A7F3D0]">
                <Music2 className="h-2.5 w-2.5" />
                <span>Áudio</span>
              </span>

              <div className="relative z-10 flex h-10 w-full items-center gap-[4px] pt-2">
                {MOBILE_WAVEFORM.map((height, idx) => {
                  const barPercent =
                    ((idx + 0.5) / MOBILE_WAVEFORM.length) * 100;
                  const isBeforePlayhead = barPercent <= playheadPercent;

                  return (
                    <motion.span
                      key={`m-wave-${idx}`}
                      animate={
                        isAudioSync
                          ? { scaleY: [0.3, 1.15, 0.35, 0.95, 0.3] }
                          : { scaleY: [0.74, 1, 0.78] }
                      }
                      transition={{
                        duration: isAudioSync
                          ? 0.5 + (idx % 4) * 0.06
                          : 2 + (idx % 4) * 0.25,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.025,
                      }}
                      className={`flex-1 rounded-full ${
                        isBeforePlayhead || isAudioSync
                          ? "bg-gradient-to-t from-[#6EE7B7] via-[#93C5FD] to-[#C4B5FD] opacity-95"
                          : "bg-white/20 opacity-55"
                      }`}
                      style={{
                        height: `${Math.max(24, height)}%`,
                        willChange: "transform",
                      }}
                    />
                  );
                })}
              </div>

              <input
                type="range"
                aria-label="Navegar pela trilha de áudio"
                min={0}
                max={Math.max(0, projects.length - 1)}
                step={1}
                value={activeIndex}
                onChange={(event) => handleScrub(Number(event.target.value))}
                className="absolute inset-0 z-30 cursor-ew-resize opacity-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================
          DESKTOP (lg+) — ZERO-HOLE TIMELINE WITH EQUAL-HEIGHT VIDEO & AUDIO
          + HARMONIOUS PREVIEW CARD BESIDE IT
         ================================================================= */}
      <div className="hidden grid-cols-12 items-stretch gap-5 lg:grid">
        {/* LEFT: COHESIVE TIMELINE (lg:col-span-7 xl:col-span-8) */}
        <div className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-soft)] lg:col-span-7 xl:col-span-8">
          {/* Top Header */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Film className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
                  Timeline
                </h2>
                <p className="truncate text-xs text-[var(--text-muted)]">
                  Clique em um clipe ou deslize a agulha nas trilhas
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-3.5 py-1.5 font-mono text-xs font-semibold text-[var(--text-primary)] tabular-nums">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: activePastel.dot }}
              />
              <span>
                {formattedIndex} / {formattedTotal}
              </span>
            </span>
          </div>

          {/* Unified Track Bed (#12151E) — ZERO HOLE! Tightly Stacked Equal-Height Tracks */}
          <div className="mt-4 flex flex-1 flex-col justify-center overflow-hidden rounded-2xl border border-white/[0.07] bg-[#12151E] p-4 text-white">
            {/* Sleek Integrated Playhead Rail at Top of Tracks */}
            <div className="relative mb-3 flex h-6 items-center px-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ width: `${playheadPercent}%` }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#93C5FD] via-[#C4B5FD] to-[#6EE7B7]"
                />
              </div>

              <motion.span
                aria-hidden="true"
                animate={{ left: `${playheadPercent}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                style={{ backgroundColor: "var(--studio-accent)" }}
                className="pointer-events-none absolute z-20 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white shadow-[0_0_14px_rgba(196,181,253,0.9)] transition-colors duration-400"
              />

              <input
                type="range"
                aria-label="Deslizar agulha da timeline entre projetos"
                min={0}
                max={Math.max(0, projects.length - 1)}
                step={1}
                value={activeIndex}
                onChange={(event) => handleScrub(Number(event.target.value))}
                className="absolute inset-0 z-30 cursor-ew-resize opacity-0"
              />
            </div>

            {/* Tightly Paired Video Track + Equal-Height Audio Track with Unified Vertical Needle */}
            <div className="relative space-y-2.5">
              {/* Synchronized Vertical Playhead Line Spanning BOTH Video & Audio Tracks */}
              <motion.div
                aria-hidden="true"
                animate={{ left: `${playheadPercent}%` }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="pointer-events-none absolute inset-y-0 z-20 w-[2px] -translate-x-1/2 rounded-full bg-white/85 shadow-[0_0_14px_rgba(196,181,253,0.9)]"
              />

              {/* 1. VIDEO TRACK (h-[108px]) */}
              <div className="relative rounded-2xl border border-white/[0.06] bg-[#0D1018] p-2">
                <div
                  ref={desktopRailRef}
                  className="filmstrip-scroll flex items-stretch gap-2.5 overflow-x-auto pb-1"
                >
                  {projects.map((clip, idx) => {
                    const clipTrack = CATEGORY_TRACK_STYLES[clip.category];
                    const pastel = PASTEL_CLIP_THEMES[clip.category];
                    const clipIsVertical = clip.aspectRatio === "9:16";
                    const isSelected = clip.id === activeProject.id;

                    return (
                      <motion.button
                        key={clip.id}
                        ref={(el) => {
                          desktopClipRefs.current[clip.id] = el;
                        }}
                        type="button"
                        data-sound="custom"
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleSelectClip(clip)}
                        onDoubleClick={() => onPreviewProject(clip)}
                        style={{
                          backgroundColor: isSelected
                            ? pastel.cardActiveBg
                            : pastel.cardBg,
                          borderColor: isSelected
                            ? pastel.dot
                            : pastel.cardBorder,
                          boxShadow: isSelected
                            ? `0 12px 24px -12px ${pastel.glow}`
                            : "none",
                        }}
                        className={`group flex h-[96px] w-[240px] shrink-0 cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border p-2 text-left transition-all ${
                          isSelected
                            ? "ring-1 ring-white/30"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <div className="relative h-full w-[72px] shrink-0 overflow-hidden rounded-xl bg-[#0B0D14]">
                          <MediaThumbnail
                            src={clip.thumbnailUrl}
                            alt={clip.title}
                            fallbackGradient={clipTrack.fallbackGradient}
                            className={`h-full w-full object-cover ${
                              clipIsVertical ? "object-top" : "object-center"
                            } transition-transform duration-300 group-hover:scale-105`}
                          />
                          <span className="absolute right-1 bottom-1 rounded-full bg-black/70 px-1.5 py-0.5 font-mono text-[9px] font-medium text-white">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5 pr-1">
                          <span className="line-clamp-2 font-display text-xs leading-snug font-semibold text-white">
                            {clip.title}
                          </span>

                          <span
                            className="mt-1.5 inline-flex w-fit max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor: pastel.badgeBg,
                              color: pastel.badgeText,
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: pastel.dot }}
                            />
                            <span className="truncate">{clip.category}</span>
                          </span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* 2. AUDIO TRACK — EQUIVALENT GENEROUS HEIGHT (h-[112px]) DIRECTLY BELOW VIDEO */}
              <div className="relative flex h-[112px] items-center overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0D1018] px-4">
                {/* Soft Gradient Progress Tint */}
                <motion.div
                  aria-hidden="true"
                  animate={{ width: `${playheadPercent}%` }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                  className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-[#93C5FD]/14 via-[#C4B5FD]/18 to-[#6EE7B7]/16"
                />

                {/* Subtle Horizontal Centerline */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-4 top-1/2 h-px bg-white/[0.06]"
                />

                {/* Discreet Corner Badge */}
                <span className="pointer-events-none absolute top-2.5 left-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-[#12151E]/90 px-2.5 py-1 text-[10px] font-medium text-[#A7F3D0] backdrop-blur-sm">
                  <Music2 className="h-3 w-3" />
                  <span>Trilha de Áudio</span>
                </span>

                <span className="pointer-events-none absolute top-2.5 right-3 z-10 rounded-full bg-[#12151E]/85 px-2.5 py-1 text-[10px] font-medium text-[#B8C0D8] backdrop-blur-sm">
                  {activeProject.title}
                </span>

                {/* Expressive Full-Height Rounded Pastel Waveform Bars */}
                <div className="relative z-10 flex h-[68px] w-full items-center gap-[5px] pt-3">
                  {AUDIO_WAVEFORM.map((height, idx) => {
                    const barPercent =
                      ((idx + 0.5) / AUDIO_WAVEFORM.length) * 100;
                    const isBeforePlayhead = barPercent <= playheadPercent;

                    return (
                      <motion.span
                        key={`d-audio-${idx}`}
                        animate={
                          isAudioSync
                            ? { scaleY: [0.28, 1.12, 0.34, 0.96, 0.28] }
                            : { scaleY: [0.72, 1, 0.78] }
                        }
                        transition={{
                          duration: isAudioSync
                            ? 0.5 + (idx % 5) * 0.06
                            : 2 + (idx % 5) * 0.25,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: idx * 0.025,
                        }}
                        className={`flex-1 rounded-full transition-opacity duration-300 ${
                          isBeforePlayhead || isAudioSync
                            ? "bg-gradient-to-t from-[#6EE7B7] via-[#93C5FD] to-[#C4B5FD] opacity-95"
                            : "bg-white/20 opacity-50"
                        }`}
                        style={{
                          height: `${Math.max(22, Math.round(height * 0.92))}%`,
                          willChange: "transform",
                        }}
                      />
                    );
                  })}
                </div>

                {/* Click/Drag Anywhere on Audio Track to Scrub */}
                <input
                  type="range"
                  aria-label="Arrastar na trilha de áudio para navegar entre vídeos"
                  min={0}
                  max={Math.max(0, projects.length - 1)}
                  step={1}
                  value={activeIndex}
                  onChange={(event) => handleScrub(Number(event.target.value))}
                  className="absolute inset-0 z-30 cursor-ew-resize opacity-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: WELL-PROPORTIONED PREVIEW CARD (lg:col-span-5 xl:col-span-4) */}
        <div className="audio-pulse-target flex min-w-0 flex-col justify-between overflow-hidden rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-soft)] lg:col-span-5 xl:col-span-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`desktop-preview-${activeProject.id}`}
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col"
            >
              <AutoplayPreviewStage
                project={activeProject}
                pastel={activePastel}
                trackFallback={activeTrack.fallbackGradient}
                shouldMountPlayer={isDesktopViewport === true}
                muted={previewMuted}
                onToggleMute={() => setPreviewMuted((prev) => !prev)}
                onExpand={() => onPreviewProject(activeProject)}
              />

              <div className="mt-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                    style={{
                      backgroundColor: activePastel.badgeBg,
                      color: activePastel.badgeText,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: activePastel.dot }}
                    />
                    <span>{activeProject.category}</span>
                  </span>

                  <Link
                    href={`/projetos/${activeProject.slug}`}
                    aria-label={`Abrir página de ${activeProject.title}`}
                    title="Abrir página do vídeo"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <h3 className="mt-2 line-clamp-1 font-display text-lg font-bold tracking-tight text-[var(--text-primary)]">
                  <Link
                    href={`/projetos/${activeProject.slug}`}
                    className="transition-colors hover:text-[var(--accent)]"
                  >
                    {activeProject.title}
                  </Link>
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {activeProject.summary}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-5 space-y-2.5 pt-1">
            <button
              type="button"
              data-primary-cta="true"
              onClick={() => onPreviewProject(activeProject)}
              className="studio-accent-bg inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-white shadow-[0_12px_26px_-6px_rgba(110,148,255,0.68)] transition-all hover:opacity-95"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Assistir vídeo</span>
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                data-sound="custom"
                onClick={() => handleStep(-1)}
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--text-primary)]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>
              <button
                type="button"
                data-sound="custom"
                onClick={() => handleStep(1)}
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)]/60 hover:text-[var(--text-primary)]"
              >
                <span>Próximo</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
