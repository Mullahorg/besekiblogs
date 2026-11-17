import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, CarFront, ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { primaryNav, ecosystemNav, SITE } from "@/lib/site";
import { supabase } from "@/integrations/supabase/client";

function SigninState() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") setSignedIn(true);
      if (event === "SIGNED_OUT") setSignedIn(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return signedIn ? (
    <Link
      to="/account"
      className="inline-flex h-10 items-center rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-accent-soft"
    >
      My account
    </Link>
  ) : (
    <Link
      to="/login"
      className="inline-flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Sign in
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 md:px-10">
        <Link to="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
          <span className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <CarFront className="h-5 w-5" strokeWidth={2} aria-hidden />
          </span>
          <span className="flex flex-col leading-none">
            <span className="beseki-display text-xl font-bold uppercase">BESEKI</span>
            <span className="mt-1 text-[10px] font-semibold uppercase text-muted-foreground">The Journal</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent-soft"
              activeProps={{ className: "bg-primary-soft text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
            <Link
              to="/search"
              aria-label="Search the BESEKI Journal"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent-soft"
          >
            <Search className="h-5 w-5" strokeWidth={2} aria-hidden />
          </Link>
          <a
            href="https://beseki.com/inventory"
            className="hidden min-h-10 items-center gap-2 bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex"
          >
            Browse cars <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card lg:hidden"
              >
                <Menu className="h-5 w-5" strokeWidth={2} aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto p-0">
              <div className="border-b border-border p-4">
                <SheetTitle className="beseki-display text-xl font-bold uppercase">
                  BESEKI Journal
                </SheetTitle>
              </div>
              <nav aria-label="Mobile" className="flex flex-col p-3">
                {primaryNav.map((item) => (
                  <button
                    key={item.to}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      navigate({ to: item.to });
                    }}
                    className="rounded-lg px-3 py-3 text-left text-base font-semibold text-foreground hover:bg-accent-soft"
                  >
                    {item.label}
                  </button>
                ))}
                <div className="mt-2 border-t border-border pt-3">
                  <p className="eyebrow px-3 pb-2">Explore BESEKI</p>
                  {ecosystemNav.map((item) => (
                    <a
                      key={item.to}
                      href={item.to}
                      className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent-soft hover:text-primary"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="border-t border-border p-3">
                  <SigninState />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
