import type { CSSProperties } from "react";
import { z } from "zod";
import siteContent from "@/content/site.json";

/**
 * Public site copy lives in `content/site.json`.
 * Mail delivery is configured in `.env.local` (see `.env.example`).
 */

const text = (key: string) =>
  z
    .string({
      required_error: `${key} is required.`,
      invalid_type_error: `${key} must be text.`,
    })
    .trim()
    .min(1, `${key} cannot be empty.`);

const hexColor = (key: string) =>
  z
    .string({ invalid_type_error: `${key} must be a hex color.` })
    .trim()
    .regex(
      /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/,
      `${key} must be a hex color like #c4a574.`,
    );

const siteSchema = z
  .object({
    artistName: text("artistName"),
    location: text("location"),
    statement: text("statement"),
    email: z
      .string({
        required_error: "email is required.",
        invalid_type_error: "email must be text.",
      })
      .trim()
      .email("email must be a valid email address."),
    cta: text("cta"),
    nav: z
      .object({
        work: text("nav.work"),
        contact: text("nav.contact"),
      })
      .strict(),
    gallery: z
      .object({
        eyebrow: text("gallery.eyebrow"),
        title: text("gallery.title"),
        note: text("gallery.note"),
      })
      .strict(),
    contact: z
      .object({
        eyebrow: text("contact.eyebrow"),
        title: text("contact.title"),
        note: text("contact.note"),
        submit: text("contact.submit"),
        sending: text("contact.sending"),
      })
      .strict(),
    socials: z
      .array(
        z
          .object({
            label: text("socials.label"),
            href: z
              .string({
                required_error: "socials.href is required.",
                invalid_type_error: "socials.href must be text.",
              })
              .trim()
              .url("socials.href must be an http or https URL.")
              .refine((href) => {
                const protocol = new URL(href).protocol;
                return protocol === "http:" || protocol === "https:";
              }, "socials.href must start with http:// or https://."),
          })
          .strict(),
      )
      .default([]),
    colors: z
      .object({
        background: hexColor("colors.background").optional(),
        text: hexColor("colors.text").optional(),
        accent: hexColor("colors.accent").optional(),
      })
      .strict()
      .optional(),
  })
  .strict();

const parsed = siteSchema.safeParse(siteContent);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `- ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");

  throw new Error(`content/site.json is invalid:\n${details}`);
}

export const site = parsed.data;

const theme: Record<string, string> = {};

if (site.colors?.background) {
  theme["--background"] = site.colors.background;
  theme["--ink"] = site.colors.background;
}

if (site.colors?.text) {
  theme["--foreground"] = site.colors.text;
  theme["--cream"] = site.colors.text;
  theme["--line"] = `color-mix(in srgb, ${site.colors.text} 14%, transparent)`;
}

if (site.colors?.accent) {
  theme["--brass"] = site.colors.accent;
}

if (site.colors?.text || site.colors?.background) {
  const textColor = site.colors.text ?? "var(--foreground)";
  const backgroundColor = site.colors.background ?? "var(--background)";
  theme["--muted"] = `color-mix(in srgb, ${textColor} 62%, ${backgroundColor})`;
  theme["--surface"] = `color-mix(in srgb, ${textColor} 4%, ${backgroundColor})`;
}

export const siteThemeStyle: CSSProperties | undefined =
  Object.keys(theme).length > 0 ? theme : undefined;
