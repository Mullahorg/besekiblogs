import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Your account | BESEKI Journal" },
      { name: "description", content: "Manage your BESEKI Journal account and sign out." },
      { property: "og:title", content: "Your account | BESEKI Journal" },
      { property: "og:description", content: "Manage your BESEKI Journal account and sign out." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [profile, setProfile] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data }) => {
      if (cancelled) return;
      if (data.user) {
        const meta = (data.user.user_metadata ?? {}) as Record<string, unknown>;
        const displayName = meta["display_name"];
        const name =
          typeof displayName === "string" && displayName.trim() ? displayName : data.user.email ?? "";
        setProfile({ email: data.user.email ?? "", name });
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Your account</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Manage your reading list settings and sign out of this device.
      </p>
      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
        <div>
          <p className="text-sm font-semibold">Signed in as</p>
          <p className="mt-1 break-all text-sm text-muted-foreground">
            {profile ? profile.email : "Loading…"}
          </p>
        </div>
        <button
          type="button"
          disabled={busy}
          className="h-12 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          onClick={async () => {
            setBusy(true);
            const { error } = await supabase.auth.signOut();
            setBusy(false);
            if (error) {
              toast.error(error.message);
              return;
            }
            toast.success("Signed out");
            navigate({ to: "/login", replace: true });
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
