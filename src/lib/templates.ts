export type ToolKey = "email" | "meeting" | "planner" | "insight" | "pulse";

export type Template = {
  id: string;
  label: string;
  description: string;
  tool: ToolKey;
  seed: string;
};

export const TEMPLATES: Template[] = [
  {
    id: "monday-email",
    label: "Professional Monday Email",
    description: "A warm week-opener with priorities and one clear ask.",
    tool: "email",
    seed: [
      "- Kicking off the week and sharing my top 3 priorities",
      "- Flag one blocker I need help unblocking",
      "- Ask for a quick 15 min sync before Wednesday",
    ].join("\n"),
  },
  {
    id: "meeting-summary",
    label: "Meeting Notes Summary",
    description: "Turn rough notes into decisions, owners and next steps.",
    tool: "meeting",
    seed: [
      "Attendees: ",
      "Discussion points:",
      "- ",
      "Decisions:",
      "- ",
      "Follow-ups:",
      "- ",
    ].join("\n"),
  },
  {
    id: "gentle-follow-up",
    label: "Gentle Follow-up Nudge",
    description: "Chase a reply without any pressure or awkwardness.",
    tool: "email",
    seed: [
      "- Following up on my note from last week",
      "- No rush, just want to keep things moving",
      "- Happy to simplify the ask if that helps",
    ].join("\n"),
  },
  {
    id: "focused-day",
    label: "Focused Day Plan",
    description: "Shape a calm day around deep work and real energy.",
    tool: "planner",
    seed: [
      "- Deep work on the quarterly plan (high impact, 2h)",
      "- Review 3 pull requests (medium)",
      "- 1:1 with teammate (30m)",
      "- Inbox and admin (low)",
    ].join("\n"),
  },
  {
    id: "competitor-scan",
    label: "Competitor Insight Scan",
    description: "Get a synthesis, the non-obvious angles and the risks.",
    tool: "insight",
    seed: "What has changed in our market over the last quarter, and what should we do differently? Focus on positioning, pricing and onboarding.",
  },
];
