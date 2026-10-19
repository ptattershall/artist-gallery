import { site } from "@/lib/site";

const linkClass =
  "text-cream underline decoration-brass/60 underline-offset-4 transition-colors hover:decoration-brass focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass";

type SocialLinksProps = {
  className?: string;
};

export const SocialLinks = ({ className }: SocialLinksProps) => {
  if (site.socials.length === 0) {
    return null;
  }

  return (
    <ul className={className}>
      {site.socials.map((social) => (
        <li key={`${social.label}-${social.href}`}>
          <a href={social.href} target="_blank" rel="noreferrer" className={linkClass}>
            {social.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
};
