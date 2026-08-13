import { createFileRoute } from "@tanstack/react-router";
import { NexusDashboard } from "@/components/nexus/dashboard";

const title = "Nexus Flow — Your calm AI workplace co-pilot";
const description =
  "One calm dashboard with AI email drafting, meeting recaps, energy-aware planning, research insights and Pulse, your workplace AI companion.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NexusDashboard,
});
