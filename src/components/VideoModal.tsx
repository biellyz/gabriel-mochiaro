"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Film, X } from "lucide-react";
import {
  getEmbedVideoUrl,
  isEmbedUrl,
  type ProjectAspectRatio,
  type ProjectCategory,
} from "@/data/projects";

export interface VideoModalMedia {
  title: string;
  subtitle?: string;
  technicalTag?: string;
  videoUrl: string;
  aspectRatio?: ProjectAspectRatio;
  projectSlug?: string;
  category?: ProjectCategory;
}

interface VideoModalProps {
  media: VideoModalMedia | null;
  onClose: () => void;
}

const PASTEL_DOTS: Record<ProjectCategory, string> = {
  Audiovisual: "#93C5FD",
  Reels: "#C4B5FD",
  Eventos: "#FDBA74",
  Agência: "#6EE7B7",
};

export function VideoModal({ media, onClose }: VideoModalProps) {
  useEffect(() => {
    if (!media) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [media, onClose]);

  const isVertical = media?.aspectRatio === "9:16";
  const dotColor = media?.category ? PASTEL_DOTS[media.category] : "#93C5FD";

  return (
    <AnimatePresence>
      {media && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={media.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F101A]/80 p-3 backdrop-blur-xl sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            className={`relative w-full overflow-hidden rounded-[28px] border border-white/12 bg-[#1B1D2B] shadow-[0_32px_90px_rgba(5,6,18,0.75)] ${
              isVertical ? "max-w-[400px]" : "max-w-5xl"
            }`}
          >
            {/* Clean Soft Modal Header */}
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-[#161824] px-5 py-3.5 sm:px-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: dotColor }}
                  />
                  <h3 className="truncate font-display text-sm font-bold tracking-tight text-white sm:text-base">
                    {media.title}
                  </h3>
                </div>
                {media.subtitle && (
                  <p className="mt-0.5 truncate text-xs text-[#B7BED0]">
                    {media.subtitle}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar player de vídeo"
                className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/12 bg-white/[0.06] text-[#CBD2E6] transition-colors hover:bg-white/[0.15] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Video Player */}
            <div
              className={`relative w-full overflow-hidden bg-[#11121B] ${
                isVertical
                  ? "aspect-[9/16] max-h-[64dvh] sm:max-h-[70vh]"
                  : "aspect-video"
              }`}
            >
              {media.videoUrl ? (
                isEmbedUrl(media.videoUrl) ? (
                  <iframe
                    src={getEmbedVideoUrl(media.videoUrl, { autoplay: true })}
                    title={media.title}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={media.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  />
                )
              ) : (
                <div className="relative flex h-full w-full flex-col items-center justify-center p-8 text-center">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(147,197,253,0.18),transparent_60%)]"
                  />

                  <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-3xl border border-[#93C5FD]/35 bg-[#93C5FD]/15 text-[#93C5FD]">
                    <Film className="h-7 w-7" />
                  </div>

                  <p className="relative z-10 mt-4 font-display text-lg font-bold text-white sm:text-xl">
                    Showreel em preparação
                  </p>
                  <p className="relative z-10 mt-2 max-w-md text-xs leading-relaxed text-[#B7BED0] sm:text-sm">
                    Enquanto o showreel completo é finalizado, você pode
                    assistir a todos os vídeos diretamente na timeline e na
                    galeria abaixo.
                  </p>
                </div>
              )}
            </div>

            {/* Discreet Footer Bar (Video-First, Light Route Link) */}
            {media.projectSlug && (
              <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#141724] px-5 py-3 sm:px-6">
                <span className="text-xs text-[#9DA7C4]">
                  {media.category ?? "Vídeo"}
                  {media.aspectRatio ? ` • ${media.aspectRatio}` : ""}
                </span>

                <Link
                  href={`/projetos/${media.projectSlug}`}
                  onClick={onClose}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-[#CBD3E8] transition-colors hover:border-[#C4B5FD]/60 hover:text-white"
                >
                  <span>Abrir página do vídeo</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#C4B5FD] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
