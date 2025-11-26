"use client";
import Link from "next/link";
import Footer from "../components/Footer";
import { useLanguage } from "../providers/LanguageProvider";

export default function PaymentCancelledPage() {
  const { lang } = useLanguage();
  const copy: Record<string, { badge: string; title: string; body: string; backPricing: string; goHome: string }>= {
    en: {
      badge: "Payment cancelled",
      title: "Your payment was cancelled",
      body: "You have not been charged. You can go back to the pricing page to try again.",
      backPricing: "Back to pricing",
      goHome: "Go to Home",
    },
    de: {
      badge: "Zahlung abgebrochen",
      title: "Ihre Zahlung wurde abgebrochen",
      body: "Es wurde kein Betrag abgebucht. Sie können zur Preisübersicht zurückkehren und es erneut versuchen.",
      backPricing: "Zur Preisübersicht",
      goHome: "Zur Startseite",
    },
    fr: {
      badge: "Paiement annulé",
      title: "Votre paiement a été annulé",
      body: "Vous n'avez pas été débité. Vous pouvez revenir aux tarifs pour réessayer.",
      backPricing: "Retour aux tarifs",
      goHome: "Aller à l’accueil",
    },
  };
  const t = copy[lang] ?? copy.en;
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1" style={{ paddingTop: 140 }}>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center">
                <div className="mb-3">
                  <span className="badge" style={{backgroundColor: "#fff1f2", color: "#be123c", border: "1px solid rgba(190,18,60,0.2)", padding: "8px 14px", borderRadius: 999}}>{t.badge}</span>
                </div>
                <h1 className="fw-bold" style={{color: "var(--brand-primary)"}}>{t.title}</h1>
                <p className="text-muted">{t.body}</p>
                <div className="mt-4 d-flex justify-content-center gap-2">
                  <Link href="/coupons" className="btn btn-outline-secondary">{t.backPricing}</Link>
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
