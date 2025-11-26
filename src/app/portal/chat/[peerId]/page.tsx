"use client";
import Link from "next/link";
import { useMemo, useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/app/providers/LanguageProvider";

type Message = {
  id: string;
  fromId: string;
  toId: string;
  body: string;
  createdAt: string;
};

const now = new Date();
function minus(mins: number) { return new Date(now.getTime() - mins * 60000).toISOString(); }

const mockUserId = "me_123";

const mockMessages: Message[] = [
  { id: "m1", fromId: "pro_anna", toId: mockUserId, body: "Hello! How are you feeling today?", createdAt: minus(120) },
  { id: "m2", fromId: "pro_anna", toId: mockUserId, body: "Any chest discomfort?", createdAt: minus(119) },
  { id: "m3", fromId: mockUserId, toId: "pro_anna", body: "Feeling better, minor discomfort.", createdAt: minus(110) },
  { id: "m4", fromId: "pro_anna", toId: mockUserId, body: "Great. Please continue medication.", createdAt: minus(100) },
  { id: "m5", fromId: mockUserId, toId: "pro_anna", body: "Noted. Can we schedule a follow-up on Friday 2pm?", createdAt: minus(95) },
  { id: "m6", fromId: "pro_anna", toId: mockUserId, body: "Friday 2pm works.", createdAt: minus(60) },
  { id: "m7", fromId: mockUserId, toId: "pro_anna", body: "Thanks!", createdAt: minus(58) },
];

export default function ChatThreadPage() {
  const pathname = usePathname();
  const peerId = pathname.split("/").pop() || "";
  const { lang } = useLanguage();
  const copy: Record<string, { back: string; send: string; attach: string; schedule: string; placeholder: (name: string) => string }>= {
    en: { back: "Back", send: "Send", attach: "Attach", schedule: "Schedule", placeholder: (n) => `Message ${n}…` },
    de: { back: "Zurück", send: "Senden", attach: "Anhängen", schedule: "Planen", placeholder: (n) => `Nachricht an ${n}…` },
    fr: { back: "Retour", send: "Envoyer", attach: "Joindre", schedule: "Planifier", placeholder: (n) => `Message à ${n}…` },
  };
  const t = copy[lang] ?? copy.en;
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement | null>(null);
  const items = useMemo(() => mockMessages, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [items.length]);

  function send() {
    if (!draft.trim()) return;
    setDraft("");
  }

  return (
    <div className="container" style={{ paddingTop: 140, paddingBottom: 24 }}>
      <div className="row g-3">
        <div className="col-12 col-lg-4 d-none d-lg-block">
          <div className="card">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle text-white d-inline-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: 'var(--brand-primary)' }}>A</div>
                <div>
                  <div className="fw-semibold">Dr. Anna Keller</div>
                  <div className="text-muted small">Cardiology • Zurich</div>
                </div>
              </div>
              <Link href="/portal/chat" className="btn btn-outline-secondary btn-sm">{t.back}</Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-8">
          <div className="card">
            <div className="card-body border-bottom d-flex align-items-center justify-content-between" style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle text-white d-inline-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: 'var(--brand-primary)' }}>A</div>
                <div>
                  <div className="fw-semibold">Dr. Anna Keller</div>
                  <div className="text-muted small">Cardiology • Zurich</div>
                </div>
              </div>
              <Link href="/portal/chat" className="btn btn-outline-secondary btn-sm d-lg-none">{t.back}</Link>
            </div>
            <div className="card-body" style={{ height: 520, overflowY: "auto", background: "#f8fafc" }}>
              {items.map((m) => {
                const mine = m.fromId === mockUserId;
                return (
                  <div key={m.id} className={`d-flex mb-2 ${mine ? "justify-content-end" : "justify-content-start"}`}>
                    <div className={`p-2 rounded-3 ${mine ? "bg-light" : "text-white"}`} style={{ maxWidth: 520, ...(mine ? {} : { backgroundColor: 'var(--brand-primary)' }) }}>
                      <div>{m.body}</div>
                    </div>
                  </div>
                );
              })}
              <div ref={endRef} />
            </div>
            <div className="card-body border-top">
              <div className="d-flex gap-2">
                <input className="form-control" placeholder={t.placeholder(peerId)} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} />
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }} onClick={send}>{t.send}</button>
              </div>
              <div className="d-flex gap-2 mt-2">
                <button className="btn btn-outline-secondary btn-sm">{t.attach}</button>
                <button className="btn btn-outline-secondary btn-sm">{t.schedule}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
