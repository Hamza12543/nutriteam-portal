"use client";
import { useLanguage } from "../providers/LanguageProvider";
import './Header.module.scss'
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.scss";
import Logo from '../assets/images/omnicheck-logo.png'
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const { lang, setLang } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false); // user dropdown
  const [navOpen, setNavOpen] = useState(false);   // mobile navbar
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const hasToken = () => {
      try {
        const ls = typeof window !== 'undefined' ? !!localStorage.getItem('auth_token') : false;
        const ck = typeof document !== 'undefined' ? /(?:^|; )auth_token=/.test(document.cookie) : false;
        return ls || ck;
      } catch { return false; }
    };
    setLoggedIn(hasToken());
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'auth_token') setLoggedIn(!!e.newValue);
      if (e.key === 'fullName' && typeof e.newValue === 'string') setFullName(e.newValue || "");
    };
    window.addEventListener('storage', onStorage);
    const iv = setInterval(() => {
      setLoggedIn(hasToken());
      try { const fn = localStorage.getItem('fullName') || ""; if (fn !== fullName) setFullName(fn || ""); } catch {}
    }, 1500);
    try { const fn = localStorage.getItem('fullName') || ""; setFullName(fn || ""); } catch {}
    return () => { window.removeEventListener('storage', onStorage); clearInterval(iv); };
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setMenuOpen(false); }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDocClick); document.removeEventListener('keydown', onKey); };
  }, []);

  function logout() {
    try { localStorage.removeItem('auth_token'); } catch {}
    try { localStorage.removeItem('user_role'); } catch {}
    try { localStorage.removeItem('fullName'); } catch {}
    try { localStorage.removeItem('demo_userId'); } catch {}
    try { document.cookie = 'auth_token=; Path=/; Max-Age=0; SameSite=Lax'; } catch {}
    try { document.cookie = 'user_role=; Path=/; Max-Age=0; SameSite=Lax'; } catch {}
    setLoggedIn(false);
    router.replace('/');
  }

  function goToDashboard() {
    try {
      const getRole = () => {
        try { const r = localStorage.getItem('user_role'); if (r) return r; } catch {}
        try { const m = document.cookie.match(/(?:^|; )user_role=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch {}
        return null;
      };
      const role = (getRole() || '').toString().toUpperCase();
      const path = role === 'PROFESSIONAL' ? '/portal/professional' : '/portal/patient';
      router.push(path);
    } catch {
      router.push('/portal/patient');
    }
  }

  const nav: Record<string, {
    home: string; directory: string; coupons: string; register: string; login: string; about: string; faq: string; contact: string; ai: string; messages: string;
    dashboard: string; logout: string; langLabel: string;
  }>= {
    en: {
      home: "Home", directory: "Directory", coupons: "Coupons", register: "Register", login: "Login", about: "About", faq: "FAQ", contact: "Contact", ai: "OmniCheck", messages: "Messages",
      dashboard: "Dashboard", logout: "Logout", langLabel: "Language",
    },
    de: {
      home: "Start", directory: "Verzeichnis", coupons: "Gutscheine", register: "Registrieren", login: "Anmelden", about: "Über uns", faq: "FAQ", contact: "Kontakt", ai: "OmniCheck", messages: "Nachrichten",
      dashboard: "Portal", logout: "Abmelden", langLabel: "Sprache",
    },
    fr: {
      home: "Accueil", directory: "Annuaire", coupons: "Coupons", register: "S'inscrire", login: "Se connecter", about: "À propos", faq: "FAQ", contact: "Contact", ai: "Assistant santé", messages: "Messages",
      dashboard: "Tableau de bord", logout: "Se déconnecter", langLabel: "Langue",
    },
  };
  const t = nav[lang] ?? nav.en;
  return (
    <header className={`${styles.header} border-bottom fixed-top`}>
      <nav className={`${styles.navbarNav} navbar navbar-expand-lg navbar-light container`}>
        <Link className="navbar-brand d-flex align-items-center"  href="/">
          <img style={{maxWidth: "200px", width: "200px"}} src={Logo.src} alt="Logo" className="img-fluid" />
         {/* <p style={{marginBottom: 0, color: "#00a5bf", fontWeight: 600, marginLeft: "10px", fontSize: "20px"}}>OmniCheck AI</p> */}
        </Link>

        {/* Hamburger toggler for mobile/tablet */}
        <button
          className="navbar-toggler ms-auto"
          type="button"
          aria-controls="mainNav"
          aria-expanded={navOpen}
          aria-label="Toggle navigation"
          onClick={() => setNavOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`navbar-collapse ${navOpen ? "show" : "collapse"}`} id="mainNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item"><Link className={`nav-link ${pathname === '/' ? styles.active : ''}`} href="/">{t.home}</Link></li>
            <li className="nav-item"><Link className={`nav-link ${pathname?.startsWith('/directory') ? styles.active : ''}`} href="/directory">{t.directory}</Link></li>
            <li className="nav-item"><Link className={`nav-link ${pathname?.startsWith('/coupons') ? styles.active : ''}`} href="/coupons">{t.coupons}</Link></li>
            <li className="nav-item"><Link className={`nav-link ${pathname?.startsWith('/register') ? styles.active : ''}`} href="/register">{t.register}</Link></li>
            <li className="nav-item"><Link className={`nav-link ${pathname?.startsWith('/contact') ? styles.active : ''}`} href="/contact">{t.contact}</Link></li>
            {loggedIn && (
              <li className="nav-item"><Link className={`nav-link ${pathname?.startsWith('/portal/chat') ? styles.active : ''}`} href="/portal/chat">{t.messages}</Link></li>
            )}
            
          </ul>
          {/* Desktop actions */}
          <div className="d-none d-lg-flex align-items-center gap-2">
            <a className={`${styles.haBtn}`} href="https://ki.nutriteam.ch/?utm_source=nutriteam-network&utm_medium=nav&utm_campaign=ai-health" target="_blank" rel="noopener noreferrer">{t.ai}</a>
            {loggedIn ? (
              <div className="position-relative" ref={menuRef}>
                <button type="button" onClick={()=>setMenuOpen((v)=>!v)} className="btn btn-link p-0 d-flex align-items-center text-decoration-none" aria-haspopup="menu" aria-expanded={menuOpen} style={{ color: '#fff' }}>
                  <span aria-hidden className="d-inline-flex align-items-center justify-content-center" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#f8fafc', color: '#334155', fontWeight: 700 }}>
                    {(fullName || 'U').slice(0,1)}
                  </span>
                  <span className="ms-2 fw-semibold" style={{ whiteSpace: 'nowrap', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName || ''}</span>
                  <svg className="ms-1" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {menuOpen && (
                  <div role="menu" className={`${styles.userMenu} shadow-sm`}>
                    <button role="menuitem" className={styles.userMenuItem} onClick={()=>{ setMenuOpen(false); goToDashboard(); }}>
                      {t.dashboard}
                    </button>
                    <div className={styles.userMenuDivider} />
                    <button role="menuitem" className={styles.userMenuItem} style={{ color: '#fca5a5' }} onClick={()=>{ setMenuOpen(false); logout(); }}>
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={styles.navBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M8 7l-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 21h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{t.login}</span>
              </Link>
            )}
            <select
              className="form-select form-select-sm"
              aria-label={t.langLabel}
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              style={{ width: 70 }}
            >
              <option value="de">DE</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>

          {/* Mobile / tablet actions below nav links */}
          <div className="d-flex d-lg-none flex-column gap-2 mt-3">
            <a className={`${styles.haBtn}`} href="https://ki.nutriteam.ch/?utm_source=nutriteam-network&utm_medium=nav&utm_campaign=ai-health" target="_blank" rel="noopener noreferrer">{t.ai}</a>
            {loggedIn ? (
              <div className="position-relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={()=>setMenuOpen((v)=>!v)}
                  className="btn btn-link p-0 d-flex align-items-center text-decoration-none"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  style={{ color: '#fff' }}
                >
                  <span
                    aria-hidden
                    className="d-inline-flex align-items-center justify-content-center"
                    style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#f8fafc', color: '#334155', fontWeight: 700 }}
                  >
                    {(fullName || 'U').slice(0,1)}
                  </span>
                  <span className="ms-2 fw-semibold" style={{ whiteSpace: 'nowrap', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{fullName || ''}</span>
                  <svg className="ms-1" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {menuOpen && (
                  <div role="menu" className={`${styles.userMenu} shadow-sm`}>
                    <button role="menuitem" className={styles.userMenuItem} onClick={()=>{ setMenuOpen(false); goToDashboard(); }}>
                      {t.dashboard}
                    </button>
                    <div className={styles.userMenuDivider} />
                    <button role="menuitem" className={styles.userMenuItem} style={{ color: '#fca5a5' }} onClick={()=>{ setMenuOpen(false); logout(); }}>
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={styles.navBtn}>
                <span>{t.login}</span>
              </Link>
            )}
            <select
              className="form-select form-select-sm mt-1"
              aria-label={t.langLabel}
              value={lang}
              onChange={(e) => setLang(e.target.value as any)}
              style={{ maxWidth: 120 }}
            >
              <option value="de">DE</option>
              <option value="en">EN</option>
              <option value="fr">FR</option>
            </select>
          </div>
        </div>
      </nav>
    </header>
  );
}
