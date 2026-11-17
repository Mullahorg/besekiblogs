import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | BESEKI Journal" },
      {
        name: "description",
        content: "BESEKI Journal is the editorial home of BESEKI: car-buying advice, vehicle guides, and maintenance tips.",
      },
      { property: "og:title", content: "About | BESEKI Journal" },
      {
        property: "og:description",
        content: "BESEKI Journal is the editorial home of BESEKI.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AboutPage,
});

const TEAM = [
  {
    name: "Amina Wanjiru",
    role: "Senior Editor",
    to: "/authors/amina-wanjiru",
    bio: "Leads the newsroom. Eight years covering the Kenyan motor industry.",
  },
  {
    name: "David Otieno",
    role: "Staff Writer",
    to: "/authors/david-otieno",
    bio: "Writes the guides. A trained mechanic who explains engines, servicing and running costs.",
  },
  {
    name: "Grace Mutua",
    role: "Motoring Reporter",
    to: "/authors/grace-mutua",
    bio: "Reviews new arrivals and talks to car buyers every week.",
  },
];

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 lg:py-14">
      <p className="eyebrow">About</p>
      <h1 className="mt-1 text-4xl font-extrabold tracking-tight md:text-5xl">
        The car-buying journal from BESEKI COMPANY LIMITED
      </h1>
      <div className="article-body mt-8">
        <p>
          BESEKI Journal is the editorial home of BESEKI. We help drivers in Mombasa and across Kenya choose, finance, and look after the right car, in plain language.
        </p>
        <p>
          We hold ourselves to a few rules. Body text is never small. Fees and terms are stated
          upfront. When we make a mistake, we correct it in public.
        </p>
        <p>
          When you are ready to buy, browse the latest vehicles at beseki.com.
        </p>
        <p>
          Read{" "}
          <a href="https://beseki.com">beseki.com</a> to shop vehicles, or{" "}
          <Link to="/contact" className="text-primary underline">
            contact our team
          </Link>{" "}
          with a story we should cover.
        </p>
      </div>

      <section className="mt-12" aria-labelledby="team-heading">
        <h2 id="team-heading" className="text-2xl font-bold tracking-tight">
          The newsroom
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {TEAM.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className="rounded-2xl border border-border bg-card p-5 card-interactive"
            >
              <p className="font-bold">{m.name}</p>
              <p className="text-sm font-semibold text-muted-foreground">{m.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.bio}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
