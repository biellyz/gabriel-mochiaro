"use client";

import { motion } from "framer-motion";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { CONTACT_LINKS } from "@/data/projects";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.55L3 20.5l1.55-5.3A8.5 8.5 0 1 1 21 11.5z" />
      <path d="M9.6 8.9c.2-.4.45-.42.7-.42h.55c.18 0 .42.06.56.38l.72 1.72c.1.24.06.5-.12.68l-.48.54c.42.84 1.15 1.56 1.98 1.98l.54-.48c.18-.18.44-.22.68-.12l1.72.72c.32.14.38.38.38.56v.55c0 .25-.02.5-.42.7-.5.24-1.56.36-2.86-.18-1.48-.6-2.96-1.88-3.78-3.32-.66-1.14-.62-2.28-.17-2.81z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5.5" ry="5.5" />
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
      strokeWidth={1.9}
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

const CONTACT_CHANNELS = [
  {
    key: "whatsapp",
    icon: WhatsAppIcon,
    iconBg: "#25D366",
    hoverBorder: "hover:border-[#25D366]/65",
    shadowColor: "rgba(37, 211, 102, 0.4)",
    ...CONTACT_LINKS.whatsapp,
  },
  {
    key: "instagram",
    icon: InstagramIcon,
    iconBg:
      "linear-gradient(135deg, #F58529 0%, #DD2A7B 52%, #8134AF 100%)",
    hoverBorder: "hover:border-[#DD2A7B]/65",
    shadowColor: "rgba(221, 42, 123, 0.38)",
    ...CONTACT_LINKS.instagram,
  },
  {
    key: "linkedin",
    icon: LinkedInIcon,
    iconBg: "#0A66C2",
    hoverBorder: "hover:border-[#0A66C2]/70",
    shadowColor: "rgba(10, 102, 194, 0.42)",
    ...CONTACT_LINKS.linkedin,
  },
  {
    key: "email",
    icon: Mail,
    iconBg: "#EA4335",
    hoverBorder: "hover:border-[#EA4335]/65",
    shadowColor: "rgba(234, 67, 53, 0.38)",
    ...CONTACT_LINKS.email,
  },
] as const;

/**
 * Bloco final de Contato & Redes Sociais em harmonia crepuscular:
 * - Fundo cinematográfico crepuscular escurecido com nuances suaves de lavanda e azul-céu (sem bloco branco estourado)
 * - Borda delicada em lavanda translúcida e tipografia nítida de alto contraste
 * - Ícones de WhatsApp, Instagram, LinkedIn e E-mail nas cores originais de cada rede
 */
export function ContactFooter() {
  return (
    <footer
      id="contato"
      className="safe-px relative z-10 max-w-full scroll-mt-24 pt-2 pb-28 lg:pb-12"
    >
      <div className="mx-auto max-w-[1280px] space-y-6">
        {/* Twilight Harmonious Contact Panel */}
        <div
          className="relative overflow-hidden rounded-[34px] border border-[#C4B5FD]/22 p-6 text-white shadow-[0_28px_68px_-24px_rgba(4,6,18,0.85)] sm:p-10 lg:p-12"
          style={{
            background:
              "linear-gradient(135deg, #1E1A36 0%, #171B30 52%, #131A29 100%)",
          }}
        >
          {/* Soft Atmospheric Aurora Accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-12 h-72 w-72 rounded-full bg-[#C4B5FD]/18 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -left-12 h-72 w-72 rounded-full bg-[#60A5FA]/15 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-1/3 bottom-0 h-44 w-44 rounded-full bg-[#6EE7B7]/10 blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#C4B5FD]/30 bg-[#C4B5FD]/12 px-4 py-1.5 text-xs font-semibold text-[#DDD6FE]">
              <span className="h-2 w-2 rounded-full bg-[#C4B5FD]" />
              Contato &amp; Redes Sociais
            </span>

            <h2 className="mt-4 font-display text-[clamp(2rem,5vw,3.75rem)] leading-[1.02] font-bold tracking-tight text-white">
              Vamos criar{" "}
              <span className="bg-gradient-to-r from-[#93C5FD] via-[#C4B5FD] to-[#6EE7B7] bg-clip-text text-transparent">
                juntos
              </span>
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#CBD3E8] sm:text-base">
              Tem um documentário, campanha, entrevista, reel ou cobertura de
              evento em mente? Chama em qualquer um dos canais abaixo!
            </p>

            {/* Official-Color Rounded Social Buttons on Cozy Twilight Surfaces */}
            <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {CONTACT_CHANNELS.map((channel) => {
                const Icon = channel.icon;
                const isExternal = channel.href.startsWith("http");

                return (
                  <motion.a
                    key={channel.key}
                    href={channel.href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group flex min-h-[74px] items-center justify-between gap-3 rounded-3xl border border-white/10 bg-[#121524]/75 p-4 text-white backdrop-blur-md transition-all duration-300 hover:bg-[#191D32]/90 ${channel.hoverBorder}`}
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white transition-transform duration-300 group-hover:scale-105"
                        style={{
                          background: channel.iconBg,
                          boxShadow: `0 10px 24px -6px ${channel.shadowColor}`,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <div className="min-w-0">
                        <p className="font-display text-sm font-bold tracking-tight text-white">
                          {channel.label}
                        </p>
                        <p className="truncate text-xs font-medium text-[#B8C0D8]">
                          {channel.handle}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9DA7C4] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Clean Soft Footer Pill Bar */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel)] px-5 py-4 text-xs text-[var(--text-secondary)] sm:flex-row sm:rounded-full">
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6E94FF] via-[#A78BFA] to-[#6EE7B7] font-display text-[11px] font-bold text-white">
              GM
            </span>
            <span className="font-display text-sm font-bold text-[var(--text-primary)]">
              Gabriel Mochiaro
            </span>
            <span className="opacity-40">•</span>
            <span>Editor de Vídeo &amp; Publicitário</span>
          </div>

          <a
            href="#inicio"
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            <span>Voltar ao topo</span>
            <ArrowUp className="h-3.5 w-3.5 text-[var(--accent)]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
