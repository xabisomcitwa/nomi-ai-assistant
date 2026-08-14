import { useState } from "react";
import { Heart, History, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { ToolHeader } from "../tool-header";
import { useAuth } from "@/lib/auth-context";
import { deleteHistoryEntry, setFavorite, useHistory } from "@/lib/history";
import { cn } from "@/lib/utils";

const TOOL_LABEL: Record<string, string> = {
  email: "Email Composer",
  meeting: "Meeting Alchemy",
  planner: "Flow Planner",
  insight: "Insight Engine",
  pulse: "Pulse",
};

export function RecentView({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const { user } = useAuth();
  const { entries, loading } = useHistory(user?.id ?? null);
  const [openId, setOpenId] = useState<string | null>(null);

  const list = favoritesOnly ? entries.filter((e) => e.is_favorite) : entries;

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={favoritesOnly ? Heart : History}
        eyebrow={favoritesOnly ? "Favourites" : "Recent"}
        title={favoritesOnly ? "The ones worth keeping" : "Everything you've made together"}
        description={
          favoritesOnly
            ? "Your starred outputs, saved quietly in one place."
            : "Every prompt and response is saved to your private history — only you can see it."
        }
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading your history…</p>
      ) : list.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 text-center">
          <p className="text-sm text-muted-foreground">
            {favoritesOnly
              ? "Nothing favourited yet — tap the heart on any output."
              : "Nothing here yet. Generate something and it'll appear automatically."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((entry) => {
            const open = openId === entry.id;
            return (
              <article
                key={entry.id}
                className="glass-panel rounded-3xl p-5 transition-all duration-300 hover:shadow-lift"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : entry.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {TOOL_LABEL[entry.tool] ?? entry.tool} ·{" "}
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                    <h3 className="mt-1 truncate font-semibold">{entry.title}</h3>
                    {!open && (
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {entry.response}
                      </p>
                    )}
                  </button>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Favourite"
                      onClick={() => void setFavorite(entry.id, !entry.is_favorite)}
                    >
                      <Heart
                        className={cn(
                          "size-4",
                          entry.is_favorite && "fill-primary text-primary",
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Delete"
                      onClick={() => void deleteHistoryEntry(entry.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {open && (
                  <div className="mt-4 space-y-4 border-t border-border/60 pt-4 animate-in fade-in duration-300">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground">Prompt</p>
                      <pre className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                        {entry.prompt}
                      </pre>
                    </div>
                    <div className="nexus-prose">
                      <ReactMarkdown>{entry.response}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
