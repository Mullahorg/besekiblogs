import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { studioBootstrap, studioGetPost, studioSavePost, slugify, type VehicleSpecs } from "@/lib/api/studio.functions";
import { uploadImage } from "@/components/studio/upload";
import { studioQueryKey } from "./studio";

export const Route = createFileRoute("/_authenticated/studio_/write")({
  validateSearch: (s: Record<string, unknown>): { id: string | undefined } => ({ id: typeof s["id"] === "string" ? s["id"] : undefined }),
  head: () => ({
    meta: [
      { title: "Write an article | BESEKI Journal" },
      { name: "description", content: "Compose and publish a BESEKI Journal article." },
      { property: "og:title", content: "Write an article | BESEKI Journal" },
      { property: "og:description", content: "Compose and publish a BESEKI Journal article." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WritePage,
});

const SECTIONS = [
  { v: "story", l: "Story" }, { v: "guide", l: "Buying guide" }, { v: "safety", l: "Safe buying" }, { v: "news", l: "News" },
];
const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"];
const BODIES = ["SUV", "Sedan", "Hatchback", "Pickup", "Van", "Station Wagon", "Coupe"];

const empty = {
  type: "story", title: "", slug: "", subtitle: "", excerpt: "", body: "", categoryId: "" as string, tagIds: [] as string[],
  topicIds: [] as string[], authorId: "" as string, coverUrl: "", coverAlt: "", featured: false, vehicle: {} as VehicleSpecs,
};

function WritePage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const boot = useServerFn(studioBootstrap);
  const getPost = useServerFn(studioGetPost);
  const save = useServerFn(studioSavePost);
  const b = useQuery({ queryKey: studioQueryKey, queryFn: () => boot() });
  const p = useQuery({ queryKey: ["studio", "post", id], queryFn: () => getPost({ data: { id: id! } }), enabled: !!id });
  const [f, setF] = useState(empty);
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const x = p.data;
    if (!x) return;
    setSlugTouched(true);
    setF({
      type: x.type, title: x.title, slug: x.slug, subtitle: x.subtitle ?? "", excerpt: x.excerpt ?? "", body: x.body_markdown ?? "",
      categoryId: x.category_id ?? "", tagIds: x.tag_ids ?? [], topicIds: x.topic_ids ?? [], authorId: x.primary_author_id ?? "",
      coverUrl: x.cover_image_url ?? "", coverAlt: x.cover_image_alt ?? "", featured: x.featured, vehicle: x.custom_fields.vehicle ?? {},
    });
  }, [p.data]);

  if (b.isLoading || (id && p.isLoading)) return <div className="container mx-auto px-4 py-16 text-muted-foreground">Loading…</div>;
  if (!b.data || b.data.forbidden) return <div className="container mx-auto px-4 py-16">You don't have access to the writing studio.</div>;
  const d = b.data;
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((o) => ({ ...o, [k]: v }));
  const setV = (k: keyof VehicleSpecs, v: string) => setF((o) => ({ ...o, vehicle: { ...o.vehicle, [k]: v } }));
  const toggle = (k: "tagIds" | "topicIds", v: string) => setF((o) => ({ ...o, [k]: o[k].includes(v) ? o[k].filter((x) => x !== v) : [...o[k], v] }));

  const submit = async (publish: boolean) => {
    setBusy(true);
    const r = await save({ data: { ...f, id, categoryId: f.categoryId || null, authorId: f.authorId || null, publish } });
    setBusy(false);
    if (!r.ok) return toast.error(r.error);
    toast.success(publish ? "Article published" : "Draft saved");
    qc.invalidateQueries({ queryKey: ["studio"] });
    if (!id && r.id) navigate({ to: "/studio/write", search: { id: r.id }, replace: true });
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10">
      <Link to="/studio" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="mr-1 h-4 w-4" />Back to studio</Link>
      <h1 className="beseki-display mb-6 text-4xl font-bold uppercase">{id ? "Edit article" : "New article"}</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="grid gap-4">
          <Field label="Title"><Input value={f.title} onChange={(e) => { set("title", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} /></Field>
          <Field label="Web address"><Input value={f.slug} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} /></Field>
          <Field label="Subtitle"><Input value={f.subtitle} onChange={(e) => set("subtitle", e.target.value)} /></Field>
          <Field label="Short summary"><Textarea rows={2} value={f.excerpt} onChange={(e) => set("excerpt", e.target.value)} /></Field>
          <Field label="Article (use ## for headings, - for lists, **bold**)"><Textarea rows={18} className="font-mono text-sm" value={f.body} onChange={(e) => set("body", e.target.value)} /></Field>

          <fieldset className="rounded-lg border p-4">
            <legend className="px-2 font-semibold">Car details (optional)</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Make"><Input placeholder="Toyota" value={f.vehicle.make ?? ""} onChange={(e) => setV("make", e.target.value)} /></Field>
              <Field label="Model"><Input placeholder="Prado TX" value={f.vehicle.model ?? ""} onChange={(e) => setV("model", e.target.value)} /></Field>
              <Field label="Year"><Input placeholder="2019" value={f.vehicle.year ?? ""} onChange={(e) => setV("year", e.target.value)} /></Field>
              <Field label="Body type"><Pick value={f.vehicle.bodyType} opts={BODIES} onChange={(v) => setV("bodyType", v)} /></Field>
              <Field label="Fuel"><Pick value={f.vehicle.fuel} opts={FUELS} onChange={(v) => setV("fuel", v)} /></Field>
              <Field label="Transmission"><Pick value={f.vehicle.transmission} opts={["Automatic", "Manual"]} onChange={(v) => setV("transmission", v)} /></Field>
              <Field label="Mileage"><Input placeholder="65,000 km" value={f.vehicle.mileage ?? ""} onChange={(e) => setV("mileage", e.target.value)} /></Field>
              <Field label="Price"><Input placeholder="KES 6,500,000" value={f.vehicle.price ?? ""} onChange={(e) => setV("price", e.target.value)} /></Field>
              <div className="sm:col-span-2"><Field label="Link to car on beseki.com"><Input placeholder="https://beseki.com/…" value={f.vehicle.listingUrl ?? ""} onChange={(e) => setV("listingUrl", e.target.value)} /></Field></div>
            </div>
          </fieldset>
        </div>

        <aside className="grid content-start gap-5">
          <div className="grid gap-2 rounded-lg border p-4">
            <Button onClick={() => submit(true)} disabled={busy || !d.canPublish}>{d.canPublish ? "Publish" : "Publish (publishers only)"}</Button>
            <Button variant="outline" onClick={() => submit(false)} disabled={busy}>Save draft</Button>
            {p.data?.status && <p className="text-center text-xs text-muted-foreground">Status: {p.data.status}</p>}
          </div>
          <div className="rounded-lg border p-4">
            <Label className="mb-2 block">Cover photo</Label>
            {f.coverUrl ? <img src={f.coverUrl} alt={f.coverAlt} className="mb-2 aspect-video w-full rounded object-cover" /> :
              <div className="mb-2 flex aspect-video items-center justify-center rounded bg-muted text-muted-foreground"><ImagePlus className="h-8 w-8" /></div>}
            <Input type="file" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              try { setBusy(true); set("coverUrl", await uploadImage(file, "covers")); toast.success("Photo uploaded"); } catch (err) { toast.error((err as Error).message); } finally { setBusy(false); }
            }} />
            <Input className="mt-2" placeholder="Describe the photo" value={f.coverAlt} onChange={(e) => set("coverAlt", e.target.value)} />
          </div>
          <Field label="Section"><Pick value={f.type} opts={SECTIONS.map((s) => s.v)} labels={SECTIONS.map((s) => s.l)} onChange={(v) => set("type", v)} /></Field>
          <Field label="Category"><Pick value={f.categoryId} opts={d.categories.map((c) => c.id)} labels={d.categories.map((c) => c.name)} onChange={(v) => set("categoryId", v)} /></Field>
          <Field label="Author"><Pick value={f.authorId} opts={d.authors.map((a) => a.id)} labels={d.authors.map((a) => a.name)} onChange={(v) => set("authorId", v)} /></Field>
          <Chips label="Vehicle types & brands" items={d.tags} selected={f.tagIds} onToggle={(v) => toggle("tagIds", v)} />
          <Chips label="Topics" items={d.topics} selected={f.topicIds} onToggle={(v) => toggle("topicIds", v)} />
          <label className="flex items-center justify-between rounded-lg border p-4 text-sm">Feature on homepage<Switch checked={f.featured} onCheckedChange={(v) => set("featured", v)} /></label>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="grid gap-1.5"><Label>{label}</Label>{children}</div>;
}
function Pick({ value, opts, labels, onChange }: { value?: string; opts: string[]; labels?: string[]; onChange: (v: string) => void }) {
  return (
    <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">— Choose —</option>
      {opts.map((o, i) => <option key={o} value={o}>{labels?.[i] ?? o}</option>)}
    </select>
  );
}
function Chips({ label, items, selected, onToggle }: { label: string; items: { id: string; name: string }[]; selected: string[]; onToggle: (id: string) => void }) {
  return (
    <div><Label className="mb-2 block">{label}</Label>
      <div className="flex flex-wrap gap-1.5">{items.map((t) => (
        <button key={t.id} type="button" onClick={() => onToggle(t.id)}
          className={`rounded-full border px-2.5 py-1 text-xs ${selected.includes(t.id) ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`}>{t.name}</button>
      ))}</div>
    </div>
  );
}
