import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight, BookOpen, MapPin, MoveUpRight } from "lucide-react";
import { categories } from "@/lib/site";

const featuredReads = [
  {
    category: "Car buying tips",
    title: "What to check before buying a locally used car",
    excerpt:
      "A practical checklist for the forecourt — from logbook details to the things worth listening for on a test drive.",
    date: "18 June 2026",
    href: "https://beseki.com/blog/what-to-check-before-buying-a-locally-used-car",
    number: "01",
  },
  {
    category: "Vehicle guides",
    title: "Petrol, diesel or hybrid: what makes sense on Kenyan roads",
    excerpt:
      "Fuel type affects running costs more than most buyers expect. Compare the options for everyday Kenyan driving.",
    date: "30 May 2026",
    href: "https://beseki.com/blog/petrol-diesel-or-hybrid-for-kenyan-roads",
    number: "02",
  },
  {
    category: "Maintenance",
    title: "Keeping your car healthy in coastal humidity",
    excerpt:
      "A few simple habits can help protect your car from the salt air and humidity around Mombasa.",
    date: "12 May 2026",
    href: "https://beseki.com/blog/keeping-your-car-healthy-in-coastal-humidity",
    number: "03",
  },
];

const heroImage =
  "/__l5e/assets-v1/1348cb8e-1d33-4c56-be14-43ed22ab6ebc/beseki-alphand-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The BESEKI Journal | Car Buying Advice from Mombasa" },
      {
        name: "description",
        content:
          "Straightforward car-buying advice, vehicle guides and ownership tips from BESEKI COMPANY LIMITED in Mombasa, Kenya.",
      },
      { property: "og:title", content: "The BESEKI Journal | Car Buying Advice from Mombasa" },
      {
        property: "og:description",
        content:
          "Practical car-buying advice, vehicle guides and ownership tips from the BESEKI team in Mombasa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <div className="border-b border-border bg-muted/50">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-2 text-xs font-semibold uppercase text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden />
          Mombasa, Kenya
          <span className="ml-1 font-normal normal-case">— notes from the BESEKI showroom</span>
        </div>
      </div>

      <section className="relative isolate min-h-[430px] overflow-hidden bg-foreground md:min-h-[510px]" aria-labelledby="home-title">
        <img
          src={heroImage}
          alt="A clean white Toyota Alphard available through BESEKI in Mombasa"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/55 to-foreground/5" />
        <div className="relative mx-auto flex min-h-[430px] max-w-6xl items-center px-5 py-12 md:min-h-[510px] md:px-10">
          <div className="max-w-xl text-background">
            <p className="flex items-center gap-3 text-xs font-bold uppercase text-background/85">
              <span className="h-px w-9 bg-primary" /> BESEKI COMPANY LIMITED · THE JOURNAL
            </p>
            <h1 id="home-title" className="beseki-display mt-5 text-5xl font-bold leading-[0.98] md:text-7xl">
              The right car starts with a <span className="text-primary-foreground">good question.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-background/90 md:text-lg">
              Straightforward advice for choosing, buying and looking after a car in Kenya — from the BESEKI team in Mombasa.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="https://beseki.com/inventory"
                className="inline-flex min-h-12 items-center gap-3 bg-primary px-5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse available cars
                <MoveUpRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href="https://beseki.com/contact"
                className="inline-flex min-h-12 items-center gap-2 px-3 text-sm font-semibold text-background underline-offset-4 hover:underline"
              >
                Talk to our team <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-5 hidden items-center gap-2 text-xs font-semibold text-background/80 md:flex">
          <span className="h-px w-7 bg-background/70" />
          Careful selection. Straight answers.
        </div>
      </section>

      <section className="border-b border-border bg-background" aria-label="Journal topics">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-7 gap-y-3 px-5 py-5 md:px-10">
          <span className="eyebrow mr-1">Read by topic</span>
          {categories.slice(0, 5).map((category) => (
            <a
              key={category.slug}
              href={`https://beseki.com/blog`}
              className="text-sm font-semibold text-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              {category.name}
            </a>
          ))}
          <ArrowDownRight className="ml-auto hidden h-4 w-4 text-primary md:block" aria-hidden />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-20" aria-labelledby="latest-heading">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b border-border pb-5">
          <div>
            <p className="eyebrow text-primary">From the BESEKI team</p>
            <h2 id="latest-heading" className="beseki-display mt-2 text-4xl font-bold leading-tight md:text-5xl">
              Read before you ride.
            </h2>
          </div>
          <a
            href="https://beseki.com/blog"
            className="inline-flex items-center gap-2 pb-1 text-sm font-bold text-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            All articles <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>

        <div className="divide-y divide-border">
          {featuredReads.map((article) => (
            <article key={article.number} className="grid gap-3 py-7 md:grid-cols-[5rem_10rem_1fr_auto] md:items-start md:gap-6 md:py-9">
              <span className="beseki-display text-3xl font-semibold text-primary/80">{article.number}</span>
              <div>
                <p className="text-xs font-bold uppercase text-primary">{article.category}</p>
                <p className="mt-2 text-xs text-muted-foreground">{article.date}</p>
              </div>
              <div>
                <h3 className="max-w-2xl text-xl font-bold leading-snug md:text-2xl">
                  <a href={article.href} className="underline-offset-4 hover:text-primary hover:underline">
                    {article.title}
                  </a>
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
              </div>
              <a href={article.href} aria-label={`Read: ${article.title}`} className="mt-1 inline-flex h-10 w-10 items-center justify-center border border-border text-foreground transition-colors hover:border-primary hover:text-primary">
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/50" aria-labelledby="visit-heading">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-[1fr_auto] md:items-center md:px-10 md:py-16">
          <div>
            <p className="eyebrow text-primary">On the ground in Mombasa</p>
            <h2 id="visit-heading" className="beseki-display mt-2 text-3xl font-bold md:text-4xl">
              See the car. Ask anything. Take your time.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Read up, browse our current stock, then visit the BESEKI showroom along Lumumba Road to view a car in person.
            </p>
          </div>
          <a href="https://beseki.com/inventory" className="inline-flex min-h-12 items-center justify-center gap-3 bg-foreground px-5 text-sm font-bold text-background transition-colors hover:bg-foreground/90">
            Explore the showroom stock <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-8 md:px-10">
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="h-4 w-4 text-primary" aria-hidden />
          Car advice from BESEKI COMPANY LIMITED, Railway Station, Lumumba Road, Mombasa.
        </p>
      </div>
    </div>
  );
}