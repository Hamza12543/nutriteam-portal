"use client";
import { useEffect, useRef } from "react";

type Message = { id: string; fromId: string; toId: string; body: string; createdAt: string };

type Props = { messages: Message[]; selfId: string };

export default function ChatThread({ messages, selfId }: Props) {
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages.length]);
  return (
    <div style={{ height: 520, overflowY: "auto", background: "#f8fafc" }} className="p-2">
      {messages.map((m) => {
        const mine = m.fromId === selfId;
        return (
          <div key={m.id} className={`d-flex mb-2 ${mine ? "justify-content-end" : "justify-content-start"}`}>
            <div className={`p-2 rounded-3 ${mine ? "bg-light" : "bg-primary text-white"}`} style={{ maxWidth: 520 }}>
              <div>{m.body}</div>
            </div>
          </div>
        );
      })}
      <div ref={endRef} />
    </div>
  );
}
