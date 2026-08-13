import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { ArrowUp, MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ToolHeader } from "../tool-header";
import pulseMark from "@/assets/nomi-mark.png";

const STARTERS = [
  "Help me say no to this meeting, kindly.",
  "How do I open a hard conversation with my manager?",
  "Sharpen this prompt for the Insight Engine.",
  "I have too much on today — where do I start?",
];

export function Pulse() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: () => toast.error("Pulse couldn't reply just now. Please try again."),
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isBusy) return;
    setInput("");
    void sendMessage({ text: trimmed });
  };

  return (
    <div className="space-y-6">
      <ToolHeader
        icon={MessageCircleHeart}
        eyebrow="Pulse"
        title="A thoughtful colleague, always nearby"
        description="Think out loud with Pulse. It can untangle a workplace situation, sharpen a prompt, or point you to the right nomi tool."
      />

      <div className="glass-panel flex h-[clamp(28rem,64vh,44rem)] flex-col rounded-3xl">
        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <img
                src={pulseMark}
                alt="Pulse companion mark"
                className="size-16 opacity-90"
              />
              <div className="space-y-1">
                <p className="font-medium">What's on your mind?</p>
                <p className="text-sm text-muted-foreground">
                  Pulse listens first, then helps.
                </p>
              </div>
              <div className="flex max-w-xl flex-wrap justify-center gap-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-border/70 bg-background/60 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const text = message.parts
                .map((part) => (part.type === "text" ? part.text : ""))
                .join("");
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className={isUser ? "flex justify-end" : "flex justify-start"}
                >
                  {isUser ? (
                    <div className="max-w-[85%] rounded-3xl rounded-br-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground shadow-glass">
                      {text}
                    </div>
                  ) : (
                    <div className="flex max-w-[92%] gap-3">
                      <img
                        src={pulseMark}
                        alt=""
                        className="mt-0.5 size-7 shrink-0 rounded-lg"
                      />
                      <div className="nexus-prose">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {status === "submitted" && (
            <div className="flex items-center gap-2 pl-10 text-sm text-muted-foreground">
              <span className="flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.2s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary/70 [animation-delay:-0.1s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary/70" />
              </span>
              Pulse is thinking
            </div>
          )}
        </div>

        <div className="border-t border-border/60 p-4">
          <div className="flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask Pulse anything about your work…"
              className="max-h-40 min-h-[3rem] resize-none border-border/60 bg-background/60"
            />
            <Button
              size="icon"
              className="size-11 shrink-0"
              disabled={!input.trim() || isBusy}
              onClick={() => send(input)}
              aria-label="Send message"
            >
              <ArrowUp className="size-4" />
            </Button>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Pulse offers suggestions, not decisions — it can be wrong or incomplete. Don't
            share confidential data you wouldn't put in a shared doc.
          </p>
        </div>
      </div>
    </div>
  );
}
