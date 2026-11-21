export type ProjectCategory =
  | "Audiovisual"
  | "Reels"
  | "Eventos"
  | "Agência";

export type ProjectAspectRatio = "16:9" | "9:16";

export interface TrackStyle {
  trackCode: string;
  label: string;
  hex: string;
  dotClass: string;
  barClass: string;
  badgeClass: string;
  lightBadgeClass: string;
  activePillClass: string;
  hoverBorderClass: string;
  hoverGlowClass: string;
  textClass: string;
  fallbackGradient: string;
}

/**
 * Paleta de trilhas NLE calibrada para alta legibilidade tanto sobre painéis claros
 * quanto sobre docks escuros de grafite:
 * - V1 Audiovisual: Azul Cobalto (#3B82F6)
 * - V2 Reels: Violeta (#7C3AED)
 * - V3 Eventos: Âmbar (#D97706)
 * - V4 Agência: Esmeralda (#059669)
 */
export const CATEGORY_TRACK_STYLES: Record<ProjectCategory, TrackStyle> = {
  Audiovisual: {
    trackCode: "V1",
    label: "Audiovisual",
    hex: "#3B82F6",
    dotClass: "bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.6)]",
    barClass: "bg-[#3B82F6]",
    badgeClass: "border-[#3B82F6]/45 bg-[#3B82F6]/15 text-[#93C5FD]",
    lightBadgeClass: "border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#1D4ED8]",
    activePillClass:
      "border-[#3B82F6] bg-[#3B82F6] shadow-[0_8px_22px_-6px_rgba(59,130,246,0.55)]",
    hoverBorderClass: "hover:border-[#3B82F6]/70",
    hoverGlowClass:
      "hover:shadow-[0_22px_48px_-20px_rgba(15,23,42,0.45),0_0_0_1px_rgba(59,130,246,0.35)]",
    textClass: "text-[#60A5FA]",
    fallbackGradient:
      "radial-gradient(circle at 22% 20%, rgba(59, 130, 246, 0.34), transparent 52%), radial-gradient(circle at 82% 80%, rgba(30, 58, 138, 0.42), transparent 55%), linear-gradient(135deg, #16181d 0%, #101522 52%, #0e1014 100%)",
  },
  Reels: {
    trackCode: "V2",
    label: "Reels",
    hex: "#8B5CF6",
    dotClass: "bg-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.6)]",
    barClass: "bg-[#8B5CF6]",
    badgeClass: "border-[#8B5CF6]/45 bg-[#8B5CF6]/15 text-[#C4B5FD]",
    lightBadgeClass: "border-[#7C3AED]/30 bg-[#7C3AED]/10 text-[#6D28D9]",
    activePillClass:
      "border-[#7C3AED] bg-[#7C3AED] shadow-[0_8px_22px_-6px_rgba(124,58,237,0.5)]",
    hoverBorderClass: "hover:border-[#8B5CF6]/70",
    hoverGlowClass:
      "hover:shadow-[0_22px_48px_-20px_rgba(15,23,42,0.45),0_0_0_1px_rgba(139,92,246,0.35)]",
    textClass: "text-[#C4B5FD]",
    fallbackGradient:
      "radial-gradient(circle at 50% 18%, rgba(139, 92, 246, 0.38), transparent 55%), radial-gradient(circle at 20% 85%, rgba(59, 130, 246, 0.24), transparent 50%), linear-gradient(165deg, #181624 0%, #12101e 55%, #0e1014 100%)",
  },
  Eventos: {
    trackCode: "V3",
    label: "Eventos",
    hex: "#F59E0B",
    dotClass: "bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.55)]",
    barClass: "bg-[#F59E0B]",
    badgeClass: "border-[#F59E0B]/45 bg-[#F59E0B]/15 text-[#FCD34D]",
    lightBadgeClass: "border-[#D97706]/30 bg-[#F59E0B]/12 text-[#B45309]",
    activePillClass:
      "border-[#D97706] bg-[#D97706] shadow-[0_8px_22px_-6px_rgba(217,119,6,0.45)]",
    hoverBorderClass: "hover:border-[#F59E0B]/70",
    hoverGlowClass:
      "hover:shadow-[0_22px_48px_-20px_rgba(15,23,42,0.45),0_0_0_1px_rgba(245,158,11,0.35)]",
    textClass: "text-[#FCD34D]",
    fallbackGradient:
      "radial-gradient(circle at 65% 22%, rgba(245, 158, 11, 0.3), transparent 50%), radial-gradient(circle at 25% 78%, rgba(59, 130, 246, 0.2), transparent 55%), linear-gradient(130deg, #1b1815 0%, #151310 50%, #0e1014 100%)",
  },
  Agência: {
    trackCode: "V4",
    label: "Agência",
    hex: "#10B981",
    dotClass: "bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.55)]",
    barClass: "bg-[#10B981]",
    badgeClass: "border-[#10B981]/45 bg-[#10B981]/15 text-[#6EE7B7]",
    lightBadgeClass: "border-[#059669]/30 bg-[#10B981]/12 text-[#047857]",
    activePillClass:
      "border-[#059669] bg-[#059669] shadow-[0_8px_22px_-6px_rgba(5,150,105,0.45)]",
    hoverBorderClass: "hover:border-[#10B981]/70",
    hoverGlowClass:
      "hover:shadow-[0_22px_48px_-20px_rgba(15,23,42,0.45),0_0_0_1px_rgba(16,185,129,0.35)]",
    textClass: "text-[#6EE7B7]",
    fallbackGradient:
      "radial-gradient(circle at 30% 25%, rgba(16, 185, 129, 0.32), transparent 55%), radial-gradient(circle at 80% 75%, rgba(59, 130, 246, 0.2), transparent 50%), linear-gradient(160deg, #131c19 0%, #0f1614 55%, #0e1014 100%)",
  },
};

