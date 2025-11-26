"use client";
import Link from "next/link";
import Footer from "../components/Footer";
import { useLanguage } from "../providers/LanguageProvider";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const { lang } = useLanguage();
  const copy: Record<string, { badge: string; title: string; body: string; backPricing: string; goHome: string; verifying: string; codesTitle: string; code: string; redeemed: string; available: string }>= {
    en: {
      badge: "Payment successful",
      title: "Thank you for your purchase!",
      body: "Please check your email for your coupon codes and receipt.",
      backPricing: "My Coupons",
      goHome: "Go to Home",
      verifying: "Verifying your purchase...",
      codesTitle: "Here are your coupon codes:",
      code: "Code",
      redeemed: "Redeemed",
      available: "Available",
    },
    de: {
      badge: "Zahlung erfolgreich",
      title: "Vielen Dank für deinen Kauf!",
      body: "Du kannst deinen Gutschein für unsere Gesundheits-App ab sofort einlösen.",
      backPricing: "Meine Gutscheine",
      goHome: "Zur Startseite",
      verifying: "Kauf wird überprüft...",
      codesTitle: "Hier sind deine Coupon-Codes:",
      code: "Code",
      redeemed: "Eingelöst",
      available: "Verfügbar",
    },
    fr: {
      badge: "Paiement réussi",
      title: "Merci pour votre achat !",
      body: "Veuillez vérifier votre e‑mail pour vos codes de coupon et votre reçu.",
      backPricing: "Mes coupons",
      goHome: "Aller à l’accueil",
      verifying: "Vérification de votre achat...",
      codesTitle: "Voici vos codes de coupon :",
      code: "Code",
      redeemed: "Utilisé",
      available: "Disponible",
    },
  };
  const t = copy[lang] ?? copy.en;
  const sp = useSearchParams();
  const sessionId = useMemo(() => sp.get("session_id") || "", [sp]);
  const [loading, setLoading] = useState<boolean>(!!sessionId);
  const [error, setError] = useState<string | null>(null);
  const [codes, setCodes] = useState<Array<{ code: string; isRedeemed?: boolean }>>([]);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!sessionId) { setLoading(false); return; }
      setError(null);
      setLoading(true);
      try {
        const token = (() => {
          try { const t = localStorage.getItem('auth_token'); if (t) return t; } catch {}
          try { const m = document.cookie.match(/(?:^|; )auth_token=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch {}
          return null;
        })();
        if (!token) { setError('Not authenticated'); setLoading(false); return; }
        const res = await fetch(`${apiBase}/purchases/verify?session_id=${encodeURIComponent(sessionId)}`, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) { setError(j?.message || 'Verification failed'); setLoading(false); return; }
        const list = Array.isArray(j?.generatedCodes) ? j.generatedCodes as any[] : [];
        if (!cancelled) setCodes(list);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Verification failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [sessionId, apiBase]);
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1" style={{ paddingTop: 140 }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center">
                <div className="mb-3">
                  <span className="badge" style={{backgroundColor: "#e6f3f6", color: "#0c6172", border: "1px solid rgba(12,97,114,0.2)", padding: "8px 14px", borderRadius: 999}}>{t.badge}</span>
                </div>
                <h1 className="fw-bold" style={{color: "var(--brand-primary)"}}>{t.title}</h1>
                <p className="text-muted">{t.body}</p>
                {loading && (
                  <div className="alert alert-info" role="status">{t.verifying}</div>
                )}
                {error && !loading && (
                  <div className="alert alert-danger" role="alert">{error}</div>
                )}
                {!loading && !error && codes && codes.length > 0 && (
                  <div className="mt-3 text-start">
                    <h5 className="fw-semibold mb-2">{t.codesTitle}</h5>
                    <ul className="list-group">
                      {codes.map((gc, idx) => (
                        <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                          <span> <strong>{gc.code}</strong></span>
                          <span className={`badge ${gc.isRedeemed ? 'bg-secondary' : 'bg-success'}`}>{gc.isRedeemed ? t.redeemed : t.available}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-4 d-flex justify-content-center gap-2">
                  <Link href="/portal/coupons" className="btn btn-outline-secondary" style={{borderColor: "var(--brand-primary)", color: "var(--brand-primary)"}}>{t.backPricing}</Link>
                  <Link href="/" className="btn btn-primary" style={{backgroundColor:"var(--brand-primary)", borderColor: "var(--brand-primary)"}}>{t.goHome}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="container py-5"><div className="alert alert-info">Loading…</div></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
