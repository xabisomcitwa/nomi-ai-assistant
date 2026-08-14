import { BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolHeader } from "../tool-header";
import { TEMPLATES, type Template } from "@/lib/templates";

export function TemplatesView({ onUse }: { onUse: (template: Template) => void }) {
  return (
    <div className="space-y-6">
      <ToolHeader
        icon={BookmarkCheck}
        eyebrow="Saved Templates"
        title="Good starting points, ready when you are"
        description="Five gentle prompts for the moments that come around every week. Pick one and Nomi fills in the blanks with you."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TEMPLATES.map((template) => (
          <article
            key={template.id}
            className="glass-panel flex flex-col rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <h3 className="font-semibold">{template.label}</h3>
            <p className="mt-1 flex-1 text-sm leading-relaxed text-muted-foreground">
              {template.description}
            </p>
            <Button
              variant="secondary"
              className="mt-4 rounded-full"
              onClick={() => onUse(template)}
            >
              Use template
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