export interface ProjectProcess {
  /** Contexto e proposta narrativa do projeto */
  overview: string;
  /** Decisões de corte, ritmo, narrativa e pós-produção */
  editingApproach: string;
  /** Formatos entregues e acabamento final */
  delivery: string;
}

export interface ProjectStill {
  id: string;
  label: string;
  caption?: string;
  timecode?: string;
  /**
   * Caminho da imagem real (ex: "/stills/hatefulmurder-01.jpg", URL YouTube)
   * ou gradiente CSS cinematográfico usado como fallback visual.
   */
  imageUrl: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  /**
   * Categorias adicionais em que este clipe também aparece nos filtros
   * (ex: projetos da Agência Experimental que também pertencem a Audiovisual ou Reels).
   */
  secondaryCategories?: ProjectCategory[];
  role: string;
  year: string;
  aspectRatio: ProjectAspectRatio;
  technicalTag: string;
  summary: string;
  /**
   * Contexto do trabalho (ex: "Mini Documentário • Banda Hatefulmurder").
   */
  clientOrContext?: string;
  /**
   * Softwares ou etapas de pós-produção aplicadas no projeto.
   */
  tools?: string[];
  /**
   * Estrutura editorial para o estudo de caso (substitua pelos detalhes reais).
   */
  process?: ProjectProcess;
  /**
   * Galeria de frames/stills do projeto com fallback cinematográfico.
   */
  stills?: ProjectStill[];
  /**
   * URL do vídeo final (MP4/WebM direto ou link embed de Vimeo/YouTube).
   * Deixe vazio ("") enquanto o corte final não for inserido.
   */
  videoUrl: string;
  /**
   * Caminho da thumbnail (ex: "/thumbs/projeto.jpg", URL do YouTube)
   * ou gradiente CSS cinematográfico usado como fallback visual.
   */
  thumbnailUrl: string;
}

export type ProjectFilter =
  | "Todos"
  | "Reels"
  | "Eventos"
  | "Agência Experimental UVA Barra";

export const PROJECT_FILTERS: readonly ProjectFilter[] = [
  "Todos",
  "Reels",
  "Eventos",
  "Agência Experimental UVA Barra",
] as const;

