import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { estimateReadingMinutes, renderMarkdown } from "@/lib/markdown";

const STAFF = ["writer", "editor", "senior_editor", "publisher", "admin", "super_admin"];
const PUBLISH = ["publisher", "admin", "super_admin"];
const ADMIN = ["admin", "super_admin"];

type Ctx = { supabase: import("@supabase/supabase-js").SupabaseClient; userId: string };
async function can(ctx: Ctx, roles: string[]) {
  const { data } = await ctx.supabase.rpc("journal_has_role", { _user_id: ctx.userId, _roles: roles });
  return Boolean(data);
}

export type VehicleSpecs = {
  make?: string; model?: string; year?: string; bodyType?: string; fuel?: string;
  transmission?: string; mileage?: string; price?: string; listingUrl?: string;
};

export const studioBootstrap = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const staff = await can(context, STAFF);
    if (!staff) return { forbidden: true as const };
    const [cats, tags, topics, authors, posts] = await Promise.all([
      context.supabase.from("categories").select("id,name,slug").is("deleted_at", null).order("sort_order"),
      context.supabase.from("tags").select("id,name,slug").is("deleted_at", null).order("name"),
      context.supabase.from("topics").select("id,name,slug").is("deleted_at", null).order("sort_order"),
      context.supabase.from("authors").select("id,name,slug,role_title,bio,avatar_url").is("deleted_at", null).order("name"),
      context.supabase.from("posts").select("id,title,slug,status,updated_at,category_id").is("deleted_at", null).order("updated_at", { ascending: false }).limit(200),
    ]);
    return {
      forbidden: false as const,
      canPublish: await can(context, PUBLISH),
      isAdmin: await can(context, ADMIN),
      categories: cats.data ?? [], tags: tags.data ?? [], topics: topics.data ?? [],
      authors: authors.data ?? [], posts: posts.data ?? [],
    };
  });

export const studioGetPost = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string }) => i)
  .handler(async ({ data, context }) => {
    const { data: p } = await context.supabase
      .from("posts")
      .select("id,title,slug,subtitle,excerpt,body_markdown,category_id,tag_ids,topic_ids,primary_author_id,cover_image_url,cover_image_alt,featured,editors_pick,status,custom_fields")
      .eq("id", data.id).maybeSingle();
    return p ? { ...p, custom_fields: (p.custom_fields ?? {}) as Record<string, unknown> } : null;
  });

export const studioSavePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: {
    id?: string; title: string; slug: string; subtitle?: string; excerpt?: string; body: string;
    categoryId: string | null; tagIds: string[]; topicIds: string[]; authorId: string | null;
    coverUrl?: string; coverAlt?: string; featured: boolean; vehicle: VehicleSpecs; publish: boolean;
  }) => i)
  .handler(async ({ data, context }) => {
    if (!(await can(context, STAFF))) return { ok: false, error: "You do not have permission to write posts." };
    if (!data.title.trim() || !data.slug.trim()) return { ok: false, error: "Title and web address are required." };
    if (data.publish && !(await can(context, PUBLISH))) return { ok: false, error: "Only publishers and admins can publish." };
    const row = {
      title: data.title.trim(), slug: data.slug.trim(),
      subtitle: data.subtitle?.trim() || null, excerpt: data.excerpt?.trim() || null,
      body_markdown: data.body, body_rendered: renderMarkdown(data.body),
      reading_time_minutes: estimateReadingMinutes(data.body),
      category_id: data.categoryId, tag_ids: data.tagIds, topic_ids: data.topicIds,
      primary_author_id: data.authorId, author_ids: data.authorId ? [data.authorId] : [],
      cover_image_url: data.coverUrl || null, cover_image_alt: data.coverAlt || null,
      featured: data.featured, custom_fields: { vehicle: data.vehicle },
    };
    let id = data.id;
    if (id) {
      const { error } = await context.supabase.from("posts").update(row).eq("id", id);
      if (error) return { ok: false, error: error.message };
    } else {
      const { data: c, error } = await context.supabase.from("posts")
        .insert({ ...row, status: "draft", created_by_user_id: context.userId }).select("id").single();
      if (error) return { ok: false, error: error.message };
      id = c.id;
    }
    if (data.publish) {
      const { error } = await context.supabase.from("posts")
        .update({ status: "published", published_at: new Date().toISOString() }).eq("id", id);
      if (error) return { ok: false, error: error.message };
    }
    return { ok: true, id };
  });

export const studioSetStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; status: "draft" | "published" | "archived" }) => i)
  .handler(async ({ data, context }) => {
    if (!(await can(context, data.status === "published" ? PUBLISH : STAFF))) return { ok: false, error: "Not allowed." };
    const patch: Record<string, unknown> = { status: data.status };
    if (data.status === "published") patch.published_at = new Date().toISOString();
    const { error } = await context.supabase.from("posts").update(patch).eq("id", data.id);
    return error ? { ok: false, error: error.message } : { ok: true };
  });

export const studioSaveTaxonomy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { kind: "categories" | "tags" | "topics"; name: string; description?: string }) => i)
  .handler(async ({ data, context }) => {
    const slug = slugify(data.name);
    if (!slug) return { ok: false, error: "Enter a name." };
    const row: Record<string, unknown> = { name: data.name.trim(), slug };
    if (data.kind !== "tags") row.description = data.description || null;
    if (data.kind === "categories") row.color_token = "primary";
    const { error } = await context.supabase.from(data.kind).insert(row as never);
    return error ? { ok: false, error: error.message } : { ok: true };
  });

export const studioSaveMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id?: string; name: string; roleTitle?: string; bio?: string; avatarUrl?: string }) => i)
  .handler(async ({ data, context }) => {
    if (!(await can(context, ADMIN))) return { ok: false, error: "Only admins manage team members." };
    const row = { name: data.name.trim(), role_title: data.roleTitle || null, bio: data.bio || null, avatar_url: data.avatarUrl || null };
    const { error } = data.id
      ? await context.supabase.from("authors").update(row).eq("id", data.id)
      : await context.supabase.from("authors").insert({ ...row, slug: slugify(data.name) });
    return error ? { ok: false, error: error.message } : { ok: true };
  });

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
