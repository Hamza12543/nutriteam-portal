"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";

type Conversation = {
  peerId: string;
  name: string;
  subtitle: string;
  lastMessage: string;
  time: string;
  unread?: number;
};

const mockConversations: Conversation[] = [
  { peerId: "pro_anna", name: "Dr. Anna Keller", subtitle: "Cardiology • Zurich", lastMessage: "Please share your latest labs…", time: "10:24", unread: 2 },
  { peerId: "pat_john", name: "John Martin", subtitle: "Patient", lastMessage: "Thanks doctor! See you next week.", time: "Yesterday" },
  { peerId: "grp_diet", name: "Dietician Groupe", subtitle: "Nutrition", lastMessage: "We recommend a 2,100 kcal plan…", time: "Mon" },
];

export default function ChatListPage() {
  const { lang } = useLanguage();
  const copy: Record<string, { title: string; newBtn: string; searchPh: string }>= {
    en: { title: "Messages", newBtn: "New", searchPh: "Search professionals or patients" },
    de: { title: "Nachrichten", newBtn: "Neu", searchPh: "Fachpersonen oder Patient:innen suchen" },
    fr: { title: "Messages", newBtn: "Nouveau", searchPh: "Rechercher des professionnels ou des patients" },
  };
  const t = copy[lang] ?? copy.en;
  const items = useMemo(() => mockConversations, []);
  return (
    <div className="container" style={{ paddingTop: 140, paddingBottom: 40 }}>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h1 className="h4 m-0">{t.title}</h1>
            <button className="btn btn-primary" style={{ backgroundColor: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }}>{t.newBtn}</button>
          </div>
          <div className="mb-3">
            <input className="form-control" placeholder={t.searchPh} />
          </div>
          <div className="list-group">
            {items.map((c) => (
              <Link key={c.peerId} href={`/portal/chat/${c.peerId}`} className="list-group-item list-group-item-action d-flex gap-3 py-3 align-items-center">
                <div className="d-inline-flex align-items-center justify-content-center rounded-circle text-white" style={{ width: 44, height: 44, backgroundColor: 'var(--brand-primary)' }}> {c.name.charAt(0)} </div>
                <div className="me-auto">
                  <div className="d-flex align-items-center gap-2">
                    <strong>{c.name}</strong>
                    <span className="text-muted small">{c.subtitle}</span>
                  </div>
                  <div className="text-muted text-truncate" style={{ maxWidth: 520 }}>{c.lastMessage}</div>
                </div>
                <div className="text-end" style={{ minWidth: 80 }}>
                  <div className="text-muted small">{c.time}</div>
                  {c.unread ? (
                    <span className="badge bg-warning text-dark">{c.unread}</span>
                  ) : null}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
