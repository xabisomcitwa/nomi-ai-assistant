import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Radar, Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { runInsight } from "@/lib/ai.functions";
import { OutputPanel } from "../output-panel";
import { ToolHeader } from "../tool-header";
import { useToolRun } from "../use-tool-run";

export function InsightEngine({ seed }: { seed?: string }) {
  const insight = useServerFn(runInsight);
  const {
    output,
    setOutput,
    isLoading,
    error,
    run,
    regenerate,
    entryId,
    isFavorite,
    toggleFavorite,
  } = useToolRun("insight");
  const [lens, setLens] = useState("");
  const [material, setMaterial] = useState(seed ?? "");

  useEffect(() => {
    if (seed) setMaterial(seed);
  }, [seed]);

  const generate = () => {
    if (!material.trim()) return;
    void run(
      () =>
        insight({
          data: { lens: lens.trim(), material: material.trim(), nonce: Date.now() },
        }),
      {
        title: material.trim().slice(0, 60),
        prompt: lens.trim() ? `Lens: ${lens.trim()}\n${material.trim()}` : material.trim(),
      },
    );
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={Radar}
        eyebrow="Insight Engine"
        title="Read less, understand more"
        description="Paste an article, a topic or a research question. You'll get a synthesis, the non-obvious insights, strategic moves to consider, and the risks worth watching."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="glass-panel space-y-5 rounded-3xl p-5">
          <div className="space-y-2">
            <Label htmlFor="lens">Analysis lens</Label>
            <Input
              id="lens"
              placeholder="As a product lead entering the EU market"
              value={lens}
              onChange={(e) => setLens(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">Article, topic or question</Label>
            <Textarea
              id="material"
              placeholder="Paste the text, or ask something like: How is AI changing B2B onboarding?"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="min-h-[18rem] resize-y"
            />
          </div>
          <Button
            className="w-full gap-2 transition-transform duration-200 hover:scale-[1.01]"
            disabled={!material.trim() || isLoading}
            onClick={generate}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Telescope className="size-4" />
            )}
            {isLoading ? "Thinking with Nomi…" : "Run analysis"}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Insight Engine reasons over what you provide. Verify anything load-bearing
            against a primary source.
          </p>
        </div>

        <OutputPanel
          title="Analysis"
          value={output}
          onChange={setOutput}
          onRegenerate={regenerate}
          isLoading={isLoading}
          error={error}
          onRetry={regenerate}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          canFavorite={Boolean(entryId)}
          emptyHint="Paste material or ask a question to see a summary, key insights, recommendations, and risks."
        />
      </div>
    </div>
  );
}
