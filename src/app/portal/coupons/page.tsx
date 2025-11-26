"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";

type GeneratedCode = { code: string; isRedeemed?: boolean };
type Purchase = { id: number; quantity: number; createdAt: string; generatedCodes: GeneratedCode[] };

export default function MyCouponsPage() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    title: string; empty: string; buy: string; code: string; status: string; active: string; redeemed: string; copy: string; copied: string; redeem: string; purchasedOn: string; prev: string; next: string; page: string; of: string;
  }>= {
    en: { title: "My Coupons", empty: "No coupons yet.", buy: "Buy more coupons", code: "Code", status: "Status", active: "Available", redeemed: "Redeemed", copy: "Copy", copied: "Copied!", redeem: "Redeem", purchasedOn: "Purchased on", prev: "Prev", next: "Next", page: "Page", of: "of" },
    de: { title: "Meine Gutscheine", empty: "Noch keine Gutscheine.", buy: "Weitere Gutscheine kaufen", code: "Code", status: "Status", active: "Verfügbar", redeemed: "Eingelöst", copy: "Kopieren", copied: "Kopiert!", redeem: "Einlösen", purchasedOn: "Gekauft am", prev: "Zurück", next: "Weiter", page: "Seite", of: "von" },
    fr: { title: "Mes coupons", empty: "Aucun coupon pour l’instant.", buy: "Acheter plus de coupons", code: "Code", status: "Statut", active: "Disponible", redeemed: "Utilisé", copy: "Copier", copied: "Copié !", redeem: "Utiliser", purchasedOn: "Acheté le", prev: "Préc.", next: "Suiv.", page: "Page", of: "sur" },
  };
  const t = copy[lang] ?? copy.en;

  const [purchases, setPurchases] = useState<Purchase[] | null>(null);
  const [justCopied, setJustCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");

  useEffect(() => {
    (async () => {
      setError(null);
      try {
        const token = (() => {
          try { const t = localStorage.getItem('auth_token'); if (t) return t; } catch {}
          try { const m = document.cookie.match(/(?:^|; )auth_token=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch {}
          return null;
        })();
        if (!token) { setPurchases([]); return; }
        const res = await fetch(`${apiBase}/purchases`, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
        const j = await res.json().catch(() => ([]));
        if (!res.ok) { setError(j?.message || 'Failed to load'); setPurchases([]); return; }
        setPurchases(Array.isArray(j) ? j as Purchase[] : []);
        setPage(1);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
        setPurchases([]);
      }
    })();
  }, [apiBase]);

  function handleCopy(code: string) {
    navigator.clipboard?.writeText(code);
    setJustCopied(code);
    setTimeout(() => setJustCopied(null), 1200);
  }

  function handleRedeem(code: string) {
    const url = `https://ki.nutriteam.ch/?coupon=${encodeURIComponent(code)}&utm_source=nutriteam-network&utm_medium=my-coupons`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const fmt = (s: string) => {
    try { const d = new Date(s); return d.toLocaleString(); } catch { return s; }
  };

  const isLoading = purchases === null;
  type Row = { id: number; createdAt: string; code: string; isRedeemed: boolean };
  const allRows: Row[] = useMemo(() => {
    if (!purchases) return [];
    return purchases.flatMap((p) =>
      (p.generatedCodes || []).map((gc) => ({ id: p.id, createdAt: p.createdAt, code: gc.code, isRedeemed: !!gc.isRedeemed }))
    );
  }, [purchases]);
  const pageSize = 10;
  const total = allRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const currentRows = allRows.slice(start, start + pageSize);

  return (
    <main style={{ paddingTop: 96, paddingBottom: 40 }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 m-0">{t.title}</h1>
          <Link href="/coupons" className="btn btn-primary" style={{backgroundColor: "var(--brand-primary)", borderColor: "var(--brand-primary)"}}>{t.buy}</Link>
        </div>
        {isLoading ? (
          <div className="text-center text-muted py-5">Loading…</div>
        ) : (purchases?.length || 0) === 0 ? (
          <div className="text-center text-muted py-5">
            <div className="mb-2">{t.empty}</div>
            <Link href="/coupons" className="btn btn-outline-secondary btn-sm">{t.buy}</Link>
          </div>
        ) : (
          <div className="card shadow-sm">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    {/* <th style={{whiteSpace:'nowrap'}}>#</th> */}
                    <th style={{whiteSpace:'nowrap'}}>{t.purchasedOn}</th>
                    <th style={{whiteSpace:'nowrap'}}>{t.code}</th>
                    <th style={{whiteSpace:'nowrap'}}>{t.status}</th>
                    <th style={{width: 200}}></th>
                  </tr>
                </thead>
                <tbody>
                  {currentRows.map((r) => (
                    <tr key={`${r.id}-${r.code}`}>
                      {/* <td><strong>#{r.id}</strong></td> */}
                      <td className="text-muted">{fmt(r.createdAt)}</td>
                      <td className="fw-semibold">{r.code}</td>
                      <td>
                        <span className={`badge ${r.isRedeemed ? 'bg-secondary' : 'bg-success'}`}>
                          {r.isRedeemed ? t.redeemed : t.active}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2 justify-content-end">
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => handleCopy(r.code)}>
                            {justCopied === r.code ? t.copied : t.copy}
                          </button>
                          <button style={{backgroundColor:'var(--brand-primary)',color:'white', border: '1px solid var(--brand-primary)'}} className="btn btn-primary btn-sm" disabled={!!r.isRedeemed} onClick={() => handleRedeem(r.code)}>
                            {t.redeem}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-footer d-flex align-items-center justify-content-between">
              <div className="text-muted small">
                {t.page} {Math.min(page, totalPages)} {t.of} {totalPages}
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-secondary btn-sm" disabled={page <= 1} onClick={() => setPage((p)=>Math.max(1, p-1))}>{t.prev}</button>
                <button className="btn btn-outline-secondary btn-sm" disabled={page >= totalPages} onClick={() => setPage((p)=>Math.min(totalPages, p+1))}>{t.next}</button>
              </div>
            </div>
            {error && <div className="px-3 pb-2 text-danger small">{error}</div>}
          </div>
        )}
      </div>
    </main>
  );
}
