"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AudioLines,
  CheckCircle2,
  Maximize2,
  Palette,
  Scissors,
  X,
} from "lucide-react";
import { HERO_PORTRAIT_PATH } from "@/data/projects";

export interface ColorGradeState {
  hue: number;
  intensity: number;
  color: string;
  label: string;
  /** Offset in px relative to wheel center (for pure GPU translate3d reticle) */
  offsetX: number;
  offsetY: number;
}

export type CutPhase = "idle" | "enter" | "click" | "split" | "snap" | "exit";

interface EditingToolbarProps {
  cutPhase: CutPhase;
  isAudioSync: boolean;
  isColorOpen: boolean;
  colorGrade: ColorGradeState | null;
  isScaleOpen: boolean;
  onTriggerCut: () => void;
  onTriggerAudio: () => void;
  onToggleColor: () => void;
  onCloseColor: () => void;
  onChangeColorGrade: (grade: ColorGradeState | null) => void;
  onToggleScale: () => void;
}

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;

// Irregular initial heights -> smooth normalized heights for the Mixing Console waveform
const MIXER_WAVE_RAW = [
  0.25, 0.95, 0.3, 1.0, 0.22, 0.88, 0.4, 0.18, 0.96, 0.32, 0.84, 0.24, 0.98,
  0.35, 0.2, 0.92, 0.42, 0.18, 0.96, 0.28, 0.9, 0.34, 0.22, 0.94, 0.38, 0.2,
  0.88, 0.3, 0.95, 0.26, 0.84, 0.32,
];

const MIXER_WAVE_NORMALIZED = [
  0.48, 0.56, 0.62, 0.58, 0.64, 0.54, 0.6, 0.66, 0.58, 0.62, 0.55, 0.64, 0.68,
  0.6, 0.56, 0.65, 0.62, 0.58, 0.66, 0.6, 0.54, 0.62, 0.64, 0.58, 0.6, 0.65,
  0.56, 0.62, 0.58, 0.6, 0.52, 0.48,
];

const MIXER_LEFT_CHANNELS = [
  { name: "VOZ", startY: 30, knobStart: -55, knobTarget: 14, vuLevel: 0.78 },
  { name: "TRILHA", startY: -24, knobStart: 48, knobTarget: -10, vuLevel: 0.68 },
] as const;

const MIXER_RIGHT_CHANNELS = [
  { name: "SFX", startY: 34, knobStart: -42, knobTarget: 22, vuLevel: 0.72 },
  { name: "MASTER", startY: -18, knobStart: 35, knobTarget: 0, vuLevel: 0.84 },
] as const;

type MixerChannel = {
  readonly name: string;
  readonly startY: number;
  readonly knobStart: number;
  readonly knobTarget: number;
  readonly vuLevel: number;
};

