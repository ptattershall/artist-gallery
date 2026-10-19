/**
 * Template settings.
 * Change the copy here, then replace the images in `public/gallery`.
 * Mail delivery is configured in `.env.local` (see `.env.example`).
 */
export const site = {
  artistName: "Avery Lang",
  location: "Portland, Oregon",
  statement:
    "Paintings and works on paper about weather, memory, and the long light of the coast.",
  email: "studio@example.com",
  cta: "Get in touch",
  nav: {
    work: "Work",
    contact: "Contact",
  },
  gallery: {
    eyebrow: "Work",
    title: "Selected pieces",
    note: "A rotating wall of paintings and works on paper.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Write the studio",
    note: "Commissions, studio visits, and questions are welcome.",
    submit: "Send message",
    sending: "Sending",
  },
} as const;
