"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Sliders } from "lucide-react";

type ToolId = "premiere" | "davinci" | "capcut";

interface EditingTool {
  id: ToolId;
  name: string;
  tag: string;
  accentHex: string;
  story: string;
  relatedSlug?: string;
  relatedLabel?: string;
}

const EDITING_TOOLS: readonly EditingTool[] = [
  {
    id: "premiere",
    name: "Adobe Premiere Pro",
    tag: "Início • 2024",
    accentHex: "#A5A6FF",
    story:
      "Meu primeiro contato oficial com edição de vídeo lá em 2024. Usei no meu primeiro projeto audiovisual do primeiro período da faculdade — e esse projeto também está aqui no portfólio.",
    relatedSlug: "a-prisao-eterna-de-nossas-memorias",
    relatedLabel: "Ver projeto da faculdade",
  },
  {
    id: "davinci",
    name: "DaVinci Resolve",
    tag: "Principal • Cinema & Séries",
    accentHex: "#6C8CFF",
    story:
      "Meu queridinho para projetos maiores, como curtas-metragens, documentários, novelas e filmes. Um programa completo com tudo em um lugar só.",
  },
  {
    id: "capcut",
    name: "CapCut",
    tag: "Agilidade • Social & Ao Vivo",
    accentHex: "#6EE7B7",
    story:
      "Vídeos para Instagram, projetos mais rápidos e eventos com cobertura ao vivo.",
  },
] as const;

function PremiereIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="prBgSoft" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#1B1A7A" />
          <stop offset="100%" stopColor="#090846" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="3"
        width="74"
        height="74"
        rx="22"
        fill="url(#prBgSoft)"
        stroke="#B2B2FF"
        strokeWidth="2.8"
      />
      <text
        x="40"
        y="52"
        textAnchor="middle"
        fill="#BEBFFF"
        fontSize="33"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="-1"
      >
        Pr
      </text>
    </svg>
  );
}

function DaVinciIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="drBgSoft" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#242B42" />
          <stop offset="100%" stopColor="#141826" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="3"
        width="74"
        height="74"
        rx="22"
        fill="url(#drBgSoft)"
        stroke="#93C5FD"
        strokeOpacity="0.65"
        strokeWidth="2.8"
      />
      <circle cx="40" cy="27" r="12.2" fill="#F87171" fillOpacity="0.95" />
      <circle cx="29" cy="48" r="12.2" fill="#34D399" fillOpacity="0.95" />
      <circle cx="51" cy="48" r="12.2" fill="#60A5FA" fillOpacity="0.98" />
      <circle cx="40" cy="41" r="5.6" fill="#181D2E" />
    </svg>
  );
}

function CapCutIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient id="ccBgSoft" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#262A3A" />
          <stop offset="100%" stopColor="#141622" />
        </linearGradient>
      </defs>
      <rect
        x="3"
        y="3"
        width="74"
        height="74"
        rx="22"
        fill="url(#ccBgSoft)"
        stroke="#E5E7EB"
        strokeOpacity="0.45"
        strokeWidth="2.8"
      />
      <path
        d="M21 28C21 25.239 23.239 23 26 23H42.5L59 32.8V38.2L42.5 28.5H27V51.5H42.5L59 41.8V47.2L42.5 57H26C23.239 57 21 54.761 21 52V28Z"
        fill="#FFFFFF"
      />
      <path
        d="M35.5 35.5L59 49.2V54.6L32.5 39L35.5 35.5Z"
        fill="#FFFFFF"
        fillOpacity="0.92"
      />
      <path
        d="M35.5 44.5L59 30.8V25.4L32.5 41L35.5 44.5Z"
        fill="#FFFFFF"
        fillOpacity="0.92"
      />
    </svg>
  );
}

function ToolBrandIcon({
  id,
  className,
}: {
  id: ToolId;
  className?: string;
}) {
  if (id === "premiere") return <PremiereIcon className={className} />;
  if (id === "davinci") return <DaVinciIcon className={className} />;
  return <CapCutIcon className={className} />;
}

/**
 * Programas de Edição com visual curvo, macio e fofo:
 * - Ícones grandes em formato arredondado (squircle) com zoom suave e sombra marcante
 * - Desktop (lg+): cards alinhados de mesma altura sem deslocamento nos vizinhos
 * - Mobile (< 1024px): toque suave em acordeão
 */
