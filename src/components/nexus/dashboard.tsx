import { useState } from "react";
import {
  CalendarClock,
  ChevronsLeft,
  LayoutDashboard,
  Mail,
  Menu,
  MessageCircleHeart,
  NotebookPen,
  Radar,
  ShieldCheck,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import nexusMark from "@/assets/nexus-mark.png";
import { EmailComposer } from "./tools/email-composer";
import { MeetingAlchemy } from "./tools/meeting-alchemy";
import { FlowPlanner } from "./tools/flow-planner";
import { InsightEngine } from "./tools/insight-engine";
import { Pulse } from "./tools/pulse";

type ToolId = "overview" | "email" | "meeting" | "planner" | "insight" | "pulse";

const NAV: { id: ToolId; label: string; hint: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Today", hint: "Your calm starting point", icon: LayoutDashboard },
  { id: "email", label: "Email Composer", hint: "Say it well, first time", icon: Mail },
  { id: "meeting", label: "Meeting Alchemy", hint: "Notes into clarity", icon: NotebookPen },
  { id: "planner", label: "Flow Planner", hint: "Energy-aware schedule", icon: CalendarClock },
  { id: "insight", label: "Insight Engine", hint: "Read less, know more", icon: Radar },
  { id: "pulse", label: "Pulse", hint: "Your AI colleague", icon: MessageCircleHeart },
];

function Overview({ onOpen }: { onOpen: (id: ToolId) => void }) {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Nexus Flow
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          One calm dashboard.{" "}
          <span className="text-gradient">Multiple AI superpowers.</span> Zero friction.
        </h1>
        <p className="max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
          Everything you need to move through the day with intention — drafting, distilling,
          planning, researching and thinking out loud. Pick a space to begin.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {NAV.filter((item) => item.id !== "overview").map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onOpen(item.id)}
            className="glass-panel group rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <item.icon className="size-5" />
            </span>
            <h2 className="mt-4 font-semibold">{item.label}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.hint}</p>
          </button>
        ))}
      </div>

      <div className="glass-panel flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-teal" />
          <div>
            <p className="text-sm font-medium">Human in the loop, always</p>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Nexus Flow drafts and suggests; you decide. Nothing is sent, scheduled or
              shared without you.
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => onOpen("pulse")} className="sm:shrink-0">
          Talk to Pulse
        </Button>
      </div>
    </div>
  );
}

export function NexusDashboard() {
  const [active, setActive] = useState<ToolId>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const open = (id: ToolId) => {
    setActive(id);
    setMobileOpen(false);
  };

  const activeItem = NAV.find((item) => item.id === active) ?? NAV[0];

  const railContent = (
    <>
      <div
        className={cn(
          "flex items-center gap-2.5 px-3 py-4",
          collapsed && "lg:justify-center lg:px-0",
        )}
      >
        <img src={nexusMark} alt="Nexus Flow" className="size-8" width={32} height={32} />
        {!collapsed && (
          <span className="text-[0.95rem] font-semibold tracking-tight">Nexus Flow</span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-2">
        {NAV.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => open(item.id)}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
                collapsed && "lg:justify-center lg:px-0",
                isActive
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-glass"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <item.icon
                className={cn("size-[1.15rem] shrink-0", isActive && "text-primary")}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="px-2 pb-4">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground lg:flex"
        >
          <ChevronsLeft
            className={cn("size-[1.15rem] transition-transform", collapsed && "rotate-180")}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="nexus-aurora min-h-screen">
      <div className="flex min-h-screen">
        {/* Desktop rail */}
        <aside
          className={cn(
            "glass-rail sticky top-0 hidden h-screen shrink-0 flex-col transition-[width] duration-300 lg:flex",
            collapsed ? "w-[4.5rem]" : "w-64",
          )}
        >
          {railContent}
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="glass-rail absolute inset-y-0 left-0 flex w-72 flex-col animate-in slide-in-from-left duration-300">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 text-muted-foreground"
                aria-label="Close navigation"
              >
                <X className="size-5" />
              </button>
              {railContent}
            </aside>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass-panel sticky top-0 z-30 flex items-center justify-between gap-3 rounded-none border-x-0 border-t-0 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="text-muted-foreground lg:hidden"
                aria-label="Open navigation"
              >
                <Menu className="size-5" />
              </button>
              <img
                src={nexusMark}
                alt=""
                className="size-7 lg:hidden"
                width={28}
                height={28}
              />
              <span className="truncate text-sm font-medium text-muted-foreground">
                {activeItem.label}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-2 rounded-full border border-border/60 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-teal opacity-70" />
                  <span className="relative inline-flex size-2 rounded-full bg-teal" />
                </span>
                AI is assisting
              </span>
              <div
                className="grid size-9 place-items-center rounded-full bg-primary/12 text-sm font-medium text-primary"
                aria-label="Your profile"
              >
                XN
              </div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {active === "overview" && <Overview onOpen={open} />}
            {active === "email" && <EmailComposer />}
            {active === "meeting" && <MeetingAlchemy />}
            {active === "planner" && <FlowPlanner />}
            {active === "insight" && <InsightEngine />}
            {active === "pulse" && <Pulse />}
          </main>

          <footer className="border-t border-border/60 px-4 py-6 sm:px-6 lg:px-8">
            <p className="mx-auto max-w-4xl text-center text-xs leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">Responsible AI.</span> Nexus
              Flow produces suggestions generated by AI models. Outputs can be incomplete,
              outdated or wrong, and are never a substitute for your judgement or
              professional, legal, financial or HR advice. Always review before sending,
              sharing or acting — and avoid entering confidential or personal data you
              wouldn't put in a shared document.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
