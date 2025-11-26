"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "../components/Footer";
import styles from "../login/page.module.scss";

function ResetPasswordContent() {
  const sp = useSearchParams();
  const token = useMemo(() => sp.get("token") || "", [sp]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (!token) { setError("Missing token. Please use the link from your email."); return; }
    if (!password || password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    try {
      setSubmitting(true);
      const res = await fetch(`${apiBase}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j?.message || "Token is invalid or has expired.");
        return;
      }
      setMessage(j?.message || "Password has been successfully reset.");
    } catch {
      setError("Failed to reset password. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.heroBg} />
      <div className="container">
        <header className={styles.header}>
          <h1 style={{color: "var(--brand-primary)"}}>Reset password</h1>
          <p>Enter your new password below.</p>
        </header>

        <section className={styles.section}>
          <div className="row justify-content-center">
            <div className="col-lg-8 col-xl-6">
              <div className={styles.authCard}>
                <div className="p-4 p-md-5">
                  <form onSubmit={onSubmit} noValidate>
                    <div className="form-group mb-3">
                      <label htmlFor="password" className="form-label">New password</label>
                      <input id="password" name="password" type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="confirm" className="form-label">Confirm password</label>
                      <input id="confirm" name="confirm" type="password" className="form-control" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
                    </div>

                    {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                    {message && <div className="alert alert-success py-2" role="status">{message}</div>}

                    <div className="d-flex gap-2 mt-5 justify-content-between">
                      <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} style={{backgroundColor: "var(--brand-primary)", maxWidth: "60%"}} disabled={submitting}>
                        {submitting ? "..." : "Reset password"}
                      </button>
                      <a href="/login" className="btn btn-outline-secondary" style={{color: "var(--brand-primary)"}}>Back to login</a>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main style={{ paddingTop: 96, paddingBottom: 40 }}><div className="container"><div className="alert alert-info">Loading…</div></div></main>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
