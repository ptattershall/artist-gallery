import { Suspense } from "react";
import { GalleryGrid } from "@/components/gallery-lightbox";
import { Reveal } from "@/components/reveal";
import { getGalleryImages } from "@/lib/gallery";
import { site } from "@/lib/site";

const skeletonHeights = ["h-72", "h-96", "h-64", "h-[28rem]", "h-80", "h-[22rem]"] as const;

const GalleryFallback = () => (
  <div className="columns-1 gap-6 sm:columns-2 xl:columns-3" aria-hidden="true">
    {skeletonHeights.map((height, index) => (
      <div
        key={`${height}-${index}`}
        className={`mb-8 break-inside-avoid animate-pulse bg-surface ${height}`}
      />
    ))}
  </div>
);

const EmptyGallery = () => (
  <div className="border border-dashed border-line px-8 py-20 text-center">
    <p className="font-serif text-4xl text-cream">The studio wall is empty.</p>
    <p className="mx-auto mt-4 max-w-md leading-7 text-muted">
      Add images to <code className="text-cream">public/gallery</code> and they will
      appear here. Prefix filenames with 01-, 02- to choose the order.
    </p>
  </div>
);

const GalleryImages = async () => {
  const images = await getGalleryImages();

  if (images.length === 0) {
    return <EmptyGallery />;
  }

  return <GalleryGrid images={images} />;
};

export const Gallery = () => (
  <section id="work" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-32">
    <Reveal>
      <p className="text-xs tracking-[0.28em] text-brass uppercase">{site.gallery.eyebrow}</p>
      <h2 className="mt-4 font-serif text-5xl tracking-tight text-cream md:text-7xl">
        {site.gallery.title}
      </h2>
      <p className="mt-5 max-w-md text-lg leading-8 text-muted">{site.gallery.note}</p>
    </Reveal>
    <div className="mt-14">
      <Suspense fallback={<GalleryFallback />}>
        <GalleryImages />
      </Suspense>
    </div>
  </section>
);
