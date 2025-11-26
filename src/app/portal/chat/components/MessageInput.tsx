"use client";
import { useState } from "react";

type Props = { placeholder?: string; onSend: (text: string) => void };

export default function MessageInput({ placeholder, onSend }: Props) {
  const [draft, setDraft] = useState("");
  function send() {
    const t = draft.trim();
    if (!t) return;
    onSend(t);
    setDraft("");
  }
  return (
    <div>
      <div className="d-flex gap-2">
        <input className="form-control" placeholder={placeholder || "Type a message"} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
        <button className="btn btn-primary" onClick={send}>Send</button>
      </div>
      <div className="d-flex gap-2 mt-2">
        <button className="btn btn-outline-secondary btn-sm">Attach</button>
        <button className="btn btn-outline-secondary btn-sm">Schedule</button>
      </div>
    </div>
  );
}
