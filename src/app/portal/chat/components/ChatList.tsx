"use client";
import Link from "next/link";

type Props = {
  items: Array<{ peerId: string; name: string; subtitle?: string; lastMessage?: string; time?: string; unread?: number }>;
};

export default function ChatList({ items }: Props) {
  return (
    <div className="list-group">
      {items.map((c) => (
        <Link key={c.peerId} href={`/portal/chat/${c.peerId}`} className="list-group-item list-group-item-action d-flex gap-3 py-3 align-items-center">
          <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white" style={{ width: 44, height: 44 }}> {c.name.charAt(0)} </div>
          <div className="me-auto">
            <div className="d-flex align-items-center gap-2">
              <strong>{c.name}</strong>
              {c.subtitle ? <span className="text-muted small">{c.subtitle}</span> : null}
            </div>
            {c.lastMessage ? <div className="text-muted text-truncate" style={{ maxWidth: 520 }}>{c.lastMessage}</div> : null}
          </div>
          <div className="text-end" style={{ minWidth: 80 }}>
            {c.time ? <div className="text-muted small">{c.time}</div> : null}
            {c.unread ? <span className="badge bg-warning text-dark">{c.unread}</span> : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