export const FILTER_TO_CATEGORY: Partial<Record<ProjectFilter, ProjectCategory>> = {
  Reels: "Reels",
  Eventos: "Eventos",
  "Agência Experimental UVA Barra": "Agência",
};

export const SHOWREEL = {
  title: "Showreel — Gabriel Mochiaro",
  subtitle: "Compilado de Edição & Pós-Produção",
  technicalTag: "16:9 • SHOWREEL",
  aspectRatio: "16:9" as ProjectAspectRatio,
  /**
   * Cole aqui a URL do seu Showreel (MP4, Vimeo ou YouTube embed).
   */
  videoUrl: "",
};

/**
 * Caminho da foto de apresentação exibida no Hero.
 * Basta adicionar o arquivo em /public/images/hero-apresentacao.jpg.
 */
export const HERO_PORTRAIT_PATH = "/images/hero-apresentacao.jpg";

/**
 * Links de contato centralizados — edite com seus canais oficiais.
 */
export const CONTACT_LINKS = {
  whatsapp: {
    label: "WhatsApp",
    handle: "+55 (21) 96714-9422",
    href: "https://wa.me/5521967149422",
  },
  email: {
    label: "E-mail",
    handle: "gabrielmochiaro@gmail.com",
    href: "mailto:gabrielmochiaro@gmail.com",
  },
  instagram: {
    label: "Instagram",
    handle: "@biellyz",
    href: "https://www.instagram.com/biellyz/",
  },
  linkedin: {
    label: "LinkedIn",
    handle: "/in/gabrielmochiaro",
    href: "https://www.linkedin.com/in/gabrielmochiaro/",
  },
} as const;

function ytThumb(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
}

