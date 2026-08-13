import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { composeEmail } from "@/lib/ai.functions";
import { OutputPanel } from "../output-panel";
import { ToolHeader } from "../tool-header";
import { useToolRun } from "../use-tool-run";
import { cn } from "@/lib/utils";

const TONES = ["Formal", "Friendly", "Persuasive", "Empathetic"] as const;
type Tone = (typeof TONES)[number];

export function EmailComposer() {
  const compose = useServerFn(composeEmail);
  const { output, setOutput, isLoading, run, regenerate } = useToolRun();
  const [tone, setTone] = useState<Tone>("Friendly");
  const [recipient, setRecipient] = useState("");
  const [goal, setGoal] = useState("");
  const [context, setContext] = useState("");

  const generate = (nextTone: Tone = tone) => {
    if (!context.trim()) return;
    void run(() =>
      compose({
        data: {
          tone: nextTone,
          recipient: recipient.trim(),
          goal: goal.trim(),
          context: context.trim(),
          nonce: Date.now(),
        },
      }),
    );
  };

  const switchTone = (next: Tone) => {
    setTone(next);
    if (output || context.trim()) generate(next);
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
                    "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200",
                    tone === t
                      ? "border-transparent bg-primary text-primary-foreground shadow-glass"
                      : "border-border/70 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
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
            className="w-full gap-2"
            disabled={!context.trim() || isLoading}
            onClick={() => generate()}
          >
            <Wand2 className="size-4" />
            {isLoading ? "Composing…" : "Compose draft"}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            nomi never sends anything for you. You stay the author.
          </p>
        </div>

        <OutputPanel
          title="Draft"
          value={output}
          onChange={setOutput}
          onRegenerate={regenerate}
          isLoading={isLoading}
          emptyHint="Add your key points and pick a tone — your draft will appear here, fully editable."
        />
      </div>
    </div>
  );
}
