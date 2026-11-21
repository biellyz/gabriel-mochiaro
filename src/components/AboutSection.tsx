"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const EXPERTISE_AREAS = [
  { label: "Edição de Vídeo", dot: "#93C5FD" },
  { label: "Pós-Produção", dot: "#C4B5FD" },
  { label: "Projetos Audiovisuais Gerais", dot: "#6EE7B7" },
  { label: "Cobertura de Eventos", dot: "#FDBA74" },
  { label: "Reels e Novelas Verticais", dot: "#F9A8D4" },
] as const;

export function AboutSection() {
  return (
    <section
      id="sobre"
      aria-label="Sobre Mim"
      className="scroll-mt-24 overflow-hidden rounded-[32px] border border-[var(--border-panel)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-soft)] sm:p-10"
    >
      <div className="grid grid-cols-1 gap-7 md:grid-cols-12 md:items-center md:gap-8 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="md:col-span-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-3.5 py-1 text-xs font-semibold text-[var(--accent)]">
            Sobre Mim
          </span>
          <h2 className="mt-3.5 font-display text-2xl leading-tight font-bold tracking-tight text-[var(--text-primary)] sm:text-4xl">
            Audiovisual, Publicidade e Mídias Digitais.
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Sou Gabriel Mochiaro, um criativo focado no audiovisual e nas mídias
            digitais. Unindo os conhecimentos da Publicidade com a prática do
            mercado, atuo de ponta a ponta em projetos de comunicação: desde a
            captação e edição de vídeo até a produção de conteúdo e marketing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-[var(--border-panel)] bg-[var(--bg-panel-alt)] p-5 sm:p-6 md:col-span-5"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            <span>Áreas de Atuação</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {EXPERTISE_AREAS.map((area) => (
              <span
                key={area.label}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-panel)] bg-[var(--bg-panel)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] shadow-sm sm:text-sm"
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: area.dot }}
                />
                <span>{area.label}</span>
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
