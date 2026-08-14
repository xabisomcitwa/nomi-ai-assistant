import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarClock, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planFlow } from "@/lib/ai.functions";
import { OutputPanel } from "../output-panel";
import { ToolHeader } from "../tool-header";
import { useToolRun } from "../use-tool-run";
import { cn } from "@/lib/utils";

const HORIZONS = ["Day", "Week"] as const;
const ENERGY = ["Morning peak", "Afternoon peak", "Evening peak", "Steady"] as const;

type Horizon = (typeof HORIZONS)[number];
type Energy = (typeof ENERGY)[number];

function Pills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200",
            value === option
              ? "border-transparent bg-primary text-primary-foreground shadow-glass"
              : "border-border/70 bg-background/50 text-muted-foreground hover:border-primary/40 hover:text-foreground",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export function FlowPlanner({ seed }: { seed?: string }) {
  const plan = useServerFn(planFlow);
  const { output, setOutput, isLoading, error, run, regenerate, entryId, isFavorite, toggleFavorite } =
    useToolRun("planner");
  const [horizon, setHorizon] = useState<Horizon>("Day");
  const [energy, setEnergy] = useState<Energy>("Morning peak");
  const [hours, setHours] = useState("09:00 – 17:30");
  const [tasks, setTasks] = useState(seed ?? "");

  useEffect(() => {
    if (seed) setTasks(seed);
  }, [seed]);

  const generate = () => {
    if (!tasks.trim()) return;
    void run(
      () =>
        plan({
          data: {
            horizon,
            energy,
            hours: hours.trim(),
            tasks: tasks.trim(),
            nonce: Date.now(),
          },
        }),
      {
        title: `${horizon} plan — ${tasks.trim().split("\n")[0]?.replace(/^[-*]\s*/, "") ?? ""}`,
        prompt: `Horizon: ${horizon}\nEnergy: ${energy}\nHours: ${hours}\n${tasks.trim()}`,
      },
    );
  };


  return (
    <div className="space-y-6">
      <ToolHeader
        icon={CalendarClock}
        eyebrow="Flow Planner"
        title="A schedule that respects your energy"
        description="List what's on your plate with rough priorities. Flow Planner weighs impact, urgency and energy fit, then proposes humane time blocks around your real day."
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
        <div className="glass-panel space-y-5 rounded-3xl p-5">
          <div className="space-y-2">
            <Label>Plan for</Label>
            <Pills options={HORIZONS} value={horizon} onChange={setHorizon} />
          </div>
          <div className="space-y-2">
            <Label>Energy pattern</Label>
            <Pills options={ENERGY} value={energy} onChange={setEnergy} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Working hours</Label>
            <Input
              id="hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="09:00 – 17:30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks, priorities, deadlines</Label>
            <Textarea
              id="tasks"
              placeholder={"- Finish investor memo (high impact, due Thu)\n- 1:1 with Sam (30m)\n- Review 4 design specs (medium)\n- Inbox triage (low)"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              className="min-h-[13rem] resize-y"
            />
          </div>
          <Button
            className="w-full gap-2"
            disabled={!tasks.trim() || isLoading}
            onClick={generate}
          >
            <Compass className="size-4" />
            {isLoading ? "Shaping your day…" : `Build my ${horizon.toLowerCase()}`}
          </Button>
          <p className="text-xs leading-relaxed text-muted-foreground">
            A proposed rhythm, not a rulebook. Move blocks around freely.
          </p>
        </div>

        <OutputPanel
          title={`${horizon} plan`}
          value={output}
          onChange={setOutput}
          onRegenerate={regenerate}
          isLoading={isLoading}
          emptyHint="Add your tasks to see time blocks, a priority order, and what to defer or delegate."
        />
      </div>
    </div>
  );
}
