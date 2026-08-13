import type { LucideIcon } from "lucide-react";

export function ToolHeader({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="flex items-start gap-4">
      <span className="glass-panel grid size-11 shrink-0 place-items-center rounded-xl text-primary">
        <Icon className="size-5" />
      </span>
      <div className="space-y-1">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </header>
  );
}
