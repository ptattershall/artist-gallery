import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(120, "Name must be 120 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email.")
    .email("Please enter a valid email.")
    .max(200, "Email must be 200 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(1, "Please enter a message.")
    .max(5000, "Message must be 5000 characters or fewer."),
  company: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactField = "name" | "email" | "message";

export type ContactResult =
  | { ok: true; message: string }
  | {
      ok: false;
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
    };
