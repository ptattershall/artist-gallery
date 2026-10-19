import { ContactSection } from "@/components/contact-form";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Gallery />
        <ContactSection />
      </main>
      <footer className="border-t border-line px-6 py-8 md:px-10">
        <div className="flex flex-col gap-3 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-serif text-lg text-cream">{site.artistName}</p>
          <p>{site.location}</p>
          <a
            href={`mailto:${site.email}`}
            className="text-cream underline decoration-brass/60 underline-offset-4 transition-colors hover:decoration-brass focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass"
          >
            {site.email}
          </a>
        </div>
      </footer>
    </>
  );
}
