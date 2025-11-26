"use client";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useSearchParams } from "next/navigation";

const LS_MY_COUPONS = "my_coupons";
const LS_LAST_PURCHASE = "last_purchase";

function load<T>(k: string, fallback: T): T { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; } }

export default function CouponsSuccessPage() {
  return (
    <Suspense fallback={<main style={{ paddingTop: 96, paddingBottom: 40 }}><div className="container"><div className="alert alert-info">Loading…</div></div></main>}>
      <CouponsSuccessContent />
    </Suspense>
  );
}
function save<T>(k: string, v: T) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }

type StoredCoupon = { code: string; status: "active"|"redeemed"; createdAt: number };

type Purchase = { product: string; codes: string[]; priceText: string; ts: number };

function genCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const part = (n:number)=>Array.from({length:n},()=>alphabet[Math.floor(Math.random()*alphabet.length)]).join("");
  return `NTR-${part(3)}-${part(4)}`;
}

function CouponsSuccessContent() {
  const { lang } = useLanguage();
  const copy: Record<string, { title: string; desc: string; toMy: string; again: string }>= {
    en: { title: "Purchase successful", desc: "Your coupon codes are generated and saved to your account.", toMy: "Go to My Coupons", again: "Buy again" },
    de: { title: "Meine Gutscheine", desc: "Deine Gutscheincodes wurden erstellt und gespeichert.", toMy: "Zu meinen Gutscheine", again: "Weitere Gutscheine kaufen" },
    fr: { title: "Achat réussi", desc: "Vos codes coupons ont été générés et enregistrés.", toMy: "Aller à Mes coupons", again: "Acheter à nouveau" },
  };
  const t = copy[lang] ?? copy.en;

  const [codes, setCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");

  useEffect(() => {
    async function run() {
      try {
        // If returning from Stripe with session_id, verify and generate codes accordingly
        if (sessionId) {
          const res = await fetch(`/api/checkout/session?id=${encodeURIComponent(sessionId)}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "Failed to verify session");
          const paid = data?.payment_status === "paid" || data?.status === "complete";
          if (!paid) throw new Error("Payment not completed");
          const qtyRaw = data?.metadata?.quantity;
          const qty = Math.max(1, Math.min(100, Number(qtyRaw) || 1));
          const newCodes = Array.from({ length: qty }, genCode);
          setCodes(newCodes);
          // Persist to My Coupons
          const mine = load<StoredCoupon[]>(LS_MY_COUPONS, []);
          const appended = [...mine, ...newCodes.map((c) => ({ code: c, status: "active" as const, createdAt: Date.now() }))];
          save(LS_MY_COUPONS, appended);
          // Save last purchase snapshot (display text can be static for now)
          const priceText = "CHF 19.00";
          const snap: Purchase = { product: "ki_assistant", codes: newCodes, priceText, ts: Date.now() };
          save(LS_LAST_PURCHASE, snap);
        } else {
          // Fallback: show any locally saved last purchase if exists
          const p = load<Purchase | null>(LS_LAST_PURCHASE, null);
          if (p?.codes?.length) setCodes(p.codes);
        }
      } catch (e: any) {
        setError(e?.message || "Unable to complete purchase");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [sessionId]);

  return (
    <main style={{ paddingTop: 96, paddingBottom: 40 }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h1 className="h4">{t.title}</h1>
                <p className="text-muted">{t.desc}</p>
                {loading ? <div className="alert alert-info py-2">Processing your payment…</div> : null}
                {error ? <div className="alert alert-danger py-2">{error}</div> : null}
                {codes.length > 0 ? (
                  <ul className="list-group mb-3">
                    {codes.map((c) => (
                      <li key={c} className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="fw-semibold">{c}</span>
                        <span className="badge bg-success">Active</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="d-flex gap-2">
                  <Link href="/portal/coupons" className="btn btn-primary">{t.toMy}</Link>
                  <Link href="/coupons" className="btn btn-outline-secondary">{t.again}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