function VerticalMixerStrip({
  channel,
  index,
  audioNormalized,
}: {
  channel: MixerChannel;
  index: number;
  audioNormalized: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center rounded-2xl border border-white/10 bg-[#121726]/85 px-2.5 py-3.5 shadow-lg">
      {/* Rotary EQ Knob */}
      <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#090C14]">
        <motion.div
          initial={{ rotate: channel.knobStart }}
          animate={{ rotate: channel.knobTarget }}
          transition={{
            duration: 0.95,
            delay: index * 0.06,
            ease: SMOOTH_EASE,
          }}
          style={{ willChange: "transform" }}
          className="flex h-full w-full items-start justify-center pt-1.5"
        >
          <span className="h-2 w-0.5 rounded-full bg-[#6EE7B7]" />
        </motion.div>
      </div>
      <span className="mt-1 font-mono text-[8px] text-[#8E98B5] uppercase">
        EQ
      </span>

      {/* Vertical VU Meter + Motorized Fader */}
      <div className="mt-3 flex h-36 items-center justify-center gap-3">
        <div className="relative flex h-full w-2.5 items-end overflow-hidden rounded-full bg-[#070A12] p-0.5">
          <motion.span
            initial={{ scaleY: 0.24 }}
            animate={{
              scaleY: audioNormalized
                ? [channel.vuLevel, channel.vuLevel - 0.07, channel.vuLevel]
                : [0.32, 0.92, channel.vuLevel],
            }}
            transition={{
              duration: audioNormalized ? 0.95 : 1.0,
              repeat: audioNormalized ? Infinity : 0,
              ease: SMOOTH_EASE,
              delay: index * 0.05,
            }}
            style={{
              height: "100%",
              transformOrigin: "bottom center",
              willChange: "transform",
            }}
            className="w-full rounded-full bg-gradient-to-t from-[#3B82F6] via-[#60A5FA] to-[#6EE7B7]"
          />
        </div>

        <div className="relative flex h-full w-7 items-center justify-center">
          <span className="h-full w-1 rounded-full bg-white/15" />
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[#6EE7B7]/50" />
          <motion.div
            initial={{ y: channel.startY }}
            animate={{ y: 0 }}
            transition={{
              duration: 1.0,
              delay: index * 0.06,
              ease: SMOOTH_EASE,
            }}
            style={{ willChange: "transform" }}
            className="absolute flex h-7 w-6 items-center justify-center rounded-md border border-white/40 bg-gradient-to-b from-[#F1F5F9] to-[#94A3B8] shadow-[0_6px_14px_rgba(0,0,0,0.65)]"
          >
            <span className="h-0.5 w-3 rounded-full bg-[#0F172A]" />
          </motion.div>
        </div>
      </div>

      <span className="mt-3 font-mono text-[10px] font-semibold tracking-[0.08em] text-white">
        {channel.name}
      </span>
      <span className="font-mono text-[9px] text-[#6EE7B7]">0 dB</span>
    </div>
  );
}

function CompactMobileMixerRow({
  channels,
  audioNormalized,
  offsetIndex = 0,
}: {
  channels: readonly MixerChannel[];
  audioNormalized: boolean;
  offsetIndex?: number;
}) {
  return (
    <div className="grid w-full grid-cols-2 gap-2.5 md:hidden">
      {channels.map((ch, idx) => (
        <div
          key={ch.name}
          className="flex items-center justify-between gap-2.5 rounded-2xl border border-white/12 bg-[#0B0F19]/88 px-3 py-2.5 shadow-lg"
        >
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold tracking-[0.08em] text-white">
              {ch.name}
            </p>
            <p className="font-mono text-[9px] text-[#6EE7B7]">0 dB</p>
          </div>

          <div className="flex flex-1 items-center gap-2">
            {/* Horizontal Mini Motorized Fader */}
            <div className="relative flex h-5 flex-1 items-center">
              <span className="h-1 w-full rounded-full bg-white/15" />
              <span className="absolute top-1 bottom-1 left-1/2 w-px -translate-x-1/2 bg-[#6EE7B7]/50" />
              <motion.span
                initial={{ x: ch.startY > 0 ? -16 : 16 }}
                animate={{ x: 0 }}
                transition={{
                  duration: 0.95,
                  delay: (offsetIndex + idx) * 0.06,
                  ease: SMOOTH_EASE,
                }}
                style={{ willChange: "transform" }}
                className="absolute left-1/2 h-4 w-3 -translate-x-1/2 rounded bg-gradient-to-b from-[#F1F5F9] to-[#94A3B8] shadow"
              />
            </div>

            {/* Mini Vertical VU */}
            <div className="flex h-6 w-2 items-end overflow-hidden rounded-full bg-[#070A12] p-0.5">
              <motion.span
                initial={{ scaleY: 0.25 }}
                animate={{ scaleY: audioNormalized ? ch.vuLevel : [0.3, 0.9, ch.vuLevel] }}
                transition={{ duration: 0.9, ease: SMOOTH_EASE }}
                style={{
                  height: "100%",
                  transformOrigin: "bottom center",
                  willChange: "transform",
                }}
                className="w-full rounded-full bg-gradient-to-t from-[#3B82F6] to-[#6EE7B7]"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const CUT_TIMECODES = [
  "00:00:00",
  "00:00:05",
  "00:00:10",
  "00:00:15",
  "00:00:20",
] as const;

const CUT_AUDIO_LEFT = [
  36, 62, 48, 82, 58, 42, 76, 64, 52, 86, 60, 44, 72, 56, 68, 50,
];

const CUT_AUDIO_RIGHT = [
  54, 74, 46, 84, 62, 40, 78, 66, 48, 80, 58, 44, 70, 52, 64, 38,
];

function getGradeLabel(hue: number): string {
  if (hue < 25 || hue >= 335) return "Warm Crimson";
  if (hue < 65) return "Golden Amber";
  if (hue < 140) return "Emerald Cine";
  if (hue < 205) return "Teal & Cyan";
  if (hue < 260) return "Cobalt Night";
  return "Lavender Haze";
}

function hslToCss(hue: number, saturation: number, lightness: number): string {
  return `hsl(${Math.round(hue)}, ${Math.round(saturation)}%, ${Math.round(
    lightness
  )}%)`;
}

/**
 * Barra compacta de Ferramentas de Edição (`Cut`, `Audio`, `Color`, `Scale`):
 * - Apenas propriedades aceleradas por GPU (transform, opacity)
 * - Popover de Color Wheel estilo DaVinci Resolve com transição suave de 400ms ao restaurar
 */
export function EditingToolbar({
  cutPhase,
  isAudioSync,
  isColorOpen,
  colorGrade,
  isScaleOpen,
  onTriggerCut,
  onTriggerAudio,
  onToggleColor,
  onCloseColor,
  onChangeColorGrade,
  onToggleScale,
}: EditingToolbarProps) {
  const colorContainerRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isColorOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        colorContainerRef.current &&
        !colorContainerRef.current.contains(event.target as Node)
      ) {
        onCloseColor();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseColor();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isColorOpen, onCloseColor]);

  const updateColorFromPoint = (clientX: number, clientY: number) => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    const rect = wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const radius = rect.width / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, radius - 6);
    const intensity = Math.min(1, clampedDist / (radius - 6));

    const angleRad = Math.atan2(dy, dx);
    const angleDeg = ((angleRad * 180) / Math.PI + 90 + 360) % 360;

    const offsetX = dist > 0 ? (dx / dist) * clampedDist : 0;
    const offsetY = dist > 0 ? (dy / dist) * clampedDist : 0;

    if (intensity < 0.08) {
      onChangeColorGrade(null);
      return;
    }

    onChangeColorGrade({
      hue: angleDeg,
      intensity,
      color: hslToCss(angleDeg, 82, 62),
      label: getGradeLabel(angleDeg),
      offsetX,
      offsetY,
    });
  };

  const isCutting = cutPhase !== "idle";

  return (
    <div className="relative z-40 flex justify-center">
      {/* Subtle Ambient Dimmer Behind Color Wheel (Preserves Live Color Grading Visibility & Sharpness) */}
      <AnimatePresence>
        {isColorOpen && (
          <motion.div
            key="color-focus-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: SMOOTH_EASE }}
            style={{
              willChange: "opacity",
              background:
                "radial-gradient(ellipse 75% 65% at 50% 35%, rgba(5, 7, 12, 0.12) 0%, rgba(5, 7, 12, 0.45) 100%)",
            }}
            className="pointer-events-none fixed inset-0 z-30 backdrop-blur-[1.5px]"
          />
        )}
      </AnimatePresence>

      <div
        ref={colorContainerRef}
        className="relative z-40 inline-flex max-w-full items-center gap-0.5 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel)]/90 p-1 shadow-[0_18px_40px_-18px_rgba(4,6,18,0.85)] backdrop-blur-xl sm:gap-1.5 sm:p-1.5"
      >
        {/* 1. CUT */}
        <button
          type="button"
          data-sound="custom"
          onClick={onTriggerCut}
          className={`inline-flex h-9 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition-colors duration-300 sm:h-10 sm:gap-2 sm:px-4 sm:text-xs ${
            isCutting
              ? "bg-[#3B82F6] text-white"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel-alt)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Scissors className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span>Cut</span>
        </button>

        {/* 2. AUDIO */}
        <button
          type="button"
          data-sound="custom"
          onClick={onTriggerAudio}
          className={`inline-flex h-9 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition-colors duration-300 sm:h-10 sm:gap-2 sm:px-4 sm:text-xs ${
            isAudioSync
              ? "bg-[#34D399] text-[#0D1018]"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel-alt)] hover:text-[var(--text-primary)]"
          }`}
        >
          <AudioLines className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span>Audio</span>
        </button>

        {/* 3. COLOR */}
        <button
          type="button"
          onClick={onToggleColor}
          aria-expanded={isColorOpen}
          style={
            isColorOpen && colorGrade
              ? { backgroundColor: colorGrade.color, color: "#0D0F17" }
              : undefined
          }
          className={`inline-flex h-9 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition-colors duration-300 sm:h-10 sm:gap-2 sm:px-4 sm:text-xs ${
            isColorOpen
              ? "bg-[#A78BFA] text-white"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel-alt)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Palette className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span>Color</span>
        </button>

        {/* 4. SCALE */}
        <button
          type="button"
          data-sound="custom"
          data-scale-trigger="true"
          onClick={onToggleScale}
          aria-expanded={isScaleOpen}
          className={`inline-flex h-9 cursor-pointer items-center gap-1 rounded-full px-2.5 text-[11px] font-semibold transition-colors duration-300 sm:h-10 sm:gap-2 sm:px-4 sm:text-xs ${
            isScaleOpen
              ? "bg-[#3B82F6] text-white"
              : "text-[var(--text-secondary)] hover:bg-[var(--bg-panel-alt)] hover:text-[var(--text-primary)]"
          }`}
        >
          <Maximize2 className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span>Scale</span>
        </button>

        {/* COLOR GRADING WHEEL POPOVER (DaVinci Resolve Style) */}
        <AnimatePresence>
          {isColorOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.28, ease: SMOOTH_EASE }}
              style={{ willChange: "transform, opacity" }}
              className="absolute top-full left-1/2 z-50 w-[min(calc(100vw-2rem),268px)] -translate-x-1/2 pt-3"
            >
              <div className="overflow-hidden rounded-3xl border border-white/14 bg-[#141724]/95 p-4 text-white shadow-[0_26px_64px_-16px_rgba(3,5,14,0.9)] backdrop-blur-2xl">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-display text-xs font-bold tracking-tight text-white">
                      Color Wheel
                    </p>
                    <p className="font-mono text-[10px] text-[#9DA7C4]">
                      {colorGrade ? colorGrade.label : "Passe o mouse ou arraste"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={onCloseColor}
                    aria-label="Fechar roda de cores e restaurar cores originais"
                    className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/10 text-[#CBD3E8] transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Circular Color Wheel */}
                <div className="mt-4 flex justify-center">
                  <div
                    ref={wheelRef}
                    onPointerMove={(event) => {
                      updateColorFromPoint(event.clientX, event.clientY);
                    }}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      updateColorFromPoint(event.clientX, event.clientY);
                    }}
                    className="relative flex h-44 w-44 cursor-crosshair touch-none items-center justify-center rounded-full border-2 border-white/18 shadow-[inset_0_0_24px_rgba(0,0,0,0.42)]"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.18) 38%, transparent 66%), conic-gradient(from 0deg, #ff5f6d, #ff9966, #ffe066, #6ee7b7, #38bdf8, #3b82f6, #a78bfa, #f472b6, #ff5f6d)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-3 top-1/2 h-px -translate-y-1/2 bg-black/18"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-black/18"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute h-14 w-14 rounded-full border border-black/12"
                    />

                    {/* Pure GPU Transform Reticle Dot */}
                    <motion.span
                      aria-hidden="true"
                      animate={{
                        x: colorGrade?.offsetX ?? 0,
                        y: colorGrade?.offsetY ?? 0,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 340,
                        damping: 28,
                      }}
                      style={{
                        willChange: "transform",
                        backgroundColor: colorGrade?.color ?? "#FFFFFF",
                      }}
                      className="pointer-events-none h-5 w-5 rounded-full border-2 border-white shadow-[0_2px_10px_rgba(0,0,0,0.75)]"
                    />
                  </div>
                </div>

                <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-white/10 pt-3 font-mono text-[10px] text-[#9DA7C4]">
                  <span>
                    {colorGrade
                      ? `HUE ${Math.round(colorGrade.hue)}° • ${Math.round(
                          colorGrade.intensity * 100
                        )}%`
                      : "ORIGINAL • 0%"}
                  </span>
                  <button
                    type="button"
                    onClick={onCloseColor}
                    className="cursor-pointer rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white transition-colors hover:bg-white/20"
                  >
                    Restaurar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Overlays 60fps acelerados por GPU (renderizados fora de #studio-stage):
 * 1. Cut: Razor Slash (2px branco + #3B82F6 + tesoura + micro-flash 120ms) + Magnetic Snap sheen
 * 2. Audio: Badge topo "AUDIO CHECK • -3 dB" / "SOM NORMALIZADO" + espectro inferior amplo de 36 barras (scaleY GPU)
 * 3. Scale: Popover flutuante interativo (slider 60%–115%, indicador SCALE: XX%, atalhos 70% / 100% / Restaurar)
 */
export function EditingToolOverlays({
  cutPhase,
  isAudioSync,
  audioNormalized,
  isScaleOpen,
  scaleValue,
  onChangeScale,
  onCloseScale,
}: {
  cutPhase: CutPhase;
  isAudioSync: boolean;
  audioNormalized: boolean;
  isScaleOpen: boolean;
  scaleValue: number;
  onChangeScale: (nextScale: number) => void;
  onCloseScale: () => void;
}) {
  const scalePopoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScaleOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (target?.closest("[data-scale-trigger='true']")) {
        return;
      }
      if (
        scalePopoverRef.current &&
        !scalePopoverRef.current.contains(event.target as Node)
      ) {
        onCloseScale();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseScale();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isScaleOpen, onCloseScale]);

  const sliderPercent = ((scaleValue - 60) / (115 - 60)) * 100;

  return (
    <>
      {/* ================================================================
          1. CUT OVERLAY (60FPS GPU — REAL SPLIT IMAGE + ALIGNED A1 AUDIO)
         ================================================================ */}
      <AnimatePresence>
        {cutPhase !== "idle" && (
          <motion.div
            key="cut-timeline-overlay"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: cutPhase === "exit" ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: SMOOTH_EASE }}
            style={{
              willChange: "opacity",
              paddingLeft: "max(0.875rem, env(safe-area-inset-left))",
              paddingRight: "max(0.875rem, env(safe-area-inset-right))",
            }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#05070C]/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 1.3, opacity: 0.25 }}
              animate={
                cutPhase === "exit"
                  ? { scale: 1.22, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{
                duration: cutPhase === "exit" ? 0.42 : 0.68,
                ease: SMOOTH_EASE,
              }}
              style={{ willChange: "transform, opacity" }}
              className="w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#0B0F19]/94 p-3.5 text-white shadow-[0_32px_90px_rgba(0,0,0,0.85)] sm:p-6"
            >
              {/* Top Timeline Header */}
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#3B82F6] font-display text-[10px] font-bold text-white">
                    GM
                  </span>
                  <span className="truncate font-mono text-[11px] font-semibold tracking-[0.08em] text-white sm:text-xs">
                    PORTFOLIO_MASTER.MP4
                  </span>
                </div>

                <span className="shrink-0 rounded-full border border-[#3B82F6]/45 bg-[#3B82F6]/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#93C5FD]">
                  {cutPhase === "split"
                    ? "CLIP 01 + CLIP 02"
                    : cutPhase === "click"
                      ? "RAZOR TOOL"
                      : "TIMELINE • V1 / A1"}
                </span>
              </div>

              {/* Timecode Ruler Aligned With Track Bed */}
              <div className="mt-2.5 flex items-center gap-2 sm:gap-3">
                <div className="w-8 shrink-0 sm:w-10" />
                <div className="flex flex-1 items-center justify-between px-1 font-mono text-[9px] text-[#8E98B5] sm:text-[10px]">
                  {CUT_TIMECODES.map((tc) => (
                    <span key={tc} className="tabular-nums">
                      {tc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tracks Grid: Left Labels Column + Right Mathematically Centered Clips Area */}
              <div className="mt-2 flex items-stretch gap-2 sm:gap-3">
                {/* Left Track Labels (V1 + A1) */}
                <div className="flex w-8 shrink-0 flex-col gap-2.5 sm:w-10">
                  <div className="flex h-40 items-center justify-center rounded-xl border border-white/10 bg-[#151A2B] font-mono text-[10px] font-bold text-[#93C5FD] sm:h-56 sm:text-xs">
                    V1
                  </div>
                  <div className="flex h-16 items-center justify-center rounded-xl border border-white/10 bg-[#151A2B] font-mono text-[10px] font-bold text-[#6EE7B7] sm:h-20 sm:text-xs">
                    A1
                  </div>
                </div>

                {/* Right Clips Container — left-1/2 Is Mathematically Exact Center Seam! */}
                <div className="relative flex min-w-0 flex-1 flex-col gap-2.5">
                  {/* Center Vertical Razor Cut Guide Line */}
                  <motion.div
                    aria-hidden="true"
                    animate={{
                      opacity:
                        cutPhase === "click" || cutPhase === "split" ? 1 : 0,
                    }}
                    transition={{ duration: 0.22, ease: SMOOTH_EASE }}
                    style={{ willChange: "opacity" }}
                    className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-[2px] -translate-x-1/2 bg-gradient-to-b from-[#60A5FA] via-white to-[#60A5FA] shadow-[0_0_16px_rgba(96,165,250,0.95)]"
                  />

                  {/* TRACK V1 — True Single Continuous Image Split Down The Center */}
                  <div className="relative flex h-40 w-full items-stretch overflow-hidden rounded-2xl bg-[#070A12] p-1 sm:h-56">
                    {/* LEFT HALF — CLIP 01 (Shows Pixels 0% -> 50% via left-0 w-[200%] max-w-none) */}
                    <motion.div
                      animate={{
                        x: cutPhase === "split" ? "-7%" : "0%",
                      }}
                      transition={
                        cutPhase === "split"
                          ? { duration: 0.48, ease: SMOOTH_EASE }
                          : { type: "spring", stiffness: 260, damping: 24 }
                      }
                      style={{ willChange: "transform" }}
                      className={`relative h-full w-1/2 overflow-hidden border-y border-l bg-[#111420] transition-colors duration-200 ${
                        cutPhase === "split"
                          ? "rounded-xl border-r border-[#60A5FA]/85"
                          : "rounded-l-xl border-white/15"
                      }`}
                    >
                      <img
                        src={HERO_PORTRAIT_PATH}
                        alt=""
                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-[200%] max-w-none object-cover object-[58%_center]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080B14]/88 via-[#080B14]/45 to-transparent" />

                      {/* Safely Padded Text (Never Clipped At Edges) */}
                      <div className="relative z-10 flex h-full flex-col justify-between p-2.5 sm:p-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#0B0F19]/80 px-2 py-0.5 backdrop-blur-md">
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6E94FF]" />
                            <span className="truncate font-display text-[9px] font-bold text-white uppercase sm:text-[10px]">
                              GM
                            </span>
                          </span>

                          <motion.span
                            animate={{ opacity: cutPhase === "split" ? 1 : 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ willChange: "opacity" }}
                            className="shrink-0 rounded-full border border-[#60A5FA]/65 bg-[#0B0F19]/92 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#BFDBFE]"
                          >
                            CLIP 01
                          </motion.span>
                        </div>

                        <div className="min-w-0 pr-2">
                          <p className="truncate font-display text-xs font-bold tracking-tight text-white uppercase sm:text-base">
                            GABRIEL MOCHIARO
                          </p>
                          <p className="truncate font-mono text-[8px] text-[#BFDBFE] sm:text-[10px]">
                            PORTFOLIO_MASTER.MP4
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    {/* RIGHT HALF — CLIP 02 (Shows Pixels 50% -> 100% via right-0 w-[200%] max-w-none) */}
                    <motion.div
                      animate={{
                        x: cutPhase === "split" ? "7%" : "0%",
                      }}
                      transition={
                        cutPhase === "split"
                          ? { duration: 0.48, ease: SMOOTH_EASE }
                          : { type: "spring", stiffness: 260, damping: 24 }
                      }
                      style={{ willChange: "transform" }}
                      className={`relative h-full w-1/2 overflow-hidden border-y border-r bg-[#111420] transition-colors duration-200 ${
                        cutPhase === "split"
                          ? "rounded-xl border-l border-[#C4B5FD]/85"
                          : "rounded-r-xl border-white/15"
                      }`}
                    >
                      <img
                        src={HERO_PORTRAIT_PATH}
                        alt=""
                        className="pointer-events-none absolute inset-y-0 right-0 h-full w-[200%] max-w-none object-cover object-[58%_center]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[#080B14]/35 via-transparent to-transparent" />

                      <div className="relative z-10 flex items-start justify-start p-2.5 sm:p-4">
                        <motion.span
                          animate={{ opacity: cutPhase === "split" ? 1 : 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ willChange: "opacity" }}
                          className="rounded-full border border-[#C4B5FD]/65 bg-[#0B0F19]/92 px-2 py-0.5 font-mono text-[9px] font-semibold text-[#DDD6FE]"
                        >
                          CLIP 02
                        </motion.span>
                      </div>
                    </motion.div>
                  </div>

                  {/* TRACK A1 — Full 100% Proportional Width Matching CLIP 01 & CLIP 02 */}
                  <div className="relative flex h-16 w-full items-stretch overflow-hidden rounded-2xl bg-[#070A12] p-1 sm:h-20">
                    {/* LEFT AUDIO HALF (100% Aligned With CLIP 01) */}
                    <motion.div
                      animate={{
                        x: cutPhase === "split" ? "-7%" : "0%",
                      }}
                      transition={
                        cutPhase === "split"
                          ? { duration: 0.48, ease: SMOOTH_EASE }
                          : { type: "spring", stiffness: 260, damping: 24 }
                      }
                      style={{ willChange: "transform" }}
                      className={`flex h-full w-1/2 items-center gap-[3px] border-y border-l bg-[#6EE7B7]/[0.12] px-2.5 py-2 sm:gap-[4px] sm:px-3.5 ${
                        cutPhase === "split"
                          ? "rounded-xl border-r border-[#6EE7B7]/75"
                          : "rounded-l-xl border-[#6EE7B7]/35"
                      }`}
                    >
                      {CUT_AUDIO_LEFT.map((h, i) => (
                        <span
                          key={`cal-${i}`}
                          style={{ height: `${h}%` }}
                          className="flex-1 rounded-full bg-gradient-to-t from-[#3B82F6] via-[#60A5FA] to-[#6EE7B7]"
                        />
                      ))}
                    </motion.div>

                    {/* RIGHT AUDIO HALF (100% Aligned With CLIP 02) */}
                    <motion.div
                      animate={{
                        x: cutPhase === "split" ? "7%" : "0%",
                      }}
                      transition={
                        cutPhase === "split"
                          ? { duration: 0.48, ease: SMOOTH_EASE }
                          : { type: "spring", stiffness: 260, damping: 24 }
                      }
                      style={{ willChange: "transform" }}
                      className={`flex h-full w-1/2 items-center gap-[3px] border-y border-r bg-[#6EE7B7]/[0.12] px-2.5 py-2 sm:gap-[4px] sm:px-3.5 ${
                        cutPhase === "split"
                          ? "rounded-xl border-l border-[#6EE7B7]/75"
                          : "rounded-r-xl border-[#6EE7B7]/35"
                      }`}
                    >
                      {CUT_AUDIO_RIGHT.map((h, i) => (
                        <span
                          key={`car-${i}`}
                          style={{ height: `${h}%` }}
                          className="flex-1 rounded-full bg-gradient-to-t from-[#3B82F6] via-[#60A5FA] to-[#6EE7B7]"
                        />
                      ))}
                    </motion.div>
                  </div>

                  {/* GIANT RAZOR CURSOR + IMPACT RING (Exact Center Seam left-1/2) */}
                  <AnimatePresence>
                    {cutPhase === "click" && (
                      <motion.div
                        key="giant-cut-cursor"
                        initial={{ opacity: 0, x: 100, y: 60, scale: 1.05 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          y: 0,
                          scale: [1, 1, 0.82, 1],
                        }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                          x: { duration: 0.42, ease: SMOOTH_EASE },
                          y: { duration: 0.42, ease: SMOOTH_EASE },
                          opacity: { duration: 0.22 },
                          scale: {
                            duration: 0.82,
                            times: [0, 0.52, 0.68, 0.86],
                            ease: SMOOTH_EASE,
                          },
                        }}
                        style={{ willChange: "transform, opacity" }}
                        className="pointer-events-none absolute top-[40%] left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
                      >
                        {/* Luminous Impact Ring On Click */}
                        <motion.span
                          initial={{ scale: 0.3, opacity: 0 }}
                          animate={{
                            scale: [0.3, 0.3, 2.2],
                            opacity: [0, 0.95, 0],
                          }}
                          transition={{
                            duration: 0.85,
                            times: [0, 0.54, 1],
                            ease: "easeOut",
                          }}
                          style={{ willChange: "transform, opacity" }}
                          className="absolute -inset-4 rounded-full border-2 border-[#60A5FA] shadow-[0_0_24px_rgba(96,165,250,0.95)]"
                        />

                        {/* Giant Cursor + Scissors Tool Emblem */}
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-[#3B82F6] text-white shadow-[0_14px_34px_rgba(59,130,246,0.9)] sm:h-16 sm:w-16">
                          <Scissors className="h-7 w-7 sm:h-8 sm:w-8" />
                          <svg
                            viewBox="0 0 24 24"
                            fill="white"
                            className="absolute -top-3 -left-2.5 h-6 w-6 drop-shadow-[0_3px_8px_rgba(0,0,0,0.75)]"
                          >
                            <path d="M4 2l14 10-6.2 1.2L8.5 19 4 2z" />
                          </svg>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================
          2. AUDIO OVERLAY (SIDE MIXER CHANNELS + 100% CLEAN CENTER CARD)
             Desktop (md+): Left [VOZ, TRILHA] | Center [SOM NORMALIZADO + Wave] | Right [SFX, MASTER]
             Mobile (< md): Top [VOZ, TRILHA] -> Center Card -> Bottom [SFX, MASTER]
         ================================================================ */}
      <AnimatePresence>
        {isAudioSync && (
          <motion.div
            key="audio-mixing-overlay"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.34, ease: SMOOTH_EASE }}
            style={{
              willChange: "opacity",
              paddingLeft: "max(1rem, env(safe-area-inset-left))",
              paddingRight: "max(1rem, env(safe-area-inset-right))",
            }}
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#05070C]/75 py-6 backdrop-blur-md"
          >
            <div className="flex w-full max-w-5xl flex-col items-center gap-3.5 md:grid md:grid-cols-[174px_minmax(0,1fr)_174px] md:items-center md:gap-4 lg:grid-cols-[224px_minmax(0,1fr)_224px] lg:gap-6">
              {/* MOBILE TOP COMPACT ROW (VOZ & TRILHA) */}
              <CompactMobileMixerRow
                channels={MIXER_LEFT_CHANNELS}
                audioNormalized={audioNormalized}
                offsetIndex={0}
              />

              {/* DESKTOP LEFT SIDE MIXER CONSOLE (VOZ & TRILHA) */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.42, ease: SMOOTH_EASE }}
                style={{ willChange: "transform, opacity" }}
                className="hidden gap-2.5 rounded-3xl border border-white/12 bg-[#0B0F19]/85 p-3 shadow-2xl md:flex"
              >
                {MIXER_LEFT_CHANNELS.map((ch, idx) => (
                  <VerticalMixerStrip
                    key={ch.name}
                    channel={ch}
                    index={idx}
                    audioNormalized={audioNormalized}
                  />
                ))}
              </motion.div>

              {/* 100% CLEAN CENTER CARD ("SOM NORMALIZADO" + CLEAN WAVEFORM) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.38, ease: SMOOTH_EASE }}
                style={{ willChange: "transform, opacity" }}
                className="flex w-full flex-col items-center rounded-3xl border border-white/15 bg-[#0B0F19]/92 px-6 py-7 text-center text-white shadow-2xl sm:px-9 sm:py-9"
              >
                {/* Glowing Audio / Normalized Check Icon */}
                <motion.div
                  animate={
                    audioNormalized
                      ? { scale: [0.88, 1.06, 1] }
                      : { scale: [1, 1.05, 1] }
                  }
                  transition={{
                    duration: audioNormalized ? 0.42 : 1.1,
                    repeat: audioNormalized ? 0 : Infinity,
                    ease: SMOOTH_EASE,
                  }}
                  style={{ willChange: "transform" }}
                  className={`flex h-16 w-16 items-center justify-center rounded-full shadow-[0_0_36px_rgba(110,231,183,0.55)] transition-colors duration-300 sm:h-18 sm:w-18 ${
                    audioNormalized
                      ? "bg-gradient-to-br from-[#6EE7B7] via-[#60A5FA] to-[#3B82F6] text-[#07090F]"
                      : "border border-[#6EE7B7]/40 bg-[#6EE7B7]/15 text-[#6EE7B7]"
                  }`}
                >
                  {audioNormalized ? (
                    <CheckCircle2 className="h-9 w-9 stroke-[2.4]" />
                  ) : (
                    <AudioLines className="h-8 w-8" />
                  )}
                </motion.div>

                {/* Main Title & Subtitle */}
                <AnimatePresence mode="wait">
                  {audioNormalized ? (
                    <motion.div
                      key="audio-done-copy"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3, ease: SMOOTH_EASE }}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-white uppercase sm:text-4xl">
                        SOM NORMALIZADO
                      </h3>
                      <p className="mt-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-[#A7F3D0] uppercase sm:text-xs">
                        MIXAGEM PRONTA • -14 LUFS
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="audio-leveling-copy"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.24, ease: SMOOTH_EASE }}
                      style={{ willChange: "transform, opacity" }}
                    >
                      <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-white uppercase sm:text-3xl">
                        NIVELANDO ÁUDIO...
                      </h3>
                      <p className="mt-1.5 font-mono text-[11px] font-medium tracking-[0.16em] text-[#93C5FD] uppercase sm:text-xs">
                        CALIBRANDO GANHO • 48KHZ
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Clean Waveform Inside Center Card (Zero Overlap!) */}
                <div className="mt-6 w-full rounded-2xl border border-white/10 bg-[#070A12]/90 px-3.5 py-3.5 sm:px-5">
                  <div className="flex h-12 items-center gap-[3px] sm:h-14 sm:gap-[4px]">
                    {MIXER_WAVE_RAW.map((rawScale, idx) => (
                      <motion.span
                        key={`center-wave-${idx}`}
                        initial={{ scaleY: rawScale }}
                        animate={{
                          scaleY: audioNormalized
                            ? MIXER_WAVE_NORMALIZED[idx]
                            : [rawScale, MIXER_WAVE_NORMALIZED[idx]],
                        }}
                        transition={{
                          duration: 0.95,
                          ease: SMOOTH_EASE,
                          delay: idx * 0.012,
                        }}
                        style={{
                          height: "100%",
                          willChange: "transform",
                        }}
                        className="flex-1 rounded-full bg-gradient-to-t from-[#3B82F6] via-[#60A5FA] to-[#6EE7B7]"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* DESKTOP RIGHT SIDE MIXER CONSOLE (SFX & MASTER) */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.42, ease: SMOOTH_EASE }}
                style={{ willChange: "transform, opacity" }}
                className="hidden gap-2.5 rounded-3xl border border-white/12 bg-[#0B0F19]/85 p-3 shadow-2xl md:flex"
              >
                {MIXER_RIGHT_CHANNELS.map((ch, idx) => (
                  <VerticalMixerStrip
                    key={ch.name}
                    channel={ch}
                    index={idx + 2}
                    audioNormalized={audioNormalized}
                  />
                ))}
              </motion.div>

              {/* MOBILE BOTTOM COMPACT ROW (SFX & MASTER) */}
              <CompactMobileMixerRow
                channels={MIXER_RIGHT_CHANNELS}
                audioNormalized={audioNormalized}
                offsetIndex={2}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================
          3. SCALE FLOATING INTERACTIVE CONTROL (60%–115% Slider + Presets)
         ================================================================ */}
      <AnimatePresence>
        {isScaleOpen && (
          <motion.div
            key="scale-floating-control"
            ref={scalePopoverRef}
            role="dialog"
            aria-label="Controle de escala da tela"
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.26, ease: SMOOTH_EASE }}
            style={{
              willChange: "transform, opacity",
              maxWidth:
                "calc(100vw - 2rem - env(safe-area-inset-left) - env(safe-area-inset-right))",
            }}
            className="fixed top-20 left-1/2 z-50 w-[360px] -translate-x-1/2 overflow-hidden rounded-3xl border border-[#3B82F6]/45 bg-[#12151E]/95 p-4 text-white shadow-[0_28px_70px_-14px_rgba(3,5,14,0.92)] backdrop-blur-2xl"
          >
            {/* Header Row */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#60A5FA]">
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
                <span className="font-mono text-xs font-semibold tracking-[0.08em] text-white tabular-nums">
                  SCALE: {scaleValue}%
                </span>
              </div>

              <button
                type="button"
                data-sound="custom"
                onClick={onCloseScale}
                aria-label="Fechar e restaurar escala para 100%"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white/10 text-[#CBD3E8] transition-colors hover:bg-white/20 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Interactive Slider (60% -> 115%, Touch & Mouse Friendly) */}
            <div className="mt-4">
              <div className="relative flex h-9 items-center">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/12">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#60A5FA] to-[#3B82F6]"
                    style={{ width: `${sliderPercent}%` }}
                  />
                </div>

                {/* 100% Subtle Tick Reference Mark */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute h-3.5 w-[2px] rounded-full bg-white/45"
                  style={{ left: `${((100 - 60) / (115 - 60)) * 100}%` }}
                />

                {/* Visual Thumb */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 rounded-full border-2 border-white bg-[#3B82F6] shadow-[0_0_14px_rgba(59,130,246,0.9)]"
                  style={{ left: `${sliderPercent}%` }}
                />

                <input
                  type="range"
                  aria-label="Ajustar escala da página entre 60% e 115%"
                  min={60}
                  max={115}
                  step={1}
                  value={scaleValue}
                  onChange={(event) => onChangeScale(Number(event.target.value))}
                  className="absolute inset-0 z-20 h-full w-full cursor-ew-resize touch-none opacity-0"
                />
              </div>

              <div className="mt-0.5 flex items-center justify-between font-mono text-[10px] text-[#8E98B5]">
                <span>60%</span>
                <span>100%</span>
                <span>115%</span>
              </div>
            </div>

            {/* 3 Quick Shortcuts: 70%, 100%, Restaurar / Fechar */}
            <div className="mt-3.5 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                data-sound="custom"
                onClick={() => onChangeScale(70)}
                className={`h-9 cursor-pointer rounded-full font-mono text-xs font-semibold transition-colors ${
                  scaleValue === 70
                    ? "bg-[#3B82F6] text-white"
                    : "bg-white/[0.08] text-[#D4DCF0] hover:bg-white/[0.15] hover:text-white"
                }`}
              >
                70%
              </button>

              <button
                type="button"
                data-sound="custom"
                onClick={() => onChangeScale(100)}
                className={`h-9 cursor-pointer rounded-full font-mono text-xs font-semibold transition-colors ${
                  scaleValue === 100
                    ? "bg-[#3B82F6] text-white"
                    : "bg-white/[0.08] text-[#D4DCF0] hover:bg-white/[0.15] hover:text-white"
                }`}
              >
                100%
              </button>

              <button
                type="button"
                data-sound="custom"
                onClick={onCloseScale}
                className="h-9 cursor-pointer rounded-full border border-[#3B82F6]/45 bg-[#3B82F6]/15 text-xs font-semibold text-[#BFDBFE] transition-colors hover:bg-[#3B82F6] hover:text-white"
              >
                Restaurar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
