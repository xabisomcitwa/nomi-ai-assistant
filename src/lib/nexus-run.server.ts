import { streamText } from "ai";
import {
  createLovableAiGatewayProvider,
  NEXUS_MODEL,
  requireGatewayKey,
} from "./ai-gateway.server";

export async function runNexusPrompt(system: string, prompt: string): Promise<string> {
  const gateway = createLovableAiGatewayProvider(requireGatewayKey());
  const result = streamText({
    model: gateway(NEXUS_MODEL),
    system,
    prompt,
    temperature: 0.7,
  });
  return await result.text;
}