function ytEmbed(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Lista central de projetos.
 * Para adicionar um novo trabalho no futuro, basta incluir um novo objeto neste array.
 */
export const PROJECTS: Project[] = [
  // =========================================================================
  // 01 & 02 — AUDIOVISUAL (WIDESCREEN 16:9)
  // =========================================================================
  {
    id: "documentario-hatefulmurder",
    slug: "documentario-hatefulmurder",
    title: "HATEFULMURDER: O Recomeço",
    category: "Audiovisual",
    role: "Audiovisual • Edição & Pós-Produção",
    year: "2025",
    aspectRatio: "16:9",
    technicalTag: "16:9 • MINI DOC",
    summary:
      "Mini documentário acompanhando a transição de formação da banda carioca Hatefulmurder, registrando bastidores, entrevistas e as audições que marcaram o início de uma nova fase.",
    clientOrContext: "Mini Documentário • Banda Hatefulmurder",
    tools: ["Edição de Vídeo", "Montagem Narrativa", "Pós-Produção"],
    process: {
      overview:
        "Mini documentário dedicado ao momento de transição de formação da banda carioca Hatefulmurder, acompanhando de perto os bastidores, entrevistas e as audições para a nova fase.",
      editingApproach:
        "Espaço pronto para detalhar suas decisões reais de montagem, ritmo entre entrevistas e bastidores, construção climática e tratamento audiovisual.",
      delivery:
        "Vídeo completo publicado em formato widescreen (16:9) no YouTube.",
    },
    stills: [
      {
        id: "hm-still-01",
        label: "FRAME 01",
        caption: "HATEFULMURDER: O Recomeço",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("JKY-m_HcLII"),
      },
      {
        id: "hm-still-02",
        label: "FRAME 02",
        caption: "Bastidores & Entrevistas",
        timecode: "00:00:00:00",
        imageUrl:
          "radial-gradient(circle at 75% 25%, rgba(59, 130, 246, 0.28), transparent 50%), radial-gradient(circle at 20% 80%, rgba(15, 23, 42, 0.7), transparent 60%), linear-gradient(150deg, #16161d 0%, #0e1320 55%, #09090b 100%)",
      },
      {
        id: "hm-still-03",
        label: "FRAME 03",
        caption: "Audições & Nova Fase",
        timecode: "00:00:00:00",
        imageUrl:
          "radial-gradient(circle at 50% 20%, rgba(37, 99, 235, 0.42), transparent 52%), radial-gradient(circle at 85% 85%, rgba(59, 130, 246, 0.2), transparent 48%), linear-gradient(125deg, #131520 0%, #0a0f1c 58%, #09090b 100%)",
      },
    ],
    videoUrl: ytEmbed("JKY-m_HcLII"),
    thumbnailUrl: ytThumb("JKY-m_HcLII"),
  },
  {
    id: "a-prisao-eterna-de-nossas-memorias",
    slug: "a-prisao-eterna-de-nossas-memorias",
    title: "A Prisão Eterna de Nossas Memórias: Toc Toc",
    category: "Audiovisual",
    role: "Audiovisual • Curta-metragem",
    year: "2024",
    aspectRatio: "16:9",
    technicalTag: "16:9 • CURTA",
    summary:
      "Curta-metragem de ficção e drama psicológico centrado no embate entre memória, culpa e tensão familiar.",
    clientOrContext: "Curta-metragem • Projeto Acadêmico",
    tools: ["Audiovisual", "Montagem & Pós-Produção"],
    process: {
      overview:
        "Curta-metragem acadêmico de ficção e drama psicológico construído em torno do conflito entre memória, culpa e tensão familiar.",
      editingApproach:
        "Espaço pronto para descrever as escolhas de montagem, tempo dramático, atmosfera e pós-produção utilizadas na narrativa.",
      delivery:
        "Curta-metragem finalizado em formato widescreen (16:9) disponível no YouTube.",
    },
    stills: [
      {
        id: "toctoc-still-01",
        label: "FRAME 01",
        caption: "A Prisão Eterna de Nossas Memórias: Toc Toc",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("FGz85bJmj1s"),
      },
      {
        id: "toctoc-still-02",
        label: "FRAME 02",
        caption: "Atmosfera & Tensão",
        timecode: "00:00:00:00",
        imageUrl:
          "radial-gradient(circle at 28% 28%, rgba(59, 130, 246, 0.3), transparent 52%), radial-gradient(circle at 80% 76%, rgba(30, 41, 59, 0.65), transparent 55%), linear-gradient(140deg, #15161f 0%, #0d1019 55%, #09090b 100%)",
      },
      {
        id: "toctoc-still-03",
        label: "FRAME 03",
        caption: "Memória & Conflito",
        timecode: "00:00:00:00",
        imageUrl:
          "radial-gradient(circle at 72% 24%, rgba(37, 99, 235, 0.34), transparent 50%), radial-gradient(circle at 22% 82%, rgba(59, 130, 246, 0.2), transparent 52%), linear-gradient(125deg, #14151e 0%, #0b0e18 58%, #09090b 100%)",
      },
    ],
    videoUrl: ytEmbed("FGz85bJmj1s"),
    thumbnailUrl: ytThumb("FGz85bJmj1s"),
  },

  // =========================================================================
  // 03 & 04 — PRINCIPAIS REELS EM DESTAQUE (9:16)
  // =========================================================================
  {
    id: "reel-marketing-influencers-01",
    slug: "reel-marketing-influencers-01",
    title: "Reel Marketing & Influencers #01",
    category: "Reels",
    role: "Edição de Vídeo • Estágio em Marketing",
    year: "—",
    aspectRatio: "9:16",
    technicalTag: "9:16 • REELS",
    summary:
      "Conteúdo vertical editado durante atuação em empresa de marketing, com ritmo dinâmico pensado para criadores e redes sociais.",
    clientOrContext: "Reels • Estágio em Marketing",
    tools: ["Edição Vertical", "Montagem Dinâmica", "Pós-Produção"],
    process: {
      overview:
        "Conteúdo em formato Reels/Shorts editado no contexto de marketing digital e criadores de conteúdo.",
      editingApproach:
        "Espaço pronto para descrever a abordagem de corte, ritmo de fala e acabamento aplicados neste vídeo.",
      delivery:
        "Entrega vertical (9:16) otimizada para redes sociais.",
    },
    stills: [
      {
        id: "mkt-r01-still-01",
        label: "FRAME 01",
        caption: "Reel Marketing & Influencers #01",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("pkJW09ir-ro"),
      },
    ],
    videoUrl: ytEmbed("pkJW09ir-ro"),
    thumbnailUrl: ytThumb("pkJW09ir-ro"),
  },
  {
    id: "reel-uva-barra-01",
    slug: "reel-uva-barra-01",
    title: "Reel UVA Barra #01",
    category: "Agência",
    secondaryCategories: ["Reels"],
    role: "Edição Vertical • Agência Experimental",
    year: "—",
    aspectRatio: "9:16",
    technicalTag: "9:16 • REELS",
    summary:
      "Conteúdo vertical desenvolvido para a Agência Experimental UVA Barra com montagem ágil voltada ao formato Reels/Shorts.",
    clientOrContext: "Reels • Agência Experimental UVA Barra",
    tools: ["Edição Vertical", "Ritmo & Cortes", "Pós-Produção"],
    process: {
      overview:
        "Peça vertical criada dentro da rotina da Agência Experimental UVA Barra.",
      editingApproach:
        "Espaço pronto para descrever as escolhas de corte dinâmico, leitura em tela vertical e sincronia de ritmo.",
      delivery:
        "Vídeo finalizado em proporção vertical (9:16) para plataformas sociais.",
    },
    stills: [
      {
        id: "uva-r01-still-01",
        label: "FRAME 01",
        caption: "Reel UVA Barra #01",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("pR-v33Xp37k"),
      },
    ],
    videoUrl: ytEmbed("pR-v33Xp37k"),
    thumbnailUrl: ytThumb("pR-v33Xp37k"),
  },

  // =========================================================================
  // 05 a 08 — AGÊNCIA EXPERIMENTAL UVA BARRA (16:9 e 9:16)
  // =========================================================================
  {
    id: "projeto-horizontal-uva-barra",
    slug: "projeto-horizontal-uva-barra",
    title: "Projeto Horizontal — Agência Experimental UVA Barra",
    category: "Agência",
    secondaryCategories: ["Audiovisual"],
    role: "Edição de Vídeo & Audiovisual",
    year: "—",
    aspectRatio: "16:9",
    technicalTag: "16:9 • AGÊNCIA",
    summary:
      "Produção audiovisual horizontal desenvolvida no contexto da Agência Experimental UVA Barra.",
    clientOrContext: "Agência Experimental UVA Barra Materiais",
    tools: ["Edição de Vídeo", "Pós-Produção", "Comunicação Visual"],
    process: {
      overview:
        "Projeto audiovisual em formato widescreen produzido junto à Agência Experimental UVA Barra.",
      editingApproach:
        "Espaço reservado para detalhar o ritmo de edição, estrutura de cenas e acabamento final aplicados nesta entrega.",
      delivery:
        "Entrega final em formato horizontal (16:9) publicada no YouTube.",
    },
    stills: [
      {
        id: "uva-horiz-still-01",
        label: "FRAME 01",
        caption: "Projeto Horizontal — UVA Barra",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("6UkHlWrcA-0"),
      },
      {
        id: "uva-horiz-still-02",
        label: "FRAME 02",
        caption: "Composição & Montagem",
        timecode: "00:00:00:00",
        imageUrl: CATEGORY_TRACK_STYLES.Agência.fallbackGradient,
      },
    ],
    videoUrl: ytEmbed("6UkHlWrcA-0"),
    thumbnailUrl: ytThumb("6UkHlWrcA-0"),
  },
  {
    id: "reel-uva-barra-02",
    slug: "reel-uva-barra-02",
    title: "Reel UVA Barra #02",
    category: "Agência",
    secondaryCategories: ["Reels"],
    role: "Edição Vertical • Agência Experimental",
    year: "—",
    aspectRatio: "9:16",
    technicalTag: "9:16 • REELS",
    summary:
      "Conteúdo vertical desenvolvido para a Agência Experimental UVA Barra com foco em clareza narrativa e cadência para redes sociais.",
    clientOrContext: "Reels • Agência Experimental UVA Barra",
    tools: ["Edição Vertical", "Ritmo & Cortes", "Pós-Produção"],
    process: {
      overview:
        "Peça audiovisual vertical produzida na Agência Experimental UVA Barra.",
      editingApproach:
        "Espaço pronto para detalhar o ritmo de corte, enquadramento vertical e pós-produção.",
      delivery:
        "Entrega nativa em formato vertical (9:16).",
    },
    stills: [
      {
        id: "uva-r02-still-01",
        label: "FRAME 01",
        caption: "Reel UVA Barra #02",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("2p40YnuZmV0"),
      },
    ],
    videoUrl: ytEmbed("2p40YnuZmV0"),
    thumbnailUrl: ytThumb("2p40YnuZmV0"),
  },
  {
    id: "reel-uva-barra-03",
    slug: "reel-uva-barra-03",
    title: "Reel UVA Barra #03",
    category: "Agência",
    secondaryCategories: ["Reels"],
    role: "Edição Vertical • Agência Experimental",
    year: "—",
    aspectRatio: "9:16",
    technicalTag: "9:16 • REELS",
    summary:
      "Edição vertical produzida para a Agência Experimental UVA Barra explorando cortes objetivos e linguagem contemporânea.",
    clientOrContext: "Reels • Agência Experimental UVA Barra",
    tools: ["Edição Vertical", "Ritmo & Cortes", "Pós-Produção"],
    process: {
      overview:
        "Conteúdo em formato vertical desenvolvido no âmbito da Agência Experimental UVA Barra.",
      editingApproach:
        "Espaço reservado para registrar as decisões de montagem e acabamento visual deste reel.",
      delivery:
        "Entrega nativa em formato vertical (9:16).",
    },
    stills: [
      {
        id: "uva-r03-still-01",
        label: "FRAME 01",
        caption: "Reel UVA Barra #03",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("cT_u3iCCuzI"),
      },
    ],
    videoUrl: ytEmbed("cT_u3iCCuzI"),
    thumbnailUrl: ytThumb("cT_u3iCCuzI"),
  },
  {
    id: "reel-uva-barra-04",
    slug: "reel-uva-barra-04",
    title: "Reel UVA Barra #04",
    category: "Agência",
    secondaryCategories: ["Reels"],
    role: "Edição Vertical • Agência Experimental",
    year: "—",
    aspectRatio: "9:16",
    technicalTag: "9:16 • REELS",
    summary:
      "Peça vertical da Agência Experimental UVA Barra estruturada para leitura rápida e fluidez em dispositivos móveis.",
    clientOrContext: "Reels • Agência Experimental UVA Barra",
    tools: ["Edição Vertical", "Ritmo & Cortes", "Pós-Produção"],
    process: {
      overview:
        "Produção vertical realizada junto à Agência Experimental UVA Barra.",
      editingApproach:
        "Espaço reservado para detalhar escolhas de ritmo, transições e pós-produção.",
      delivery:
        "Entrega nativa em formato vertical (9:16).",
    },
    stills: [
      {
        id: "uva-r04-still-01",
        label: "FRAME 01",
        caption: "Reel UVA Barra #04",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("4jT9CTjSA70"),
      },
    ],
    videoUrl: ytEmbed("4jT9CTjSA70"),
    thumbnailUrl: ytThumb("4jT9CTjSA70"),
  },

  // =========================================================================
  // 09 a 12 — DEMAIS REELS ESTÁGIO MARKETING & INFLUENCERS (9:16)
  // =========================================================================
  {
    id: "reel-marketing-influencers-02",
    slug: "reel-marketing-influencers-02",
    title: "Reel Marketing & Influencers #02",
    category: "Reels",
    role: "Edição de Vídeo • Estágio em Marketing",
    year: "—",
    aspectRatio: "9:16",
    technicalTag: "9:16 • REELS",
    summary:
      "Edição vertical voltada para comunicação digital e criadores, priorizando clareza visual e ritmo contínuo.",
    clientOrContext: "Reels • Estágio em Marketing",
    tools: ["Edição Vertical", "Montagem Dinâmica", "Pós-Produção"],
    process: {
      overview:
        "Peça vertical produzida na rotina de estágio em empresa de marketing.",
      editingApproach:
        "Espaço pronto para detalhar escolhas de ritmo, montagem e finalização.",
      delivery:
        "Entrega vertical (9:16) otimizada para redes sociais.",
    },
    stills: [
      {
        id: "mkt-r02-still-01",
        label: "FRAME 01",
        caption: "Reel Marketing & Influencers #02",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("N_4nL4576Fw"),
      },
    ],
    videoUrl: ytEmbed("N_4nL4576Fw"),
    thumbnailUrl: ytThumb("N_4nL4576Fw"),
  },
  {
    id: "reel-marketing-influencers-03",
    slug: "reel-marketing-influencers-03",
    title: "Reel Marketing & Influencers #03",
    category: "Reels",
    role: "Edição de Vídeo • Estágio em Marketing",
    year: "—",
    aspectRatio: "9:16",
    technicalTag: "9:16 • REELS",
    summary:
      "Montagem vertical ágil construída para conteúdo de marketing e influenciadores em plataformas curtas.",
    clientOrContext: "Reels • Estágio em Marketing",
    tools: ["Edição Vertical", "Montagem Dinâmica", "Pós-Produção"],
    process: {
      overview:
        "Conteúdo vertical editado durante o estágio em empresa de marketing.",
      editingApproach:
        "Espaço pronto para detalhar decisões de corte, trilha e acabamento.",
      delivery:
        "Entrega vertical (9:16) otimizada para redes sociais.",
    },
    stills: [
      {
        id: "mkt-r03-still-01",
        label: "FRAME 01",
        caption: "Reel Marketing & Influencers #03",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("DI6QU0dSun4"),
      },
    ],
    videoUrl: ytEmbed("DI6QU0dSun4"),
    thumbnailUrl: ytThumb("DI6QU0dSun4"),
  },
  {
    id: "reel-marketing-influencers-04",
    slug: "reel-marketing-influencers-04",
    title: "Reel Marketing & Influencers #04",
    category: "Reels",
    role: "Edição de Vídeo • Estágio em Marketing",
    year: "—",
    aspectRatio: "9:16",
    technicalTag: "9:16 • REELS",
    summary:
      "Conteúdo vertical desenvolvido para engajamento e narrativa direta em vídeos curtos de marketing e criadores.",
    clientOrContext: "Reels • Estágio em Marketing",
    tools: ["Edição Vertical", "Montagem Dinâmica", "Pós-Produção"],
    process: {
      overview:
        "Peça vertical editada no contexto de marketing e conteúdo com influenciadores.",
      editingApproach:
        "Espaço pronto para detalhar a estrutura de edição e ritmo utilizada no corte.",
      delivery:
        "Entrega vertical (9:16) otimizada para redes sociais.",
    },
    stills: [
      {
        id: "mkt-r04-still-01",
        label: "FRAME 01",
        caption: "Reel Marketing & Influencers #04",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("xTd3HUqEq24"),
      },
    ],
    videoUrl: ytEmbed("xTd3HUqEq24"),
    thumbnailUrl: ytThumb("xTd3HUqEq24"),
  },
  {
    id: "reel-marketing-influencers-05",
    slug: "reel-marketing-influencers-05",
    title: "Reel Marketing & Influencers #05",
    category: "Reels",
    role: "Edição de Vídeo • Estágio em Marketing",
    year: "—",
    aspectRatio: "9:16",
    technicalTag: "9:16 • REELS",
    summary:
      "Edição vertical com cortes precisos e linguagem atual produzida para empresa de marketing e criadores.",
    clientOrContext: "Reels • Estágio em Marketing",
    tools: ["Edição Vertical", "Montagem Dinâmica", "Pós-Produção"],
    process: {
      overview:
        "Conteúdo vertical desenvolvido durante a atuação em empresa de marketing.",
      editingApproach:
        "Espaço pronto para registrar o processo de edição, ritmo e finalização.",
      delivery:
        "Entrega vertical (9:16) otimizada para redes sociais.",
    },
    stills: [
      {
        id: "mkt-r05-still-01",
        label: "FRAME 01",
        caption: "Reel Marketing & Influencers #05",
        timecode: "00:00:00:00",
        imageUrl: ytThumb("fR36fEjh8zY"),
      },
    ],
    videoUrl: ytEmbed("fR36fEjh8zY"),
    thumbnailUrl: ytThumb("fR36fEjh8zY"),
  },
];

export interface ProjectFolderBin {
  id: string;
  name: string;
  trackCode: string;
  accentHex: string;
  filterTarget: ProjectFilter;
  match: (project: Project) => boolean;
}

/**
 * Pastas organizacionais (bins) derivadas dinamicamente dos projetos existentes,
 * preservando 100% dos dados originais sem duplicar ou inventar entradas.
 */
export const PROJECT_FOLDER_BINS: readonly ProjectFolderBin[] = [
  {
    id: "bin-widescreen",
    name: "01_Projetos_Widescreen",
    trackCode: "V1",
    accentHex: "#3B82F6",
    filterTarget: "Todos",
    match: (project) =>
      project.aspectRatio === "16:9" && project.category !== "Eventos",
  },
  {
    id: "bin-uva-barra",
    name: "02_Agencia_UVA_Barra",
    trackCode: "V4",
    accentHex: "#10B981",
    filterTarget: "Agência Experimental UVA Barra",
    match: (project) => project.category === "Agência",
  },
  {
    id: "bin-reels-marketing",
    name: "03_Reels_Marketing",
    trackCode: "V2",
    accentHex: "#8B5CF6",
    filterTarget: "Reels",
    match: (project) => project.category === "Reels",
  },
  {
    id: "bin-eventos",
    name: "04_Cobertura_Eventos",
    trackCode: "V3",
    accentHex: "#F59E0B",
    filterTarget: "Eventos",
    match: (project) => project.category === "Eventos",
  },
] as const;

export function matchesCategory(
  project: Project,
  filter: ProjectFilter
): boolean {
  if (filter === "Todos") return true;
  const mappedCategory = FILTER_TO_CATEGORY[filter];
  if (!mappedCategory) return true;
  if (project.category === mappedCategory) return true;
  return Boolean(project.secondaryCategories?.includes(mappedCategory));
}

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function getNextProject(currentSlug: string): Project {
  const currentIndex = PROJECTS.findIndex(
    (project) => project.slug === currentSlug
  );
  if (currentIndex === -1) {
    return PROJECTS[0];
  }
  return PROJECTS[(currentIndex + 1) % PROJECTS.length];
}

export function isImageUrl(value: string): boolean {
  return (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  );
}

export function isEmbedUrl(url: string): boolean {
  return (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("vimeo.com")
  );
}

export function getEmbedVideoUrl(
  url: string,
  options?: {
    autoplay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
  }
): string {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    if (
      parsed.hostname.includes("youtube.com") ||
      parsed.hostname.includes("youtu.be")
    ) {
      parsed.searchParams.set("rel", "0");
      parsed.searchParams.set("modestbranding", "1");
      parsed.searchParams.set("playsinline", "1");
      parsed.searchParams.set("enablejsapi", "1");
      if (options?.autoplay) {
        parsed.searchParams.set("autoplay", "1");
      }
      if (options?.muted) {
        parsed.searchParams.set("mute", "1");
      }
      if (options?.controls === false) {
        parsed.searchParams.set("controls", "0");
      }
      if (options?.loop) {
        const videoId = parsed.pathname.split("/").filter(Boolean).pop();
        if (videoId) {
          parsed.searchParams.set("loop", "1");
          parsed.searchParams.set("playlist", videoId);
        }
      }
      return parsed.toString();
    }
    if (parsed.hostname.includes("vimeo.com")) {
      if (options?.autoplay) parsed.searchParams.set("autoplay", "1");
      if (options?.muted) parsed.searchParams.set("muted", "1");
      if (options?.loop) parsed.searchParams.set("loop", "1");
      return parsed.toString();
    }
    return url;
  } catch {
    return url;
  }
}
