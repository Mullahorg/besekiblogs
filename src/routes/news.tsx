import { createFileRoute } from "@tanstack/react-router";
import { listPublishedPosts } from "@/lib/api/content.functions";
import { SectionIndex, SectionNotFound } from "@/components/content/section-index";
import type { PostCardDTO } from "@/lib/types";

const NEWS_CATEGORIES = ["community-news", "company-announcements"];

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News | BESEKI Journal" },
      {
        name: "description",
        content: "Community news and company announcements from BESEKI, in plain language.",
      },
      { property: "og:title", content: "News | BESEKI Journal" },
      {
        property: "og:description",
        content: "Community news and company announcements from BESEKI.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: async (): Promise<PostCardDTO[]> => {
    const all = await listPublishedPosts({ data: { limit: 40 } });
    return all.filter((p) => p.categorySlug && NEWS_CATEGORIES.includes(p.categorySlug));
  },
  component: NewsIndex,
  errorComponent: () => <SectionNotFound title="This section did not load" />,
  notFoundComponent: () => <SectionNotFound title="Section not found" />,
});

function NewsIndex() {
  const posts = Route.useLoaderData();
  return (
    <SectionIndex
      eyebrow="News"
      title="Community and company news"
      description="Meetups, partnerships, announcements, and news from the BESEKI community."
      posts={posts}
    />
  );
}
