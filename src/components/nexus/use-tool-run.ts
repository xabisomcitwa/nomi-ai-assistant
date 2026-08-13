import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

export function useToolRun() {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const lastRun = useRef<(() => Promise<string>) | null>(null);

  const run = useCallback(async (fn: () => Promise<string>) => {
    lastRun.current = fn;
    setIsLoading(true);
    try {
      const text = await fn();
      setOutput(text.trim());
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(
        message.includes("402")
          ? "AI credits are exhausted for this workspace."
          : message.includes("429")
            ? "Pulse is at its rate limit — try again in a moment."
            : "That request didn't complete. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const regenerate = useCallback(() => {
    if (!lastRun.current) {
      toast.info("Add your details first, then generate a suggestion.");
      return;
    }
    void run(lastRun.current);
  }, [run]);

  return { output, setOutput, isLoading, run, regenerate };
}
