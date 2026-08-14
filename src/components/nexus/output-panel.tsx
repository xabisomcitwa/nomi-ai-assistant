import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Check,
  Copy,
  Heart,
  Loader2,
  Pencil,
  RefreshCw,
  Eye,
  CloudOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type OutputPanelProps = {
  title: string;
  value: string;
  onChange: (next: string) => void;
  onRegenerate: () => void;
  isLoading: boolean;
  emptyHint: string;
  className?: string;
  error?: string | null;
  onRetry?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  canFavorite?: boolean;
};

export function OutputPanel({
  title,
  value,
  onChange,
  onRegenerate,
  isLoading,
  emptyHint,
  className,
  error,
  onRetry,
  isFavorite = false,
  onToggleFavorite,
  canFavorite = false,
}: OutputPanelProps) {
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      toast.error("Couldn't copy — please select the text manually.");
    }
  };

  return (
    <section className={cn("glass-panel flex flex-col rounded-3xl", className)}>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          {isLoading && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" />
              Thinking with Nomi…
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          {canFavorite && (
            <Button
              variant="ghost"
              size="sm"
              disabled={!value}
              onClick={onToggleFavorite}
              className="gap-1.5"
              aria-pressed={isFavorite}
              aria-label={isFavorite ? "Remove from favourites" : "Save to favourites"}
            >
              <Heart
                className={cn(
                  "size-3.5 transition-transform duration-200",
                  isFavorite && "scale-110 fill-primary text-primary",
                )}
              />
              {isFavorite ? "Saved" : "Favourite"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={!value}
            onClick={() => setEditing((e) => !e)}
            className="gap-1.5"
          >
            {editing ? <Eye className="size-3.5" /> : <Pencil className="size-3.5" />}
            {editing ? "Preview" : "Edit"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!value}
            onClick={copy}
            className="gap-1.5"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            Copy
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={isLoading}
            onClick={onRegenerate}
            className="gap-1.5"
          >
            <RefreshCw className={cn("size-3.5", isLoading && "animate-spin")} />
            Regenerate
          </Button>
        </div>
      </header>

      <div className="min-h-[18rem] flex-1 p-5">
        {error ? (
          <div className="flex h-full min-h-[16rem] animate-in fade-in flex-col items-center justify-center gap-3 text-center duration-300">
            <span className="grid size-14 place-items-center rounded-3xl bg-primary/10 text-primary">
              <CloudOff className="size-6" />
            </span>
            <h4 className="text-lg font-semibold">That didn't go through</h4>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              {error}
            </p>
            {onRetry && (
              <Button onClick={onRetry} className="mt-1 gap-2 rounded-full px-6">
                <RefreshCw className="size-4" />
                Try again
              </Button>
            )}
          </div>
        ) : isLoading && !value ? (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="size-7 animate-spin text-primary" />
            <p className="text-sm font-medium">Thinking with Nomi…</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Taking a calm moment to get this right for you.
            </p>
          </div>
        ) : value ? (
          editing ? (
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[26rem] resize-y border-border/60 bg-background/60 font-mono text-[13px] leading-relaxed"
            />
          ) : (
            <div className="nexus-prose animate-in fade-in duration-300">
              <ReactMarkdown>{value}</ReactMarkdown>
            </div>
          )
        ) : (
          <div className="flex h-full min-h-[16rem] flex-col items-center justify-center gap-2 text-center">
            <p className="max-w-sm text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}
      </div>

      <p className="border-t border-border/60 px-5 py-3 text-xs leading-relaxed text-muted-foreground">
        AI-generated suggestion — not a verified answer. Review, edit and take ownership
        before you send or act on it.
      </p>
    </section>
  );
}
