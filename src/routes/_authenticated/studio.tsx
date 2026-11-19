import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { PenLine, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { studioBootstrap, studioSaveMember, studioSaveTaxonomy, studioSetStatus } from "@/lib/api/studio.functions";
import { uploadImage } from "@/components/studio/upload";

export const Route = createFileRoute("/_authenticated/studio")({
  head: () => ({
    meta: [
      { title: "Writing studio | BESEKI Journal" },
      { name: "description", content: "Write, publish and manage BESEKI Journal articles and team profiles." },
      { property: "og:title", content: "Writing studio | BESEKI Journal" },
      { property: "og:description", content: "Write, publish and manage BESEKI Journal articles and team profiles." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StudioPage,
});

export const studioQueryKey = ["studio", "bootstrap"];

function StudioPage() {
  const boot = useServerFn(studioBootstrap);
  const q = useQuery({ queryKey: studioQueryKey, queryFn: () => boot() });
  if (q.isLoading) return <div className="container mx-auto px-4 py-16 text-muted-foreground">Loading studio…</div>;
  if (q.error || !q.data) return <div className="container mx-auto px-4 py-16">Could not load the studio.</div>;
  if (q.data.forbidden)
    return <div className="container mx-auto px-4 py-16"><h1 className="text-2xl font-bold">No access</h1><p className="text-muted-foreground mt-2">Your account isn't on the editorial team yet. Ask an admin to add you.</p></div>;
  const d = q.data;
  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="beseki-display text-4xl font-bold uppercase">Writing studio</h1>
          <p className="text-muted-foreground">Write articles, organise topics and manage the team.</p>
        </div>
        <Button asChild><Link to="/studio/write" search={{ id: undefined }}><PenLine className="mr-2 h-4 w-4" />New article</Link></Button>
      </div>
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Articles ({d.posts.length})</TabsTrigger>
          <TabsTrigger value="topics">Categories & vehicle types</TabsTrigger>
          {d.isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
        </TabsList>
        <TabsContent value="posts"><PostList posts={d.posts} categories={d.categories} canPublish={d.canPublish} /></TabsContent>
        <TabsContent value="topics"><Taxonomy categories={d.categories} tags={d.tags} topics={d.topics} /></TabsContent>
        {d.isAdmin && <TabsContent value="team"><Team authors={d.authors} /></TabsContent>}
      </Tabs>
    </div>
  );
}

type Boot = Extract<Awaited<ReturnType<typeof studioBootstrap>>, { forbidden: false }>;

function PostList({ posts, categories, canPublish }: { posts: Boot["posts"]; categories: Boot["categories"]; canPublish: boolean }) {
  const setStatus = useServerFn(studioSetStatus);
  const qc = useQueryClient();
  const change = async (id: string, status: "draft" | "published" | "archived") => {
    const r = await setStatus({ data: { id, status } });
    if (!r.ok) return toast.error(r.error);
    toast.success(status === "published" ? "Published" : status === "draft" ? "Moved to drafts" : "Archived");
    qc.invalidateQueries({ queryKey: studioQueryKey });
  };
  const cat = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "No category";
  if (!posts.length) return <p className="py-10 text-muted-foreground">No articles yet.</p>;
  return (
    <ul className="divide-y rounded-lg border">
      {posts.map((p) => (
        <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
          <div className="flex-1 min-w-[200px]">
            <Link to="/studio/write" search={{ id: p.id }} className="font-semibold hover:text-primary">{p.title}</Link>
            <div className="text-xs text-muted-foreground">{cat(p.category_id)} · {p.type} · updated {new Date(p.updated_at).toLocaleDateString()}</div>
          </div>
          <Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status}</Badge>
          <Button size="sm" variant="outline" asChild><Link to="/studio/write" search={{ id: p.id }}>Edit</Link></Button>
          {canPublish && p.status !== "published" && <Button size="sm" onClick={() => change(p.id, "published")}>Publish</Button>}
          {p.status === "published" && <Button size="sm" variant="ghost" onClick={() => change(p.id, "draft")}>Unpublish</Button>}
        </li>
      ))}
    </ul>
  );
}

function Taxonomy({ categories, tags, topics }: { categories: Boot["categories"]; tags: Boot["tags"]; topics: Boot["topics"] }) {
  const groups = [
    { kind: "categories" as const, label: "Categories", items: categories },
    { kind: "tags" as const, label: "Vehicle types, brands & fuel", items: tags },
    { kind: "topics" as const, label: "Reader topics", items: topics },
  ];
  return <div className="grid gap-6 md:grid-cols-3 pt-4">{groups.map((g) => <TaxGroup key={g.kind} {...g} />)}</div>;
}

function TaxGroup({ kind, label, items }: { kind: "categories" | "tags" | "topics"; label: string; items: { id: string; name: string }[] }) {
  const save = useServerFn(studioSaveTaxonomy);
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const add = async () => {
    const r = await save({ data: { kind, name } });
    if (!r.ok) return toast.error(r.error);
    setName(""); toast.success("Added");
    qc.invalidateQueries({ queryKey: studioQueryKey });
  };
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-semibold mb-3">{label}</h3>
      <div className="flex flex-wrap gap-1.5 mb-4">{items.map((i) => <Badge key={i.id} variant="secondary">{i.name}</Badge>)}</div>
      <div className="flex gap-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add new…" />
        <Button size="icon" onClick={add} disabled={!name.trim()} aria-label={`Add to ${label}`}><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}

type Member = Boot["authors"][number];
function Team({ authors }: { authors: Boot["authors"] }) {
  const [editing, setEditing] = useState<Partial<Member> | null>(null);
  return (
    <div className="pt-4">
      <div className="flex justify-end mb-4"><Button onClick={() => setEditing({})}><Plus className="mr-2 h-4 w-4" />Add team member</Button></div>
      {editing && <MemberForm member={editing} onDone={() => setEditing(null)} />}
      <div className="grid gap-4 sm:grid-cols-2">
        {authors.map((a) => (
          <div key={a.id} className="flex gap-4 rounded-lg border p-4">
            {a.avatar_url ? <img src={a.avatar_url} alt={a.name} className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-muted" />}
            <div className="flex-1">
              <div className="font-semibold">{a.name}</div>
              <div className="text-sm text-primary">{a.role_title}</div>
              <p className="text-sm text-muted-foreground line-clamp-2">{a.bio}</p>
              <div className="mt-2 flex gap-3 text-sm">
                <button className="text-primary hover:underline" onClick={() => setEditing(a)}>Edit profile</button>
                <Link to="/authors/$slug" params={{ slug: a.slug }} className="text-muted-foreground hover:underline">View portfolio</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MemberForm({ member, onDone }: { member: Partial<Member>; onDone: () => void }) {
  const save = useServerFn(studioSaveMember);
  const qc = useQueryClient();
  const [f, setF] = useState({ name: member.name ?? "", roleTitle: member.role_title ?? "", bio: member.bio ?? "", avatarUrl: member.avatar_url ?? "" });
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    setBusy(true);
    const r = await save({ data: { id: member.id, ...f } });
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.success("Profile saved");
    qc.invalidateQueries({ queryKey: studioQueryKey });
    onDone();
  };
  return (
    <div className="mb-6 grid gap-3 rounded-lg border bg-muted/30 p-4">
      <h3 className="font-semibold">{member.id ? "Edit profile" : "New team member"}</h3>
      <Input placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      <Input placeholder="Role, e.g. Motoring Reporter" value={f.roleTitle} onChange={(e) => setF({ ...f, roleTitle: e.target.value })} />
      <Textarea placeholder="Short bio / portfolio summary" rows={4} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} />
      <div className="flex items-center gap-3">
        {f.avatarUrl && <img src={f.avatarUrl} alt="" className="h-12 w-12 rounded-full object-cover" />}
        <Input type="file" accept="image/*" onChange={async (e) => {
          const file = e.target.files?.[0]; if (!file) return;
          try { setBusy(true); setF({ ...f, avatarUrl: await uploadImage(file, "team") }); } catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
        }} />
      </div>
      <div className="flex gap-2"><Button onClick={submit} disabled={busy || !f.name.trim()}>Save</Button><Button variant="ghost" onClick={onDone}>Cancel</Button></div>
    </div>
  );
}
