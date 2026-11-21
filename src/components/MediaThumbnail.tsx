"use client";

import { useState } from "react";
import { isImageUrl } from "@/data/projects";

const DEFAULT_DARK_GRADIENT =
  "radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.28), transparent 52%), linear-gradient(145deg, #141418 0%, #0d0e12 58%, #09090b 100%)";

interface MediaThumbnailProps {
  src: string;
  alt: string;
  className?: string;
  fallbackGradient?: string;
}

function getYoutubeHqFallback(url: string): string | null {
  if (
    (url.includes("i.ytimg.com") || url.includes("img.youtube.com")) &&
    url.includes("maxresdefault.jpg")
  ) {
    return url.replace("maxresdefault.jpg", "hqdefault.jpg");
  }
  return null;
}

/**
 * Fallback em 3 estágios para capas de vídeos normais e YouTube Shorts:
 * 1) URL original (ex: maxresdefault.jpg)
 * 2) hqdefault.jpg (caso ocorra erro ou o YouTube retorne placeholder 120x90)
 * 3) Gradiente escuro cinematográfico da categoria (caso a imagem falhe completamente)
 */
export function MediaThumbnail({
  src,
  alt,
  className = "",
  fallbackGradient = DEFAULT_DARK_GRADIENT,
}: MediaThumbnailProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src);
  const [failedCompletely, setFailedCompletely] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setResolvedSrc(src);
    setFailedCompletely(false);
  }

  if (failedCompletely || !isImageUrl(resolvedSrc)) {
    return (
      <div
        aria-hidden="true"
        className={className}
        style={{
          background: isImageUrl(resolvedSrc) ? fallbackGradient : resolvedSrc,
        }}
      />
    );
  }

  const handleFallback = () => {
    const hqFallback = getYoutubeHqFallback(resolvedSrc);
    if (hqFallback && hqFallback !== resolvedSrc) {
      setResolvedSrc(hqFallback);
      return;
    }
    setFailedCompletely(true);
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={handleFallback}
      onLoad={(event) => {
        // YouTube retorna HTTP 200 com imagem cinza 120x90 quando maxresdefault não existe (comum em Shorts)
        if (event.currentTarget.naturalWidth <= 120) {
          handleFallback();
        }
      }}
      className={className}
    />
  );
}
