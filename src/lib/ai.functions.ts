import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runNexusPrompt } from "./nexus-run.server";
import {
  EMAIL_SYSTEM,
  INSIGHT_SYSTEM,
  MEETING_SYSTEM,
  PLANNER_SYSTEM,
} from "./nexus-prompts";

export const composeEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tone: z.enum(["Formal", "Friendly", "Persuasive", "Empathetic"]),
        recipient: z.string().max(200).optional(),
        goal: z.string().max(400).optional(),
        context: z.string().min(1).max(8000),
        nonce: z.number().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) =>
    runNexusPrompt(
      EMAIL_SYSTEM,
      [
        `Tone: ${data.tone}`,
        data.recipient ? `Recipient: ${data.recipient}` : "",
        data.goal ? `Desired outcome: ${data.goal}` : "",
        `Key points / context:\n${data.context}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        notes: z.string().min(1).max(30000),
        title: z.string().max(200).optional(),
        nonce: z.number().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) =>
    runNexusPrompt(
      MEETING_SYSTEM,
      [data.title ? `Meeting: ${data.title}` : "", `Notes / transcript:\n${data.notes}`]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

export const planFlow = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        tasks: z.string().min(1).max(8000),
        horizon: z.enum(["Day", "Week"]),
        energy: z.enum(["Morning peak", "Afternoon peak", "Evening peak", "Steady"]),
        hours: z.string().max(120).optional(),
        nonce: z.number().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) =>
    runNexusPrompt(
      PLANNER_SYSTEM,
      [
        `Horizon: ${data.horizon}`,
        `Energy pattern: ${data.energy}`,
        data.hours ? `Working hours: ${data.hours}` : "",
        `Tasks with priorities:\n${data.tasks}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

export const runInsight = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        material: z.string().min(1).max(30000),
        lens: z.string().max(300).optional(),
        nonce: z.number().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) =>
    runNexusPrompt(
      INSIGHT_SYSTEM,
      [
        data.lens ? `Analysis lens: ${data.lens}` : "",
        `Material / question:\n${data.material}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );
