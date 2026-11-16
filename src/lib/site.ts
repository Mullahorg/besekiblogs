export const SITE = {
  name: "BESEKI Journal",
  tagline: "The automotive journal from BESEKI COMPANY LIMITED",
  description:
    "Straightforward car-buying advice, vehicle guides and ownership tips from BESEKI COMPANY LIMITED in Mombasa, Kenya.",
  platformUrl: "https://beseki.com",
  statusUrl: "https://beseki.com",
} as const;

export type NavItem = { label: string; to: string; external?: boolean };

export const primaryNav: NavItem[] = [
  { label: "Car buying", to: "/guides" },
  { label: "Vehicle guides", to: "/stories" },
  { label: "Maintenance", to: "/safety" },
  { label: "News", to: "/news" },
  { label: "About", to: "/about" },
];

export const ecosystemNav: NavItem[] = [
  { label: "Browse vehicles", to: "https://beseki.com/inventory", external: true },
  { label: "Financing", to: "https://beseki.com/financing", external: true },
  { label: "Trade in your car", to: "https://beseki.com/trade-in", external: true },
  { label: "Our services", to: "https://beseki.com/services", external: true },
  { label: "Visit the showroom", to: "https://beseki.com/contact", external: true },
  { label: "BESEKI home", to: "https://beseki.com", external: true },
];

export type CategoryMeta = {
  slug: string;
  name: string;
  route: string;
  description: string;
};

/* Editorial topics mapped onto the site's established public sections. */
export const categories: CategoryMeta[] = [
  {
    slug: "success-stories",
    name: "Car Buying Tips",
    route: "/stories",
    description:
      "Practical checklists for comparing cars, inspecting condition, and buying with confidence.",
  },
  {
    slug: "safety-escrow",
    name: "Vehicle Guides",
    route: "/safety",
    description:
      "Clear explanations of vehicle types, engines, features, and what works on Kenyan roads.",
  },
  {
    slug: "skills-business-tips",
    name: "Car Ownership",
    route: "/guides",
    description:
      "Helpful guidance on financing, running costs, paperwork, and getting the most from your car.",
  },
  {
    slug: "product-updates",
    name: "Maintenance",
    route: "/updates",
    description: "Simple maintenance advice to keep your car reliable in Kenya's coastal climate.",
  },
  {
    slug: "community-news",
    name: "BESEKI News",
    route: "/news",
    description: "New arrivals, showroom news, and updates from BESEKI COMPANY LIMITED.",
  },
  {
    slug: "help-center",
    name: "Buying FAQs",
    route: "/help",
    description: "Straight answers to common questions about buying and owning a car.",
  },
  {
    slug: "developer-documentation",
    name: "Developer Documentation",
    route: "/developers/docs",
    description: "Build on the HustlerLink platform with our APIs and tools.",
  },
  {
    slug: "api-documentation",
    name: "API Documentation",
    route: "/developers/api",
    description: "REST reference for the HustlerLink v1 API.",
  },
  {
    slug: "investor-updates",
    name: "Investor Updates",
    route: "/investors",
    description: "Numbers, milestones, and plans, shared openly.",
  },
  {
    slug: "company-announcements",
    name: "Company Announcements",
    route: "/news",
    description: "Announcements from the HustlerLink team.",
  },
  {
    slug: "legal-policies",
    name: "Legal and Policies",
    route: "/legal",
    description: "Terms, privacy, cookies, and platform policies in plain language.",
  },
  {
    slug: "knowledge-base",
    name: "Knowledge Base",
    route: "/help/faq",
    description: "Reference articles covering the whole platform.",
  },
];

export function categoryBySlug(slug: string): CategoryMeta | undefined {
  return categories.find((c) => c.slug === slug);
}

export const sectionRoutes = new Set([
  "/stories",
  "/guides",
  "/safety",
  "/updates",
  "/news",
  "/help",
  "/developers",
  "/investors",
  "/legal",
]);

/* Maps a category slug to its public index route. */
export function categoryRoute(slug: string): string {
  return categoryBySlug(slug)?.route ?? "/search";
}

export function formatDate(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function readingTimeText(minutes: number): string {
  return `${minutes} min read`;
}
