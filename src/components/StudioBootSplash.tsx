"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS } from "@/data/projects";

interface StudioBootSplashProps {
  onComplete?: () => void;
}

const BOOT_MESSAGES = [
  "Abrindo o estúdio criativo...",
  `Organizando os ${PROJECTS.length} projetos...`,
  "Preparando a timeline e o preview...",
  "Tudo pronto — Bem-vindo!",
] as const;

const MINI_CLIPS = [
  { width: "34%", bg: "#93C5FD", border: "#BFDBFE" },
  { width: "26%", bg: "#C4B5FD", border: "#DDD6FE" },
  { width: "22%", bg: "#FDBA74", border: "#FED7AA" },
  { width: "18%", bg: "#6EE7B7", border: "#A7F3D0" },
] as const;

const MINI_WAVEFORM = [
  32, 62, 46, 82, 56, 38, 88, 66, 44, 76, 58, 40, 84, 52, 64, 42, 74, 48,
];

/**
 * Abertura suave e curva com o logo GM:
 * - Visual de app criativo acolhedor (cantos bem arredondados, cores pasteis suaves)
 * - Mini timeline pastel animada + barra de progresso fluida + botão "Pular abertura" (e tecla Escape)
 */
export function StudioBootSplash({ onComplete }: StudioBootSplashProps) {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      const immediate = window.setTimeout(() => {
        setVisible(false);
        onComplete?.();
      }, 0);
      return () => window.clearTimeout(immediate);
    }

    const totalMs = 2600;
    const startTime = performance.now();

    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startTime;
      const ratio = Math.min(1, elapsed / (totalMs - 200));
      const eased = 1 - Math.pow(1 - ratio, 2.2);
      const nextProgress = Math.min(100, Math.round(eased * 100));
      setProgress(nextProgress);

      if (elapsed >= totalMs) {
        window.clearInterval(interval);
        setVisible(false);
        onComplete?.();
      }
    }, 36);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.clearInterval(interval);
        setVisible(false);
        onComplete?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setVisible(false);
    onComplete?.();
  };

  const stepIndex =
    progress < 28 ? 0 : progress < 62 ? 1 : progress < 90 ? 2 : 3;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Abrindo o portfólio de Gabriel Mochiaro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden bg-[#0D0F17] px-5 py-8 text-white"
        >
          {/* Soft Pastel Ambient Glow (Zero-cost radial gradient on mobile; animated blobs on desktop) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              background:
                "radial-gradient(circle at 20% 18%, rgba(147,197,253,0.14), transparent 46%), radial-gradient(circle at 82% 84%, rgba(196,181,253,0.14), transparent 48%)",
            }}
          >
            <motion.div
              animate={{ x: ["-6%", "8%", "-4%"], y: ["-4%", "6%", "-4%"] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-28 -left-24 hidden h-[420px] w-[420px] rounded-full bg-[#93C5FD]/18 blur-[120px] lg:block"
            />
            <motion.div
              animate={{ x: ["8%", "-6%", "6%"], y: ["6%", "-8%", "4%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-24 -bottom-28 hidden h-[440px] w-[440px] rounded-full bg-[#C4B5FD]/18 blur-[125px] lg:block"
            />
          </div>

          <div aria-hidden="true" className="h-6" />

          {/* Center Soft App Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[460px] rounded-[32px] border border-white/10 bg-[#141724]/96 p-7 text-center shadow-[0_32px_90px_rgba(7,8,18,0.7)] sm:p-9 lg:bg-[#1B1D2B]/90 lg:backdrop-blur-2xl"
          >
            {/* Soft Cute GM Squircle Logo */}
            <div className="relative mx-auto flex w-fit items-center justify-center">
              <motion.span
                aria-hidden="true"
                animate={{ scale: [1, 1.14, 1], opacity: [0.45, 0.8, 0.45] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute -inset-3 rounded-[30px] bg-gradient-to-tr from-[#93C5FD]/35 via-[#C4B5FD]/35 to-[#6EE7B7]/30 blur-xl"
              />
              <motion.div
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative flex h-20 w-20 items-center justify-center rounded-[26px] border border-white/20 bg-gradient-to-br from-[#6C8CFF] via-[#8B7BFF] to-[#65C4B6] shadow-[0_18px_38px_-10px_rgba(108,140,255,0.65)] sm:h-24 sm:w-24"
              >
                <span className="font-display text-3xl font-bold tracking-[-0.05em] text-white sm:text-4xl">
                  GM
                </span>
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-6 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              Gabriel Mochiaro
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="mt-1.5 text-xs font-medium text-[#C4B5FD] sm:text-sm"
            >
              Editor de Vídeo &amp; Publicitário
            </motion.p>

            {/* Cute Pastel Mini-Timeline Visualizer (Pure GPU transform) */}
            <div className="mt-6 rounded-2xl border border-white/[0.08] bg-[#13141E]/90 p-3.5">
              <div className="relative space-y-2 overflow-hidden">
                <motion.div
                  aria-hidden="true"
                  animate={{ x: `${Math.min(97, Math.max(4, progress))}%` }}
                  transition={{ duration: 0.16, ease: "linear" }}
                  className="pointer-events-none absolute inset-0 z-10"
                >
                  <span className="block h-full w-[2px] rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </motion.div>

                {/* Pastel Rounded Clips */}
                <div className="flex items-center gap-1.5">
                  {MINI_CLIPS.map((clip, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ scaleX: 0, opacity: 0.35 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{
                        duration: 0.42,
                        delay: 0.12 + idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        width: clip.width,
                        transformOrigin: "left center",
                        backgroundColor: `${clip.bg}40`,
                        borderColor: `${clip.border}85`,
                      }}
                      className="h-4 rounded-full border"
                    />
                  ))}
                </div>

                {/* Gentle Pastel Audio Wave */}
                <div className="flex h-6 items-center gap-[3px] rounded-full bg-white/[0.04] px-2.5">
                  {MINI_WAVEFORM.map((h, idx) => (
                    <motion.span
                      key={`wf-${idx}`}
                      animate={{ scaleY: [0.55, 1, 0.65] }}
                      transition={{
                        duration: 1.0 + (idx % 4) * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: idx * 0.04,
                      }}
                      style={{ height: `${h}%` }}
                      className="flex-1 rounded-full bg-gradient-to-t from-[#6EE7B7] to-[#93C5FD] opacity-85"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Smooth Progress Pill (Pure GPU scaleX) */}
            <div className="mt-5">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  animate={{ scaleX: Math.max(0.01, progress / 100) }}
                  transition={{ duration: 0.12, ease: "linear" }}
                  style={{ transformOrigin: "left center" }}
                  className="h-full w-full rounded-full bg-gradient-to-r from-[#93C5FD] via-[#C4B5FD] to-[#6EE7B7]"
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between gap-3 text-xs">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={BOOT_MESSAGES[stepIndex]}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="truncate text-left text-[#CBD2E6]"
                  >
                    {BOOT_MESSAGES[stepIndex]}
                  </motion.span>
                </AnimatePresence>

                <span className="shrink-0 font-mono text-[11px] font-medium text-[#C4B5FD] tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>
          </motion.div>

          {/* Discreet Bottom Skip Pill */}
          <div className="relative z-10 flex justify-center pt-4">
            <button
              type="button"
              onClick={handleSkip}
              className="min-h-[40px] cursor-pointer rounded-full border border-white/15 bg-[#141724]/92 px-5 py-2 text-xs font-medium text-[#D6DCF0] transition-colors hover:border-[#C4B5FD]/60 hover:bg-white/[0.12] hover:text-white lg:bg-white/[0.06] lg:backdrop-blur-md"
            >
              Pular abertura
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