export function EditingToolsSection() {
  const [activeToolId, setActiveToolId] = useState<ToolId>("davinci");

  return (
    <section
      aria-label="Programas utilizados na edição e pós-produção"
      className="overflow-hidden rounded-[32px] border border-[var(--border-panel)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-soft)] sm:p-7"
    >
      {/* Clean Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
            <Sliders className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)]">
              Softwares que eu uso
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Passe o mouse ou toque para destacar cada programa
            </p>
          </div>
        </div>
      </div>

      {/* Equal-Height Soft Curved Cards Grid (Balanced on 5.36" Cover, 7.6" Unfolded sm:/md:, & Desktop lg+) */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch lg:gap-5">
        {EDITING_TOOLS.map((tool) => {
          const isActive = tool.id === activeToolId;

          return (
            <motion.article
              key={tool.id}
              onMouseEnter={() => setActiveToolId(tool.id)}
              animate={{ y: isActive ? -4 : 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className={`group relative flex flex-col overflow-hidden rounded-[28px] border bg-[var(--bg-panel-alt)] transition-all duration-300 sm:last:col-span-2 lg:last:col-span-1 ${
                isActive
                  ? "border-[#C4B5FD]/65 shadow-[0_24px_52px_-18px_rgba(4,6,18,0.75),0_0_0_1px_rgba(196,181,253,0.28)]"
                  : "border-[var(--border-panel)] hover:border-[#6E94FF]/45"
              }`}
            >
              {/* Soft Pastel Glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-12 right-0 h-44 w-44 rounded-full blur-3xl transition-opacity duration-500"
                style={{
                  backgroundColor: tool.accentHex,
                  opacity: isActive ? 0.2 : 0.05,
                }}
              />

              {/* Top Interactive Header */}
              <button
                type="button"
                onClick={() => setActiveToolId(tool.id)}
                aria-expanded={isActive}
                className="relative z-10 flex w-full cursor-pointer flex-col items-start p-5 text-left sm:p-6"
              >
                <div className="flex w-full items-center justify-between gap-4">
                  {/* Large Soft Rounded Icon with Fluid Scale & Deep Soft Shadow */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 22,
                    }}
                    style={{
                      boxShadow: isActive
                        ? "0 22px 40px -8px rgba(0, 0, 0, 0.72), 0 10px 20px -6px rgba(0, 0, 0, 0.55)"
                        : "0 10px 20px -8px rgba(0, 0, 0, 0.35)",
                    }}
                    className="rounded-[24px]"
                  >
                    <ToolBrandIcon
                      id={tool.id}
                      className="h-20 w-20 sm:h-24 sm:w-24"
                    />
                  </motion.div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold"
                      style={{
                        borderColor: isActive
                          ? `${tool.accentHex}75`
                          : "var(--border-panel)",
                        backgroundColor: isActive
                          ? `${tool.accentHex}22`
                          : "var(--bg-panel)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: tool.accentHex }}
                      />
                      {tool.tag}
                    </span>

                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel)] text-[var(--text-secondary)] transition-transform duration-300 lg:hidden ${
                        isActive ? "rotate-180 text-[var(--accent)]" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                <div className="mt-5 w-full">
                  <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                    {tool.name}
                  </h3>
                  {!isActive && (
                    <p className="mt-1 text-xs font-medium text-[var(--text-muted)] lg:hidden">
                      Toque para ler
                    </p>
                  )}
                </div>
              </button>

              {/* DESKTOP: Balanced Always-Visible Story (Zero Neighbor Shift) */}
              <div className="relative z-10 hidden flex-1 flex-col justify-between border-t border-[var(--border-panel)] bg-[var(--bg-surface)]/75 px-6 pt-4 pb-6 lg:flex">
                <p
                  className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isActive
                      ? "text-[var(--text-primary)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  {tool.story}
                </p>

                {tool.relatedSlug && tool.relatedLabel && (
                  <div className="mt-4 pt-1">
                    <Link
                      href={`/projetos/${tool.relatedSlug}`}
                      onClick={(event) => event.stopPropagation()}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                        isActive
                          ? "border-transparent bg-[#6C8CFF] text-white shadow-[0_8px_20px_-6px_rgba(108,140,255,0.75)] hover:bg-[#5A7BFF]"
                          : "border-[var(--border-panel)] bg-[var(--bg-panel)] text-[var(--text-primary)] hover:border-[#6C8CFF]"
                      }`}
                    >
                      <span>{tool.relatedLabel}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* MOBILE (< 1024px): Smooth Touch Accordion */}
              <div className="lg:hidden">
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      key={`${tool.id}-mobile-story`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.28,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[var(--border-panel)] bg-[var(--bg-surface)]/80 px-5 pt-4 pb-5">
                        <p className="text-sm leading-relaxed text-[var(--text-primary)]">
                          {tool.story}
                        </p>

                        {tool.relatedSlug && tool.relatedLabel && (
                          <Link
                            href={`/projetos/${tool.relatedSlug}`}
                            onClick={(event) => event.stopPropagation()}
                            className="mt-4 inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-[#6C8CFF] px-4 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_-6px_rgba(108,140,255,0.65)] transition-colors hover:bg-[#5A7BFF]"
                          >
                            <span>{tool.relatedLabel}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
