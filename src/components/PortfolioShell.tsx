"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  matchesCategory,
  PROJECTS,
  SHOWREEL,
  type Project,
  type ProjectFilter,
} from "@/data/projects";
import { AboutSection } from "./AboutSection";
import { ContactFooter } from "./ContactFooter";
import {
  EditingToolbar,
  EditingToolOverlays,
  type ColorGradeState,
  type CutPhase,
} from "./EditingToolbar";
import { EditingToolsSection } from "./EditingToolsSection";
import { HeroSection } from "./HeroSection";
import { InteractiveTimeline } from "./InteractiveTimeline";
import { MobileBottomDock } from "./MobileBottomDock";
import { ProjectsSection } from "./ProjectsSection";
import { StudioBootSplash } from "./StudioBootSplash";
import { VideoModal, type VideoModalMedia } from "./VideoModal";
import {
  WorkspaceTopBar,
  type WorkspaceNavTarget,
} from "./WorkspaceTopBar";
import {
  bindStudioAudioUnlock,
  playAudioNormalizedChime,
  playAudioSweep,
  playClick,
  playColorPulse,
  playCutSnap,
  playCutSnip,
  playHoverTick,
  playScaleSnap,
  playScaleTick,
} from "@/lib/studioSound";

const SMOOTH_EASE = [0.22, 1, 0.36, 1] as const;
const SCALE_SPRING = {
  type: "spring" as const,
  stiffness: 260,
  damping: 28,
};

/**
 * Transform Box azul-cobalto (#3B82F6) com 8 quadradinhos brancos + ponto âncora central
 */
