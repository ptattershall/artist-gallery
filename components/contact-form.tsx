"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { sendContact } from "@/app/actions/contact";
import { Reveal } from "@/components/reveal";
import {
  contactSchema,
  type ContactInput,
  type ContactResult,
} from "@/lib/contact-schema";
import { site } from "@/lib/site";

const fieldClass =
  "mt-2 w-full border-b border-line bg-transparent py-3 text-lg text-cream outline-none transition-colors placeholder:text-muted/60 focus-visible:border-brass";

type FieldProps = {
  id: "name" | "email" | "message";
  label: string;
  error?: string;
  children: ReactNode;
};

const Field = ({ id, label, error, children }: FieldProps) => (
  <div>
    <label htmlFor={id} className="text-xs tracking-[0.22em] text-muted uppercase">
      {label}
      <span className="sr-only"> required</span>
    </label>
    {children}
    {error ? (
      <p id={`${id}-error`} className="mt-2 text-sm text-rose">
        {error}
      </p>
    ) : null}
  </div>
);

export const ContactSection = () => {
  const [result, setResult] = useState<ContactResult | null>(null);
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      company: "",
    },
  });

  const onSubmit = handleSubmit(
    async (values) => {
      setPending(true);
      setResult(null);

      try {
        const response = await sendContact(values);

        if (response.ok) {
          reset();
          setResult(response);
          return;
        }

        if (response.fieldErrors) {
          for (const [field, message] of Object.entries(response.fieldErrors)) {
            if (!message) {
              continue;
            }

            setError(field as "name" | "email" | "message", { message });
          }
        }

        setResult(response);
      } finally {
        setPending(false);
      }
    },
    () => {
      setResult({
        ok: false,
        message: "Please check the form and try again.",
      });
    },
  );

  return (
    <section id="contact" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-32">
      <div className="grid gap-16 border-t border-line pt-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24 lg:pt-24">
        <Reveal>
          <p className="text-xs tracking-[0.28em] text-brass uppercase">
            {site.contact.eyebrow}
          </p>
          <h2
            id="contact-title"
            className="mt-4 font-serif text-5xl tracking-tight text-cream md:text-7xl"
          >
            {site.contact.title}
          </h2>
          <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-cream/80 italic">
            {site.contact.note}
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-block text-cream underline decoration-brass/70 underline-offset-4 transition-colors hover:decoration-brass focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
          >
            {site.email}
          </a>
          <p className="mt-3 text-sm tracking-[0.14em] text-muted uppercase">
            {site.location}
          </p>
        </Reveal>
        <Reveal delay={1}>
          <form aria-labelledby="contact-title" onSubmit={onSubmit} noValidate className="relative">
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register("company")}
              />
            </div>
            <div className="flex flex-col gap-8">
              <Field id="name" label="Name" error={errors.name?.message}>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  maxLength={120}
                  aria-required="true"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={fieldClass}
                  {...register("name")}
                />
              </Field>
              <Field id="email" label="Email" error={errors.email?.message}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  maxLength={200}
                  spellCheck={false}
                  aria-required="true"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={fieldClass}
                  {...register("email")}
                />
              </Field>
              <Field id="message" label="Message" error={errors.message?.message}>
                <textarea
                  id="message"
                  rows={5}
                  maxLength={5000}
                  aria-required="true"
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  className={`${fieldClass} resize-y`}
                  {...register("message")}
                />
              </Field>
            </div>
            <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={pending}
                aria-busy={pending}
                className="inline-flex cursor-pointer items-center border border-brass/70 px-6 py-3 text-xs tracking-[0.22em] text-cream uppercase transition-colors duration-300 hover:bg-brass hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass disabled:cursor-wait disabled:opacity-60"
              >
                {pending ? site.contact.sending : site.contact.submit}
              </button>
              <p
                aria-live="polite"
                role="status"
                className={`min-h-6 text-sm ${result ? (result.ok ? "text-cream" : "text-rose") : ""}`}
              >
                {result?.message ?? ""}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
};
