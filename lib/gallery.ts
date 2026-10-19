import { imageSize } from "image-size";
import { connection } from "next/server";
import { cache } from "react";
import fs from "node:fs/promises";
import path from "node:path";

const IMAGE_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".avif",
]);

export type GalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const altFromFilename = (filename: string) => {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");
  const withoutIndex = withoutExtension.replace(/^\d+[-_\s]+/, "");
  const words = withoutIndex.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

  if (!words) {
    return "Artwork";
  }

  return words.charAt(0).toUpperCase() + words.slice(1);
};

const readImage = async (
  directory: string,
  filename: string,
): Promise<GalleryImage | null> => {
  try {
    const buffer = await fs.readFile(path.join(directory, filename));
    const dimensions = imageSize(new Uint8Array(buffer));

    if (!dimensions.width || !dimensions.height) {
      return null;
    }

    return {
      src: `/gallery/${encodeURIComponent(filename)}`,
      alt: altFromFilename(filename),
      width: dimensions.width,
      height: dimensions.height,
    };
  } catch {
    return null;
  }
};

export const getGalleryImages = cache(async (): Promise<GalleryImage[]> => {
  // Opt into a fresh request so newly added files show up on refresh.
  await connection();

  const directory = path.join(process.cwd(), "public", "gallery");
  let entries: string[];

  try {
    entries = await fs.readdir(directory);
  } catch {
    return [];
  }

  const filenames = entries
    .filter((filename) => IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

  const images = await Promise.all(
    filenames.map((filename) => readImage(directory, filename)),
  );

  return images.filter((image): image is GalleryImage => image !== null);
});
