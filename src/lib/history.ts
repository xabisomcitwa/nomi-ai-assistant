import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type HistoryEntry = {
  id: string;
  tool: string;
  title: string;
  prompt: string;
  response: string;
  is_favorite: boolean;
  created_at: string;
};

const SELECT = "id, tool, title, prompt, response, is_favorite, created_at";

let listeners: (() => void)[] = [];

export function notifyHistoryChanged() {
  listeners.forEach((fn) => fn());
}

export async function saveHistoryEntry(input: {
  userId: string;
  tool: string;
  title: string;
  prompt: string;
  response: string;
}): Promise<HistoryEntry | null> {
  const { data } = await supabase
    .from("history")
    .insert({
      user_id: input.userId,
      tool: input.tool,
      title: input.title.slice(0, 120) || "Untitled",
      prompt: input.prompt,
      response: input.response,
    })
    .select(SELECT)
    .maybeSingle();
  notifyHistoryChanged();
  return (data as HistoryEntry) ?? null;
}

export async function setFavorite(id: string, value: boolean) {
  await supabase.from("history").update({ is_favorite: value }).eq("id", id);
  notifyHistoryChanged();
}

export async function deleteHistoryEntry(id: string) {
  await supabase.from("history").delete().eq("id", id);
  notifyHistoryChanged();
}

export function useHistory(userId: string | null) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setEntries([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from("history")
      .select(SELECT)
      .order("created_at", { ascending: false })
      .limit(100);
    setEntries((data as HistoryEntry[]) ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    void refresh();
    const listener = () => void refresh();
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, [refresh]);

  return { entries, loading, refresh };
}
