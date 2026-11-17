import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";

type Variant = "worker" | "buyer" | "safety" | "developer" | "newsletter";

const VARIANTS: Record<Variant, { eyebrow: string; title: string; body: string; cta: { label: string; to: string } }> = {
  worker: {
    eyebrow: "Trade in",
    title: "Upgrade your car with a fair trade-in.",
    body: "Bring your current car to BESEKI for an honest valuation and put it toward your next vehicle.",
    cta: { label: "Value my trade-in", to: "https://beseki.com/trade-in" },
  },
  buyer: {
    eyebrow: "Ready to buy",
    title: "Find your next car at BESEKI.",
    body: "Browse new and locally used vehicles in Mombasa, compare prices, and book a viewing at our showroom.",
    cta: { label: "Browse vehicles", to: "https://beseki.com/inventory" },
  },
  safety: {
    eyebrow: "Financing",
    title: "Drive now, pay over time.",
    body: "BESEKI helps you arrange car financing with clear terms stated upfront, so you know exactly what you will pay.",
    cta: { label: "Explore financing", to: "https://beseki.com/financing" },
  },
  developer: {
    eyebrow: "For developers",
    title: "Build on the BESEKI API.",
    body: "Query jobs, workers, and businesses over REST. Scoped API keys, cursor pagination, and webhooks for platform events.",
    cta: { label: "Read the API reference", to: "/developers/api" },
  },
  newsletter: {
    eyebrow: "Stay in the loop",
    title: "The weekly BESEKI Drive Brief.",
    body: "One email each week: new arrivals, a practical buying guide, and car care tips. Double opt-in, one click to leave.",
    cta: { label: "Subscribe to the newsletter", to: "/newsletter" },
  },
};

export function CtaBanner({ variant }: { variant: Variant }) {
  const v = VARIANTS[variant];
  const external = v.cta.to.startsWith("http");
  return (
    <aside className="mt-12 flex flex-col items-start gap-4 rounded-2xl border-2 border-primary/20 bg-primary-soft p-6 md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex items-start gap-4">
        <span className="mt-0.5 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground sm:flex">
          <ShieldCheck className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <p className="eyebrow">{v.eyebrow}</p>
          <h3 className="mt-1 text-xl font-bold tracking-tight">{v.title}</h3>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">{v.body}</p>
        </div>
      </div>
      {external ? (
        <a
          href={v.cta.to}
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {v.cta.label}
        </a>
      ) : (
        <Link
          to={v.cta.to}
          className="inline-flex h-11 shrink-0 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {v.cta.label}
        </Link>
      )}
    </aside>
  );
}
