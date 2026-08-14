import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Mail, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { composeEmail } from "@/lib/ai.functions";
import { OutputPanel } from "../output-panel";
import { ToolHeader } from "../tool-header";
import { useToolRun } from "../use-tool-run";
import { cn } from "@/lib/utils";
import { useAuth, type Tone } from "@/lib/auth-context";

const TONES: Tone[] = ["Formal", "Friendly", "Persuasive", "Empathetic"];

export function EmailComposer({ seed }: { seed?: string }) {
  const compose = useServerFn(composeEmail);
  const { profile, updateProfile } = useAuth();
  const run = useToolRun("email");
  const [tone, setTone] = useState<Tone>(profile?.preferred_tone ?? "Friendly");
  const [recipient, setRecipient] = useState("");
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState(seed ?? "");

  useEffect(() => {
    if (profile?.preferred_tone) setTone(profile.preferred_tone);
  }, [profile?.preferred_tone]);

  useEffect(() => {
    if (seed) setContext(seed);
  }, [seed]);

  const generate = (nextTone: Tone = tone) => {
    if (!context.trim()) return;
    void run.run(
      () =>
        compose({
          data: {
            tone: nextTone,
            recipient: recipient.trim(),
            goal: goal.trim(),
            context: context.trim(),
            nonce: Date.now(),
          },
        }),
      {
        title: goal.trim() || recipient.trim() || context.trim().slice(0, 60),
        prompt: [
          `Tone: ${nextTone}`,
          recipient.trim() && `To: ${recipient.trim()}`,
          goal.trim() && `Goal: ${goal.trim()}`,
          context.trim(),
        ]
          .filter(Boolean)
          .join("\n"),
      },
    );
  };

  const switchTone = (next: Tone) => {
    setTone(next);
    void updateProfile({ preferred_tone: next });
    if (run.output || context.trim()) generate(next);
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={Mail}
        eyebrow="Smart Email Composer"
        title="Say it well, the first time"
        description="Drop in your key points, choose a tone, and get a draft you can send in one glance. Every draft is a suggestion — edit it until it sounds like you."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="glass-panel space-y-5 rounded-3xl p-5">
          <div className="space-y-2">
            <Label>Tone</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => switchTone(t)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 hover:scale-[1.03]",
                    tone === t
                      ? "border-transparent bg-primary text-primary-foreground shadow-glass"
                      : "border-border/70 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Nomi remembers your last tone.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="Priya, Head of Design"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Desired outcome</Label>
              <Input
                id="goal"
                placeholder="Get sign-off by Friday"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Context or key points</Label>
            <Textarea
              id="context"
              placeholder={"- Project slipped 3 days\n- New timeline attached\n- Need her review of the revised scope"}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[11rem] resize-y"
            />
          </div>

          <Button
            className="w-full gap-2 transition-transform duration-200 hover:scale-[1.01]"
            disabled={!context.trim() || run.isLoading}
            onClick={() => generate()}
          >
            {run.isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            {run.isLoading ? "Thinking with Nomi…" : "Compose draft"}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            nomi never sends anything for you. You stay the author.
          </p>
        </div>

        <OutputPanel
          title="Draft"
          value={run.output}
          onChange={run.setOutput}
          onRegenerate={run.regenerate}
          isLoading={run.isLoading}
          error={run.error}
          onRetry={run.regenerate}
          isFavorite={run.isFavorite}
          onToggleFavorite={run.toggleFavorite}
          canFavorite={Boolean(run.entryId)}
          emptyHint="Add your key points and pick a tone — your draft will appear here, fully editable."
        />
      </div>
    </div>
  );
}
