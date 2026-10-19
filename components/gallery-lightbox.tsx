"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { GalleryImage } from "@/lib/gallery";
import { Reveal } from "@/components/reveal";

type GalleryLightboxProps = {
  images: GalleryImage[];
  activeIndex: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
};

const padIndex = (index: number) => String(index + 1).padStart(2, "0");

export const GalleryLightbox = ({
  images,
  activeIndex,
  onClose,
  onChange,
}: GalleryLightboxProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const image = activeIndex === null ? null : images[activeIndex];

  const requestClose = () => {
    dialogRef.current?.close();
  };

  const showPrevious = () => {
    if (activeIndex === null || images.length < 2) {
      return;
    }

    onChange((activeIndex - 1 + images.length) % images.length);
  };

  const showNext = () => {
    if (activeIndex === null || images.length < 2) {
      return;
    }

    onChange((activeIndex + 1) % images.length);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);

    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || activeIndex === null || dialog.open) {
      return;
    }

    dialog.showModal();
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    titleRef.current?.focus();
  }, [activeIndex]);

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      requestClose();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  return (
    <dialog
      id="artwork-dialog"
      ref={dialogRef}
      aria-label={image?.alt ?? "Artwork"}
      className="text-cream"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          requestClose();
        }
      }}
      onKeyDown={onKeyDown}
    >
      <button
        type="button"
        onClick={requestClose}
        className="absolute top-5 right-5 z-10 cursor-pointer px-3 py-2 text-xs tracking-[0.2em] text-cream/80 uppercase transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
      >
        Close
      </button>
      {image ? (
        <div
          className="flex w-[min(92vw,1080px)] flex-col"
          onClick={(event) => event.stopPropagation()}
        >
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            sizes="92vw"
            className="mx-auto h-auto max-h-[min(68dvh,calc(100dvh-9rem))] w-auto max-w-full object-contain"
          />
          <div className="mt-5 flex items-end justify-between gap-6">
            <div>
              <p
                ref={titleRef}
                tabIndex={-1}
                className="font-serif text-2xl text-cream outline-none md:text-3xl"
              >
                {image.alt}
              </p>
              <p className="mt-2 text-xs tracking-[0.18em] text-muted uppercase">
                {padIndex(activeIndex ?? 0)} / {String(images.length).padStart(2, "0")}
              </p>
            </div>
            {images.length > 1 ? (
              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous work"
                  className="cursor-pointer border border-line px-4 py-2 text-xs tracking-[0.18em] text-cream uppercase transition-colors hover:border-brass hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next work"
                  className="cursor-pointer border border-line px-4 py-2 text-xs tracking-[0.18em] text-cream uppercase transition-colors hover:border-brass hover:text-brass focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </dialog>
  );
};

type GalleryGridProps = {
  images: GalleryImage[];
};

export const GalleryGrid = ({ images }: GalleryGridProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const close = useCallback(() => setActiveIndex(null), []);
  const change = useCallback((index: number) => setActiveIndex(index), []);

  return (
    <>
      <ul className="columns-1 gap-6 sm:columns-2 xl:columns-3">
        {images.map((image, index) => (
          <li key={image.src} className="mb-8 break-inside-avoid">
            <Reveal delay={(index % 6) as 0 | 1 | 2 | 3 | 4 | 5}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View ${image.alt}`}
                className="group block w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
              >
                <span className="block overflow-hidden border border-line">
                  <Image
                    src={image.src}
                    alt=""
                    width={image.width}
                    height={image.height}
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 92vw"
                    className="h-auto w-full transition duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </span>
                <span className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="font-serif text-xl text-cream/90 transition-colors group-hover:text-cream">
                    {image.alt}
                  </span>
                  <span className="text-xs tracking-[0.18em] text-muted">
                    {padIndex(index)}
                  </span>
                </span>
              </button>
            </Reveal>
          </li>
        ))}
      </ul>
      <GalleryLightbox
        images={images}
        activeIndex={activeIndex}
        onClose={close}
        onChange={change}
      />
    </>
  );
};
