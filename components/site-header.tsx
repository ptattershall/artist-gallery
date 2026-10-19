"use client";

import { useEffect, useRef } from "react";
import { site } from "@/lib/site";

export const SiteHeader = () => {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) {
      return;
    }

    let frame = 0;

    const update = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-40 border-b border-transparent px-6 transition-[background-color,border-color,backdrop-filter] duration-300 md:px-10 [&.is-scrolled]:border-line [&.is-scrolled]:bg-background/85 [&.is-scrolled]:backdrop-blur-md"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-cream focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      <div className="flex h-20 items-center justify-between gap-6">
        <a
          href="#top"
          className="font-serif text-xl tracking-tight text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
        >
          {site.artistName}
        </a>
        <nav aria-label="Primary" className="flex items-center gap-6 sm:gap-8">
          <a
            href="#work"
            className="text-xs tracking-[0.22em] uppercase text-cream/80 transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
          >
            {site.nav.work}
          </a>
          <a
            href="#contact"
            className="text-xs tracking-[0.22em] uppercase text-cream/80 transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
          >
            {site.nav.contact}
          </a>
        </nav>
      </div>
    </header>
  );
};
