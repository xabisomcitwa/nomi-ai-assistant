import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { saveHistoryEntry, setFavorite } from "@/lib/history";

type RunMeta = { title: string; prompt: string };

export function useToolRun(tool: string) {
  const { user } = useAuth();
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [entryId, setEntryId] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const lastRun = useRef<{ fn: () => Promise<string>; meta: RunMeta } | null>(null);

  const run = useCallback(
    async (fn: () => Promise<string>, meta: RunMeta) => {
      lastRun.current = { fn, meta };
      setIsLoading(true);
      setError(null);
      try {
        const text = (await fn()).trim();
        setOutput(text);
        setEntryId(null);
        setIsFavorite(false);
        if (user) {
          const entry = await saveHistoryEntry({
            userId: user.id,
            tool,
            title: meta.title,
            prompt: meta.prompt,
            response: text,
          });
          if (entry) setEntryId(entry.id);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "";
        setError(
          message.includes("402")
            ? "Nomi is out of AI credits for this workspace right now."
            : message.includes("429")
              ? "Nomi is thinking a little too fast — give it a moment and try again."
              : "Nomi couldn't finish that one. It happens sometimes — let's try again.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [tool, user],
  );

  const regenerate = useCallback(() => {
    if (!lastRun.current) return;
    void run(lastRun.current.fn, lastRun.current.meta);
  }, [run]);

  const toggleFavorite = useCallback(() => {
    if (!entryId) return;
    const next = !isFavorite;
    setIsFavorite(next);
    void setFavorite(entryId, next);
  }, [entryId, isFavorite]);

  const loadEntry = useCallback((entry: { id: string; response: string; is_favorite: boolean }) => {
    setOutput(entry.response);
    setEntryId(entry.id);
    setIsFavorite(entry.is_favorite);
    setError(null);
  }, []);

  return {
    output,
    setOutput,
    isLoading,
    error,
    run,
    regenerate,
    entryId,
    isFavorite,
    toggleFavorite,
    loadEntry,
    canRetry: Boolean(lastRun.current),
  };
}
