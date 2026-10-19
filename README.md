# Artist gallery

A one-page studio site. Change the words, drop in artwork, and connect a mailbox.

## Customize

1. Edit [`lib/site.ts`](lib/site.ts) — name, location, statement, email, and section labels.
2. Replace the files in `public/gallery`. Use `jpg`, `jpeg`, `png`, `webp`, `gif`, or `avif`. Sort order follows the filename, so prefix files with `01-`, `02-`, and so on. The filename becomes the title: `01-harbor-at-dusk.jpg` reads as “Harbor at dusk.”
3. Copy [`.env.example`](.env.example) to `.env.local` and add the SMTP settings for the mailbox that should receive contact form messages. Port `465` uses implicit TLS. Other ports, including `587`, use STARTTLS.

## Develop

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
