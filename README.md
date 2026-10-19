# Artist gallery

A one-page studio site. Change the words, drop in artwork, and connect a mailbox.

## Customize

1. Edit [`content/site.json`](content/site.json).
   - `artistName`, `location`, `statement`, `email`, and `cta` are the name, place, short statement, public email, and hero button.
   - `nav`, `gallery`, and `contact` are the section labels.
   - `socials` is a list of `{ "label", "href" }` links. Leave it as `[]` to hide social links. Each `href` must start with `http://` or `https://`.
   - `colors` is optional. Add `background`, `text`, and `accent` as hex colors such as `#0c0b0a` or `#fff`. Leave them out to keep the default ink, cream, and brass.
2. Replace the files in `public/gallery`. Use `jpg`, `jpeg`, `png`, `webp`, `gif`, or `avif`. Sort order follows the filename, so prefix files with `01-`, `02-`, and so on. The filename becomes the title: `01-harbor-at-dusk.jpg` reads as “Harbor at dusk.” Replace `app/favicon.ico`, or add `app/icon.png`, for a personal icon.
3. Copy [`.env.example`](.env.example) to `.env.local` and add the SMTP settings for the mailbox that should receive contact form messages. Port `465` uses implicit TLS. Other ports, including `587`, use STARTTLS. The address shown on the page is `email` in `content/site.json`. `CONTACT_TO` is the inbox that receives the form, so the two can differ. `SMTP_FROM` can be a bare address; the artist name is added as the display name.

## Develop

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).
