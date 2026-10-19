import { Suspense } from "react";
import Image from "next/image";
import { getGalleryImages } from "@/lib/gallery";
import { site } from "@/lib/site";

const frameClass =
  "mt-14 w-full max-w-md lg:absolute lg:right-[clamp(1.5rem,4vw,2.5rem)] lg:bottom-16 lg:mt-0 lg:w-[min(34vw,460px)] lg:max-w-none";

const Arrow = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const HeroFrame = () => (
  <div aria-hidden="true" className={`${frameClass} aspect-[3/4] animate-pulse bg-surface`} />
);

const HeroArtwork = async () => {
  const images = await getGalleryImages();
  const image = images[0];

  if (!image) {
    return null;
  }

  return (
    <figure className={`${frameClass} hero-rise hero-rise-4`}>
      <div className="border border-line p-3">
        <Image
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          priority
          sizes="(min-width: 1024px) 34vw, 100vw"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-4 text-xs tracking-[0.18em] text-muted uppercase" aria-hidden="true">
        {image.alt}
      </figcaption>
    </figure>
  );
};

export const Hero = () => (
  <section
    id="top"
    className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden px-6 pb-16 pt-32 md:px-10"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,165,116,0.16),transparent_52%)]"
    />
    <div className="relative z-10 max-w-3xl lg:max-w-[42vw]">
      <p className="hero-rise text-xs tracking-[0.28em] uppercase text-brass">
        {site.location}
      </p>
      <span className="hero-rule mt-6 block h-px w-24 bg-brass" />
      <h1 className="hero-rise hero-rise-2 mt-8 font-serif text-[clamp(4.25rem,11vw,8.25rem)] leading-[0.82] tracking-[-0.045em] text-cream">
        {site.artistName.split(" ").map((word, index) => (
          <span key={`${word}-${index}`} className="block">
            {word}
          </span>
        ))}
      </h1>
      <p className="hero-rise hero-rise-3 mt-8 max-w-md font-serif text-2xl leading-snug text-cream/80 italic md:text-3xl">
        {site.statement}
      </p>
      <a
        href="#contact"
        className="hero-rise hero-rise-4 mt-10 inline-flex items-center gap-3 border border-brass/70 px-6 py-3 text-xs tracking-[0.22em] uppercase text-cream transition-colors duration-300 hover:bg-brass hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
      >
        {site.cta}
        <Arrow />
      </a>
    </div>
    <Suspense fallback={<HeroFrame />}>
      <HeroArtwork />
    </Suspense>
  </section>
);
