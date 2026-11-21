"use client";

import { motion } from "framer-motion";
import { Clapperboard, Home, MessageCircle, Play, User } from "lucide-react";
import type { WorkspaceNavTarget } from "./WorkspaceTopBar";

interface MobileBottomDockProps {
  activeSection: WorkspaceNavTarget;
  onNavigate: (target: WorkspaceNavTarget) => void;
  onPlayShowreel: () => void;
}

/**
 * Barra inferior fixa e arredondada para mobile (< 1024px) inspirada no CapCut:
 * - Acesso confortável para o polegar (Início, Projetos, botão central Play Showreel, Sobre, Contato)
 * - Estética fofa, curva e harmônica com o site, sem gerar overflow horizontal
 */
export function MobileBottomDock({
  activeSection,
  onNavigate,
  onPlayShowreel,
}: MobileBottomDockProps) {
  const leftItems: { id: WorkspaceNavTarget; label: string; icon: typeof Home }[] =
    [
      { id: "inicio", label: "Início", icon: Home },
      { id: "projetos", label: "Projetos", icon: Clapperboard },
    ];

  const rightItems: {
    id: WorkspaceNavTarget;
    label: string;
    icon: typeof Home;
  }[] = [
    { id: "sobre", label: "Sobre", icon: User },
    { id: "contato", label: "Contato", icon: MessageCircle },
  ];

  const renderNavItem = (item: {
    id: WorkspaceNavTarget;
    label: string;
    icon: typeof Home;
  }) => {
    const Icon = item.icon;
    const isActive = activeSection === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onNavigate(item.id)}
        className={`relative flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-full py-2 transition-colors ${
          isActive
            ? "text-white"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
      >
        {isActive && (
          <motion.span
            layoutId="mobile-dock-active-pill"
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            className="absolute inset-x-1 inset-y-0.5 rounded-full bg-[var(--accent)] shadow-[0_6px_16px_-4px_rgba(110,148,255,0.65)]"
          />
        )}
        <Icon className="relative z-10 h-4 w-4" />
        <span className="relative z-10 truncate text-[10px] font-semibold">
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <nav
      aria-label="Barra de navegação mobile"
      style={{
        bottom: "max(0.75rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
      className="pointer-events-none fixed inset-x-0 z-40 max-w-full lg:hidden"
    >
      <div className="pointer-events-auto mx-auto flex max-w-[430px] items-center justify-between gap-0.5 rounded-full border border-[var(--border-panel)] bg-[#0B0F19]/95 p-1.5 shadow-[0_18px_36px_-12px_rgba(3,5,14,0.85)] sm:gap-1">
        {leftItems.map(renderNavItem)}

        {/* Center CapCut-Style Showreel Action Pill */}
        <button
          type="button"
          onClick={onPlayShowreel}
          aria-label="Assistir Showreel"
          className="mx-1 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-[#6E94FF] via-[#A78BFA] to-[#6EE7B7] text-white shadow-[0_10px_24px_-6px_rgba(110,148,255,0.85)] transition-transform active:scale-95"
        >
          <Play className="ml-0.5 h-5 w-5 fill-white" />
        </button>

        {rightItems.map(renderNavItem)}
      </div>
    </nav>
  );
}
