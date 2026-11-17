import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/server/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Maintenance | BESEKI Journal" },
      { name: "description", content: "Simple maintenance advice to keep your car reliable in Kenya's coastal climate." },
      { property: "og:title", content: "Maintenance | BESEKI Journal" },
      { property: "og:description", content: "Simple maintenance advice to keep your car reliable in Kenya's coastal climate." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "safety-escrow", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="Car care" title="Maintenance" description="Simple maintenance advice to keep your car reliable in Kenya's coastal climate." posts={posts} />;
}
