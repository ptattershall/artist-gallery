"use server";

import { createTransport } from "nodemailer";
import { site } from "@/lib/site";
import {
  contactSchema,
  type ContactField,
  type ContactResult,
} from "@/lib/contact-schema";

const successMessage = `Thank you. Your note is on its way to ${site.artistName}.`;

const readEnv = (name: string) => process.env[name]?.trim() ?? "";

const getSmtpConfig = () => {
  const host = readEnv("SMTP_HOST");
  const user = readEnv("SMTP_USER");
  const pass = readEnv("SMTP_PASS");
  const from = readEnv("SMTP_FROM");
  const to = readEnv("CONTACT_TO");
  const portValue = readEnv("SMTP_PORT");
  const port = portValue ? Number(portValue) : 587;

  if (!host || !user || !pass || !from || !to) {
    return null;
  }

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return null;
  }

  return { host, user, pass, from, to, port };
};

const isHoneypotTripped = (input: unknown) => {
  if (!input || typeof input !== "object" || !("company" in input)) {
    return false;
  }

  const company = input.company;
  return typeof company === "string" && company.trim().length > 0;
};

const fieldErrorsFrom = (issues: { path: PropertyKey[]; message: string }[]) => {
  const fieldErrors: Partial<Record<ContactField, string>> = {};
  const fields: ContactField[] = ["name", "email", "message"];

  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key !== "string") {
      continue;
    }

    if (!fields.includes(key as ContactField) || fieldErrors[key as ContactField]) {
      continue;
    }

    fieldErrors[key as ContactField] = issue.message;
  }

  return fieldErrors;
};

export const sendContact = async (input: unknown): Promise<ContactResult> => {
  if (isHoneypotTripped(input)) {
    return { ok: true, message: successMessage };
  }

  const parsed = contactSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please check the form and try again.",
      fieldErrors: fieldErrorsFrom(parsed.error.issues),
    };
  }

  const smtp = getSmtpConfig();

  if (!smtp) {
    return {
      ok: false,
      message:
        "The studio mailbox is not configured yet. Add SMTP settings to .env.local and try again.",
    };
  }

  const { name, email, message } = parsed.data;
  const safeName = name.replace(/[\r\n]+/g, " ").trim();

  try {
    const transporter = createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });

    await transporter.sendMail({
      from: smtp.from,
      to: smtp.to,
      replyTo: email,
      subject: `Gallery inquiry from ${safeName}`,
      text: [`Name: ${safeName}`, `Email: ${email}`, "", message].join("\n"),
    });
  } catch {
    console.error("Contact email failed to send");
    return {
      ok: false,
      message: "The message could not be sent. Please try again in a moment.",
    };
  }

  return { ok: true, message: successMessage };
};
