import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/ProjectCaseStudy";
import { getNextProject, getProjectBySlug, PROJECTS } from "@/data/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Projeto não encontrado — Gabriel Mochiaro",
    };
  }

  return {
    title: `${project.title} — Gabriel Mochiaro`,
    description: project.summary,
    openGraph: {
      title: `${project.title} — Gabriel Mochiaro`,
      description: project.summary,
      locale: "pt_BR",
      type: "article",
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(project.slug);
  const projectIndex = PROJECTS.findIndex((item) => item.slug === project.slug);

  return (
    <ProjectCaseStudy
      project={project}
      nextProject={nextProject}
      projectIndex={projectIndex}
      totalProjects={PROJECTS.length}
    />
  );
}
