"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const INTRO_STORAGE_KEY = "gm-portfolio-intro-seen-v3";

const INTRO_TRACKS = [
  { code: "V1", label: "MONTAGEM & PÓS", color: "#3B82F6", width: "78%", offset: "0%" },
  { code: "V2", label: "REELS", color: "#8B5CF6", width: "64%", offset: "16%" },
  { code: "V3", label: "EVENTOS", color: "#F59E0B", width: "52%", offset: "8%" },
  { code: "V4", label: "UVA BARRA MATERIAIS", color: "#10B981", width: "70%", offset: "22%" },
] as const;

export function TimelineIntro() {
  const [visible, setVisible] = useState(false);
  const [frameCount, setFrameCount] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const alreadySeen = window.sessionStorage.getItem(INTRO_STORAGE_KEY) === "1";

    if (prefersReducedMotion || alreadySeen) {
      return;
    }

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 0);

    const frameInterval = window.setInterval(() => {
      setFrameCount((prev) => (prev < 24 ? prev + 1 : 24));
    }, 42);

    const autoDismiss = window.setTimeout(() => {
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      setVisible(false);
    }, 1300);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
        setVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(showTimer);
      window.clearInterval(frameInterval);
      window.clearTimeout(autoDismiss);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSkip = () => {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    setVisible(false);
  };

  const formattedFrames = String(frameCount).padStart(2, "0");

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Carregando portfólio de Gabriel Mochiaro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-canvas)]/95 px-6 backdrop-blur-xl"
        >
          <div className="w-full max-w-lg rounded-2xl border border-white/12 bg-[#181A1F] p-5 shadow-[0_28px_80px_-20px_rgba(15,23,42,0.52)] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]" />
                <span className="font-mono text-[11px] tracking-[0.18em] text-white uppercase">
                  GABRIEL_MOCHIARO.SEQ
                </span>
              </div>
              <span className="font-mono text-xs text-[#60A5FA] tabular-nums">
                00:00:01:{formattedFrames}
              </span>
            </div>

            <div className="relative mt-4 space-y-2.5 overflow-hidden py-1">
              <motion.div
                aria-hidden="true"
                initial={{ left: "0%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[#3B82F6] shadow-[0_0_10px_#3B82F6]"
              >
                <span className="absolute -top-1 -left-1 h-2 w-2 rotate-45 bg-[#3B82F6]" />
              </motion.div>

              {INTRO_TRACKS.map((track, idx) => (
                <div key={track.code} className="flex items-center gap-3">
                  <span className="w-6 font-mono text-[10px] font-medium text-[#9CA3AF]">
                    {track.code}
                  </span>
                  <div className="relative h-6 flex-1 overflow-hidden rounded-md border border-white/[0.08] bg-[#12141A]">
                    <motion.div
                      initial={{ scaleX: 0, opacity: 0.45 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{
                        duration: 0.48,
                        delay: idx * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        width: track.width,
                        marginLeft: track.offset,
                        transformOrigin: "left center",
                        backgroundColor: `${track.color}28`,
                        borderColor: `${track.color}75`,
                      }}
                      className="flex h-full items-center rounded-[5px] border px-2"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: track.color }}
                      />
                      <span className="ml-2 truncate font-mono text-[9px] tracking-[0.14em] text-white/90">
                        {track.label}
                      </span>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="font-mono text-[10px] tracking-[0.14em] text-[#9CA3AF] uppercase">
                PREPARANDO PORTFÓLIO • 24FPS
              </span>
              <button
                type="button"
                onClick={handleSkip}
                className="cursor-pointer rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 font-mono text-[10px] tracking-[0.14em] text-white uppercase transition-colors hover:border-[#3B82F6] hover:bg-[#3B82F6]"
              >
                Pular intro →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
