import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, NotebookPen, Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeMeeting } from "@/lib/ai.functions";
import { OutputPanel } from "../output-panel";
import { ToolHeader } from "../tool-header";
import { useToolRun } from "../use-tool-run";

export function MeetingAlchemy({ seed }: { seed?: string | undefined }) {
  const summarize = useServerFn(summarizeMeeting);
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
  } = useToolRun("meeting");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState(seed ?? "");

  useEffect(() => {
    if (seed) setNotes(seed);
  }, [seed]);

  const generate = () => {
    if (!notes.trim()) return;
    void run(
      () =>
        summarize({
          data: { title: title.trim(), notes: notes.trim(), nonce: Date.now() },
        }),
      {
        title: title.trim() || notes.trim().slice(0, 60),
        prompt: title.trim() ? `${title.trim()}\n${notes.trim()}` : notes.trim(),
      },
    );
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={NotebookPen}
        eyebrow="Meeting Alchemy"
        title="Turn messy notes into calm clarity"
        description="Paste a transcript or your scribbles. You'll get an executive summary, the decisions, action items with owners and deadlines, and the questions still hanging."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="glass-panel space-y-5 rounded-3xl p-5">
          <div className="space-y-2">
            <Label htmlFor="meeting-title">Meeting</Label>
            <Input
              id="meeting-title"
              placeholder="Q3 roadmap review"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes or transcript</Label>
            <Textarea
              id="notes"
              placeholder="Paste everything — rough is fine."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[20rem] resize-y"
            />
          </div>
          <Button
            className="w-full gap-2 transition-transform duration-200 hover:scale-[1.01]"
            disabled={!notes.trim() || isLoading}
            onClick={generate}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Sparkle className="size-4" />
            )}
            {isLoading ? "Thinking with Nomi…" : "Distil the meeting"}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Owners and deadlines are extracted, never invented — confirm them with your
            team.
          </p>
        </div>

        <OutputPanel
          title="Structured recap"
          value={output}
          onChange={setOutput}
          onRegenerate={regenerate}
          isLoading={isLoading}
          error={error}
          onRetry={regenerate}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          canFavorite={Boolean(entryId)}
          emptyHint="Paste your meeting notes to see decisions, owners, deadlines and open questions laid out clearly."
        />
      </div>
    </div>
  );
}