function StageTransformBox({
  visible,
  anchorTopPx,
}: {
  visible: boolean;
  anchorTopPx: number;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="stage-transform-box"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: SMOOTH_EASE }}
          style={{ willChange: "opacity" }}
          className="pointer-events-none absolute inset-0 z-40 border-2 border-[#3B82F6] shadow-[0_0_0_1px_rgba(255,255,255,0.12)]"
        >
          {/* 8 White Resize Handles (4 Corners + 4 Edges) */}
          <span className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-[2px] border-[1.5px] border-[#3B82F6] bg-white shadow-sm" />
          <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-[2px] border-[1.5px] border-[#3B82F6] bg-white shadow-sm" />
          <span className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-[2px] border-[1.5px] border-[#3B82F6] bg-white shadow-sm" />

          <span
            className="absolute -left-1.5 h-3 w-3 -translate-y-1/2 rounded-[2px] border-[1.5px] border-[#3B82F6] bg-white shadow-sm"
            style={{ top: `${anchorTopPx}px` }}
          />
          <span
            className="absolute -right-1.5 h-3 w-3 -translate-y-1/2 rounded-[2px] border-[1.5px] border-[#3B82F6] bg-white shadow-sm"
            style={{ top: `${anchorTopPx}px` }}
          />

          <span className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-[2px] border-[1.5px] border-[#3B82F6] bg-white shadow-sm" />
          <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-[2px] border-[1.5px] border-[#3B82F6] bg-white shadow-sm" />
          <span className="absolute -right-1.5 -bottom-1.5 h-3 w-3 rounded-[2px] border-[1.5px] border-[#3B82F6] bg-white shadow-sm" />

          {/* Subtle Center Anchor Point Icon (Premiere / After Effects Style) */}
          <div
            className="absolute left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
            style={{ top: `${anchorTopPx}px` }}
          >
            <span className="absolute h-6 w-6 rounded-full border-[1.5px] border-[#3B82F6] bg-[#0D0F17]/55 shadow-[0_0_16px_rgba(59,130,246,0.65)]" />
            <span className="absolute h-10 w-[1.5px] bg-[#3B82F6]/85" />
            <span className="absolute h-[1.5px] w-10 bg-[#3B82F6]/85" />
            <span className="relative h-2 w-2 rounded-full bg-white ring-1 ring-[#3B82F6]" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PortfolioShell() {
  const [bootDone, setBootDone] = useState(false);
  const [activeMedia, setActiveMedia] = useState<VideoModalMedia | null>(null);
  const [activeSection, setActiveSection] =
    useState<WorkspaceNavTarget>("inicio");
  const [activeFilter, setActiveFilter] = useState<ProjectFilter>("Todos");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    PROJECTS[0]?.id ?? ""
  );

  // Interactive Editing Toolbar states (strictly mutually exclusive)
  const [cutPhase, setCutPhase] = useState<CutPhase>("idle");
  const [isAudioSync, setIsAudioSync] = useState(false);
  const [audioNormalized, setAudioNormalized] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [colorGrade, setColorGrade] = useState<ColorGradeState | null>(null);
  const [isScaleOpen, setIsScaleOpen] = useState(false);
  const [scaleValue, setScaleValue] = useState<number>(100);
  const [scaleAnchorTopPx, setScaleAnchorTopPx] = useState<number>(380);

  const timersRef = useRef<number[]>([]);

  // Global Web Audio API unlock + subtle UI hover/click micro-sounds
  useEffect(() => {
    const unbindUnlock = bindStudioAudioUnlock();
    let lastHoveredEl: Element | null = null;

    const handlePointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = (event.target as Element | null)?.closest(
        "button, a[href], [role='tab']"
      );
      if (!target) {
        lastHoveredEl = null;
        return;
      }
      if (target !== lastHoveredEl) {
        lastHoveredEl = target;
        playHoverTick();
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest(
        "button, a[href], [role='tab']"
      );
      if (!target) return;
      if (target.getAttribute("data-sound") === "custom") return;
      playClick();
    };

    document.addEventListener("pointerover", handlePointerOver, {
      passive: true,
    });
    document.addEventListener("click", handleClick, { passive: true });

    return () => {
      unbindUnlock();
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const clearScheduledTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearScheduledTimers();
  }, [clearScheduledTimers]);

  const scheduleTimeout = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timersRef.current.push(id);
    return id;
  }, []);

  // Cleanly terminates any active animation before starting another
  const resetAllTools = useCallback(() => {
    clearScheduledTimers();
    setCutPhase("idle");
    setIsAudioSync(false);
    setAudioNormalized(false);
    setIsScaleOpen(false);
    setScaleValue(100);
    setIsColorOpen(false);
    setColorGrade(null);
  }, [clearScheduledTimers]);

  const handleBootComplete = useCallback(() => {
    setBootDone(true);
  }, []);

  // 1. CUT: Dedicated 60fps 4-Stage Timeline Split Overlay (~3.5s, Zero DOM Stage Repaint!)
  //    0.0s–0.8s: enter (master clip lands in V1)
  //    0.8s–1.7s: click (giant razor cursor glides & clicks center + snip sound at 1.25s)
  //    1.7s–2.7s: split (CLIP 01 & CLIP 02 + A1 break apart left/right)
  //    2.7s–3.5s: snap + exit (magnetic snap sound -> expand & reveal site)
  const handleTriggerCut = useCallback(() => {
    resetAllTools();
    setCutPhase("enter");
    scheduleTimeout(() => {
      setCutPhase("click");
    }, 800);
    scheduleTimeout(() => {
      playCutSnip();
    }, 1250);
    scheduleTimeout(() => {
      setCutPhase("split");
    }, 1700);
    scheduleTimeout(() => {
      playCutSnap();
      setCutPhase("snap");
    }, 2700);
    scheduleTimeout(() => {
      setCutPhase("exit");
    }, 3050);
    scheduleTimeout(() => {
      setCutPhase("idle");
    }, 3500);
  }, [resetAllTools, scheduleTimeout]);

  // 2. AUDIO: Full-Screen Blurred Mixing Console + Big Centered "SOM NORMALIZADO" (~3.0s)
  const handleTriggerAudio = useCallback(() => {
    resetAllTools();
    playAudioSweep();
    setIsAudioSync(true);
    setAudioNormalized(false);
    scheduleTimeout(() => {
      setAudioNormalized(true);
      playAudioNormalizedChime();
    }, 1100);
    scheduleTimeout(() => {
      setIsAudioSync(false);
      setAudioNormalized(false);
    }, 3000);
  }, [resetAllTools, scheduleTimeout]);

  // 3. COLOR: Real-Time Color Grading Wheel (400ms smooth return on close/restore)
  const handleToggleColor = useCallback(() => {
    if (isColorOpen) {
      setIsColorOpen(false);
      setColorGrade(null);
      return;
    }
    resetAllTools();
    setIsColorOpen(true);
  }, [isColorOpen, resetAllTools]);

  const handleCloseColor = useCallback(() => {
    setIsColorOpen(false);
    setColorGrade(null);
  }, []);

  const handleChangeColorGrade = useCallback(
    (grade: ColorGradeState | null) => {
      setColorGrade(grade);
      if (grade) {
        playColorPulse(grade.hue);
      }
    },
    []
  );

  // 4. SCALE: Interactive Slider (60%–115%) + Transform Box + Transparency Checkerboard
  const handleToggleScale = useCallback(() => {
    if (isScaleOpen) {
      setIsScaleOpen(false);
      setScaleValue(100);
      playScaleSnap();
      return;
    }
    resetAllTools();
    setScaleAnchorTopPx(
      Math.round(window.scrollY + Math.min(window.innerHeight * 0.48, 440))
    );
    setIsScaleOpen(true);
    setScaleValue(80);
    playScaleTick(80);
  }, [isScaleOpen, resetAllTools]);

  const handleChangeScale = useCallback((nextScale: number) => {
    const clamped = Math.max(60, Math.min(115, Math.round(nextScale)));
    setScaleValue(clamped);
    playScaleTick(clamped);
  }, []);

  const handleCloseScale = useCallback(() => {
    setIsScaleOpen(false);
    setScaleValue(100);
    playScaleSnap();
  }, []);

  const filteredProjects = PROJECTS.filter((project) =>
    matchesCategory(project, activeFilter)
  );

  const timelineProjects =
    filteredProjects.length > 0 ? filteredProjects : PROJECTS;

  const selectedProject =
    timelineProjects.find((p) => p.id === selectedProjectId) ??
    timelineProjects[0] ??
    PROJECTS[0];

  const handleChangeFilter = (filter: ProjectFilter) => {
    setActiveFilter(filter);
    const nextList = PROJECTS.filter((p) => matchesCategory(p, filter));
    if (
      nextList.length > 0 &&
      !nextList.some((p) => p.id === selectedProjectId)
    ) {
      setSelectedProjectId(nextList[0].id);
    }
  };

  const handleNavigate = (target: WorkspaceNavTarget) => {
    setActiveSection(target);
    const element = document.getElementById(target);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenProjectPreview = (project: Project) => {
    setSelectedProjectId(project.id);
    setActiveMedia({
      title: project.title,
      subtitle: project.clientOrContext
        ? `${project.clientOrContext} • ${project.role}`
        : `${project.category} • ${project.role}`,
      technicalTag: `${project.aspectRatio} • ${project.category}`,
      videoUrl: project.videoUrl,
      aspectRatio: project.aspectRatio,
      projectSlug: project.slug,
      category: project.category,
    });
  };

  const handlePlayShowreel = () => {
    setActiveMedia({
      title: SHOWREEL.title,
      subtitle: SHOWREEL.subtitle,
      technicalTag: SHOWREEL.technicalTag,
      videoUrl: SHOWREEL.videoUrl,
      aspectRatio: SHOWREEL.aspectRatio,
    });
  };

  const stageScale = scaleValue / 100;
  const showTransformVisuals = isScaleOpen && scaleValue !== 100;

  // Dynamic CSS custom properties for Color Grading (400ms smooth restore)
  const dynamicColorVars = (
    colorGrade
      ? {
          "--studio-tint": colorGrade.color,
          "--studio-accent": colorGrade.color,
          "--accent": colorGrade.color,
          "--tab-active-bg": colorGrade.color,
        }
      : {}
  ) as CSSProperties;

  return (
    <div
      style={dynamicColorVars}
      className="relative min-h-screen max-w-full overflow-x-clip bg-[var(--bg-canvas)] text-[var(--text-primary)]"
    >
      {/* Subtle Peripheral Vignette For Scale (Keeps Transform Box, Checkerboard & z-50 Popover Razor-Sharp) */}
      <AnimatePresence>
        {isScaleOpen && (
          <motion.div
            key="scale-focus-vignette"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: SMOOTH_EASE }}
            style={{
              willChange: "opacity",
              background:
                "radial-gradient(ellipse 76% 72% at 50% 45%, transparent 48%, rgba(5, 7, 12, 0.48) 100%)",
            }}
            className="pointer-events-none fixed inset-0 z-30"
          />
        )}
      </AnimatePresence>

      {/* Real-Time Cinematic Color Grading Soft-Light Layer (Smooth 400ms Restore) */}
      <AnimatePresence>
        {colorGrade && (
          <motion.div
            key="color-grade-softlight"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: SMOOTH_EASE }}
            style={{ willChange: "opacity" }}
            className="pointer-events-none fixed inset-0 z-40"
          >
            {/* Controlled Soft-Light Atmospheric Wash (~0.28 max) */}
            <div
              className="absolute inset-0 transition-colors duration-200"
              style={{
                backgroundColor: colorGrade.color,
                opacity: 0.14 + colorGrade.intensity * 0.16,
                mixBlendMode: "soft-light",
              }}
            />
            {/* Delicate Edge Color Glow */}
            <div
              className="absolute inset-0 transition-colors duration-200"
              style={{
                background: `radial-gradient(circle at 50% 22%, ${colorGrade.color}, transparent 72%)`,
                opacity: 0.08 + colorGrade.intensity * 0.12,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtle Ambient Background Glows (Zero-cost static gradient on mobile; dynamic blur blobs on desktop lg+) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 25% 8%, rgba(147,197,253,0.08), transparent 45%), radial-gradient(circle at 82% 38%, rgba(196,181,253,0.07), transparent 46%)",
        }}
      >
        <div
          className="absolute -top-40 left-1/4 hidden h-[420px] w-[420px] rounded-full blur-[130px] transition-colors duration-400 lg:block"
          style={{
            backgroundColor: colorGrade ? colorGrade.color : "#93C5FD",
            opacity: colorGrade ? 0.18 : 0.1,
          }}
        />
        <div
          className="absolute top-1/3 -right-32 hidden h-[380px] w-[380px] rounded-full blur-[130px] transition-colors duration-400 lg:block"
          style={{
            backgroundColor: colorGrade ? colorGrade.color : "#C4B5FD",
            opacity: colorGrade ? 0.15 : 0.1,
          }}
        />
        <div
          className="absolute bottom-1/4 -left-32 hidden h-[360px] w-[360px] rounded-full blur-[130px] transition-colors duration-400 lg:block"
          style={{
            backgroundColor: colorGrade ? colorGrade.color : "#6EE7B7",
            opacity: colorGrade ? 0.12 : 0.08,
          }}
        />
      </div>

      {/* Premiere/Photoshop Dark Transparency Checkerboard Revealed Behind #studio-stage */}
      <AnimatePresence>
        {showTransformVisuals && (
          <motion.div
            key="transparency-checkerboard"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: SMOOTH_EASE }}
            style={{
              willChange: "opacity",
              backgroundColor: "#0A0C12",
              backgroundImage:
                "linear-gradient(45deg, #161A26 25%, transparent 25%), linear-gradient(-45deg, #161A26 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #161A26 75%), linear-gradient(-45deg, transparent 75%, #161A26 75%)",
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0",
            }}
            className="pointer-events-none fixed inset-0 z-0"
          />
        )}
      </AnimatePresence>

      {/* 1. Soft Curvy Boot Splash with GM Logo */}
      <StudioBootSplash onComplete={handleBootComplete} />

      {/* =================================================================
          DEDICATED GPU STAGE CONTAINER (#studio-stage)
          Only animates transform + opacity with will-change: transform, opacity
         ================================================================= */}
      <motion.div
        id="studio-stage"
        animate={{ scale: stageScale }}
        transition={SCALE_SPRING}
        style={{
          transformOrigin: "center top",
          willChange:
            isScaleOpen || scaleValue !== 100 ? "transform" : undefined,
        }}
        className={`relative z-10 ${
          showTransformVisuals ? "bg-[var(--bg-canvas)] shadow-[0_36px_90px_rgba(0,0,0,0.75)]" : ""
        }`}
      >
        <StageTransformBox
          visible={showTransformVisuals}
          anchorTopPx={scaleAnchorTopPx}
        />
        {/* 2. Floating Pill Top Bar */}
        <WorkspaceTopBar
          activeSection={activeSection}
          activeFilter={activeFilter}
          onNavigate={handleNavigate}
          onSelectFilter={handleChangeFilter}
          onSelectProject={(project) => setSelectedProjectId(project.id)}
          onPreviewProject={handleOpenProjectPreview}
          onPlayShowreel={handlePlayShowreel}
        />

        {/* 3. Open Full-Bleed Hero */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={bootDone ? { opacity: 1 } : { opacity: 0.65 }}
          transition={{ duration: 0.6, ease: SMOOTH_EASE }}
        >
          <HeroSection
            onOpenVideo={setActiveMedia}
            onExploreProjects={() => handleNavigate("projetos")}
          />
        </motion.div>

        {/* 4. Interactive Editing Toolbar + Main Sections */}
        <main className="safe-px relative z-10 mx-auto max-w-[1280px] space-y-6 pt-2 pb-10 sm:space-y-8 lg:space-y-9">
          {/* Interactive Editing Toolbar (Cut, Audio, Color, Scale) */}
          <EditingToolbar
            cutPhase={cutPhase}
            isAudioSync={isAudioSync}
            isColorOpen={isColorOpen}
            colorGrade={colorGrade}
            isScaleOpen={isScaleOpen}
            onTriggerCut={handleTriggerCut}
            onTriggerAudio={handleTriggerAudio}
            onToggleColor={handleToggleColor}
            onCloseColor={handleCloseColor}
            onChangeColorGrade={handleChangeColorGrade}
            onToggleScale={handleToggleScale}
          />

          {/* Interactive Timeline + Preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={bootDone ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 12 }}
            transition={{
              duration: 0.6,
              delay: 0.08,
              ease: SMOOTH_EASE,
            }}
          >
            <InteractiveTimeline
              projects={timelineProjects}
              activeProjectId={selectedProject.id}
              onSelectProject={(project) => setSelectedProjectId(project.id)}
              onPreviewProject={handleOpenProjectPreview}
            />
          </motion.div>

          {/* Projects Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={bootDone ? { opacity: 1, y: 0 } : { opacity: 0.55, y: 14 }}
            transition={{
              duration: 0.6,
              delay: 0.14,
              ease: SMOOTH_EASE,
            }}
          >
            <ProjectsSection
              activeFilter={activeFilter}
              selectedProjectId={selectedProject.id}
              onChangeFilter={handleChangeFilter}
              onSelectProject={(project) => setSelectedProjectId(project.id)}
              onPreviewProject={handleOpenProjectPreview}
            />
          </motion.div>

          {/* Sobre Mim */}
          <AboutSection />

          {/* Editing & Post-Production Softwares */}
          <EditingToolsSection />
        </main>

        {/* Contact & Official-Color Social Icons */}
        <ContactFooter />
      </motion.div>

      {/* Viewport-Pinned 60fps Tool Overlays (Outside #studio-stage) */}
      <EditingToolOverlays
        cutPhase={cutPhase}
        isAudioSync={isAudioSync}
        audioNormalized={audioNormalized}
        isScaleOpen={isScaleOpen}
        scaleValue={scaleValue}
        onChangeScale={handleChangeScale}
        onCloseScale={handleCloseScale}
      />

      {/* Mobile (< 1024px) CapCut-Inspired Floating Rounded Thumb Dock */}
      <MobileBottomDock
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onPlayShowreel={handlePlayShowreel}
      />

      <VideoModal media={activeMedia} onClose={() => setActiveMedia(null)} />
    </div>
  );
}
