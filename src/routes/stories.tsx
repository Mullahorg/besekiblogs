import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/api/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "Vehicle Guides | BESEKI Journal" },
      { name: "description", content: "Clear explanations of vehicle types, engines, features, and what works on Kenyan roads." },
      { property: "og:title", content: "Vehicle Guides | BESEKI Journal" },
      { property: "og:description", content: "Clear explanations of vehicle types, engines, features, and what works on Kenyan roads." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: () => listPublishedPosts({ data: { categorySlug: "success-stories", limit: 24 } }),
  component: IndexComponent,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function IndexComponent() {
  const posts = Route.useLoaderData();
  return <SectionIndex eyebrow="Vehicle guides" title="Vehicle Guides" description="Clear explanations of vehicle types, engines, features, and what works on Kenyan roads." posts={posts} />;
}
