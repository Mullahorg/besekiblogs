import { Link } from "@tanstack/react-router";
import { CarFront } from "lucide-react";
import { ecosystemNav, SITE } from "@/lib/site";

const columns = [
  {
    title: "Read",
    links: [
      { label: "Car buying", to: "/guides" },
      { label: "Vehicle guides", to: "/stories" },
      { label: "Maintenance", to: "/safety" },
      { label: "News", to: "/news" },
      { label: "Topics", to: "/topics" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Buying FAQs", to: "/help" },
      { label: "FAQ", to: "/help/faq" },
      { label: "Contact", to: "/contact" },
      { label: "Newsletter", to: "/newsletter" },
      { label: "About", to: "/about" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CarFront className="h-5 w-5" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-lg font-extrabold tracking-tight">
                BESEKI <span className="text-primary">Journal</span>
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE.description}
            </p>
            <a
              href={SITE.platformUrl}
              className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Shop cars at beseki.com
            </a>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow pb-3">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="eyebrow pb-3">On beseki.com</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {ecosystemNav.map((item) => (
              <a key={item.to} href={item.to} className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {new Intl.DateTimeFormat("en", { year: "numeric" }).format(new Date())} BESEKI COMPANY LIMITED. All rights reserved.
          </p>
          <nav aria-label="Legal" className="flex gap-4">
            <Link to="/legal/terms" className="text-sm font-medium text-muted-foreground hover:text-primary">Terms</Link>
            <Link to="/legal/privacy" className="text-sm font-medium text-muted-foreground hover:text-primary">Privacy</Link>
            <Link to="/legal/cookies" className="text-sm font-medium text-muted-foreground hover:text-primary">Cookies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
