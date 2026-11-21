"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import { HERO_PORTRAIT_PATH, SHOWREEL } from "@/data/projects";
import type { VideoModalMedia } from "./VideoModal";

interface HeroSectionProps {
  onOpenVideo: (media: VideoModalMedia) => void;
  onExploreProjects?: () => void;
}

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Hero aberto com dissolução orgânica completa (sem bordas retas no final):
 * - Máscara gradual dupla (vertical inferior + suavização lateral) via CSS mask-image
 * - Camadas de gradiente na cor do fundo (--bg-canvas) e vinheta suave
 * - Parallax delicado e dissolução fluida no scroll com useScroll + useSpring + useTransform
 */
export function HeroSection({
  onOpenVideo,
  onExploreProjects,
}: HeroSectionProps) {
  const [imageError, setImageError] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Inércia suave para um parallax orgânico sem saltos bruscos
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    mass: 0.35,
  });

  const photoOpacity = useTransform(smoothProgress, [0, 0.85], [1, 0.04]);
  const photoScale = useTransform(smoothProgress, [0, 1], [1.03, 1.1]);
  const photoY = useTransform(smoothProgress, [0, 1], [0, 56]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.72], [1, 0.12]);
  const contentY = useTransform(smoothProgress, [0, 1], [0, 32]);

  const handlePlayReel = () => {
    onOpenVideo({
      title: SHOWREEL.title,
      subtitle: SHOWREEL.subtitle,
      technicalTag: SHOWREEL.technicalTag,
      videoUrl: SHOWREEL.videoUrl,
      aspectRatio: SHOWREEL.aspectRatio,
    });
  };

  return (
    <section
      ref={heroRef}
      id="inicio"
      aria-label="Apresentação — Gabriel Mochiaro"
      className="relative -mt-[72px] -mb-8 w-full scroll-mt-0 pt-[72px] pb-10 sm:-mb-10 sm:pb-14"
    >
      {/* Full-Bleed Soft-Masked Photo Layer (Zero Straight Bottom or Side Cutoff!) */}
      <motion.div
        style={{ opacity: photoOpacity }}
        className="pointer-events-none absolute inset-x-0 top-0 -bottom-6 overflow-hidden"
      >
        {/* Outer Vertical Dissolve Mask: fades completely to 0% well before the bottom edge */}
        <div
          className="h-full w-full"
          style={{
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, #000 10%, #000 44%, rgba(0,0,0,0.74) 64%, rgba(0,0,0,0.28) 80%, rgba(0,0,0,0.06) 91%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.92) 0%, #000 10%, #000 44%, rgba(0,0,0,0.74) 64%, rgba(0,0,0,0.28) 80%, rgba(0,0,0,0.06) 91%, transparent 100%)",
          }}
        >
          {/* Inner Lateral Soft Feather Mask: organically dissolves left & right edges */}
          <motion.div
            style={{ y: photoY }}
            className="h-full w-full"
          >
            <div
              className="h-full w-full"
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.72) 10%, #000 24%, #000 82%, rgba(0,0,0,0.68) 94%, transparent 100%)",
                maskImage:
                  "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.72) 10%, #000 24%, #000 82%, rgba(0,0,0,0.68) 94%, transparent 100%)",
              }}
            >
              {!imageError ? (
                <motion.img
                  src={HERO_PORTRAIT_PATH}
                  alt="Gabriel Mochiaro segurando a câmera em produção audiovisual"
                  onError={() => setImageError(true)}
                  style={{
                    scale: photoScale,
                    filter: "brightness(1.06) contrast(1.03)",
                  }}
                  className="h-full w-full object-cover object-[60%_26%] sm:object-[58%_center]"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="h-full w-full bg-gradient-to-br from-[#20243a] via-[#151826] to-[#0d0f17]"
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* Soft Radial Vignette Framing for Cinema Depth */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 84% 76% at 62% 38%, transparent 38%, var(--bg-canvas) 100%)",
            opacity: 0.72,
          }}
        />

        {/* Localized Left Readability Scrim (keeps Gabriel & camera bright on the right) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#0D0F17]/88 via-[#0D0F17]/48 to-transparent lg:w-[64%]"
        />

        {/* Mobile Gentle Readability Blend Under Text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)] via-[#0D0F17]/42 to-transparent lg:hidden"
        />

        {/* Deep Multi-Stop Bottom Dissolve Matching Page Canvas */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-[var(--bg-canvas)] via-[var(--bg-canvas)]/72 to-transparent sm:h-60"
        />
      </motion.div>

      {/* Open Editorial Foreground Content */}
      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="safe-px relative z-10 mx-auto flex min-h-[410px] max-w-[1280px] flex-col justify-end pt-32 pb-10 sm:min-h-[460px] sm:pt-28 sm:pb-14 md:min-h-[480px] lg:min-h-[515px] lg:justify-center lg:pt-16 lg:pb-16"
      >
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: SMOOTH_EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-300/35 bg-[#0D0F17]/88 px-3.5 py-1.5 sm:px-4 lg:bg-[#0D0F17]/65 lg:backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute hidden h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 lg:inline-flex" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[11px] font-semibold text-emerald-200 sm:text-xs">
              Disponível para projetos
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.08,
              ease: SMOOTH_EASE,
            }}
            className="mt-4 font-display text-[clamp(1.95rem,8.4vw,3.75rem)] leading-[0.95] font-bold tracking-tight text-white uppercase drop-shadow-[0_6px_26px_rgba(7,9,18,0.85)]"
          >
            GABRIEL
            <span className="block">MOCHIARO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.16,
              ease: SMOOTH_EASE,
            }}
            className="mt-4 max-w-lg text-sm leading-relaxed font-medium text-[#E8ECF8] drop-shadow-[0_2px_14px_rgba(7,9,18,0.85)] sm:text-base lg:text-lg"
          >
            Editor de Vídeo &amp; Publicitário • Montagem, Captação &amp;
            Pós-Produção
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.24,
              ease: SMOOTH_EASE,
            }}
            className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button
              type="button"
              data-primary-cta="true"
              onClick={handlePlayReel}
              className="studio-accent-bg group inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2.5 rounded-full px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-6px_rgba(110,148,255,0.72)] transition-all duration-300 hover:-translate-y-0.5 hover:opacity-95 sm:w-auto"
            >
              <Play className="h-4 w-4 fill-white" />
              <span>Assistir Showreel</span>
            </button>

            <a
              href="#projetos"
              onClick={(event) => {
                if (onExploreProjects) {
                  event.preventDefault();
                  onExploreProjects();
                }
              }}
              className="group inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border border-white/28 bg-[#0D0F17]/85 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0D0F17]/95 sm:w-auto lg:bg-[#0D0F17]/55 lg:backdrop-blur-md"
            >
              <span>Ver Projetos</span>
              <ArrowDown className="h-4 w-4 text-[#BFDBFE] transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
