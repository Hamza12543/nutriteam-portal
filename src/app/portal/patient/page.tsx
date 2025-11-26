"use client";
import styles from "../page.module.scss";
import Footer from "../../components/Footer";
import { useLanguage } from "../../providers/LanguageProvider";
import { useEffect, useState } from "react";

export default function PatientPortalPage() {
  const { lang } = useLanguage();
  const [dash, setDash] = useState<any | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");
  const [name, setName] = useState("");
  const [languages, setLanguages] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState<number | "">("");
  const [lng, setLng] = useState<number | "">("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreviewUrl, setProfilePicturePreviewUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [purchases, setPurchases] = useState<Array<{ id: number; createdAt: string; quantity: number; generatedCodes: Array<{ code: string; isRedeemed?: boolean }> }> | null>(null);
  const [purchErr, setPurchErr] = useState<string | null>(null);
  function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : NaN; }
  useEffect(() => {
    (async () => {
      try {
        const token = (() => {
          try { const t = localStorage.getItem('auth_token'); if (t) return t; } catch {}
          try { const m = document.cookie.match(/(?:^|; )auth_token=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch {};
          return null;
        })();
        if (!token) return;
        const res = await fetch(`${apiBase}/dashboard`, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
        if (!res.ok) return;
        const j = await res.json();
        setDash(j);
        const pd = j?.profileData || j?.profile || j?.profileInfo || null;
        if (pd) {
          if (typeof pd.displayName === 'string') setName(pd.displayName);
          if (typeof pd.languages === 'string') setLanguages(pd.languages || '');
          if (typeof pd.specialties === 'string') setSpecialties(pd.specialties || '');
          const tel = pd?.user?.telephone || pd?.telephone || '';
          if (typeof tel === 'string') setPhone(tel || '');
          if (typeof pd.city === 'string') setCity(pd.city || '');
          if (typeof pd.country === 'string') setCountry(pd.country || '');
          if (typeof pd.latitude === 'number') setLat(pd.latitude);
          if (typeof pd.longitude === 'number') setLng(pd.longitude);
          const pic = typeof pd.profilePictureUrl === 'string' ? pd.profilePictureUrl.trim() : null;
          setProfilePictureUrl(pic);
          setProfilePicturePreviewUrl(null);
          setImgError(false);
        }
        // Fallback to dashboard welcomeName if displayName missing
        if (!pd || (typeof pd.displayName !== 'string' || !pd.displayName)) {
          const wn = typeof j?.welcomeName === 'string' ? j.welcomeName : '';
          if (wn) setName(wn);
        }
        // Load purchases for My Coupons
        try {
          const res2 = await fetch(`${apiBase}/purchases`, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` } });
          const j2 = await res2.json().catch(() => ([]));
          if (!res2.ok) {
            setPurchErr(j2?.message || 'Failed to load coupons');
            setPurchases([]);
          } else {
            setPurchErr(null);
            setPurchases(Array.isArray(j2) ? j2 : []);
          }
        } catch (e: any) {
          setPurchErr(e?.message || 'Failed to load coupons');
          setPurchases([]);
        }
      } catch {}
    })();
  }, []);
  const copy: Record<string, {
    h1: string; sub: string;
    heroTitle: string; heroSub: string;
    m1: string; m2: string; m3: string;
    actions: {
      findTitle: string; findDesc: string; findCta: string;
      updateTitle: string; updateDesc: string; updateCta: string;
      goalsTitle: string; goalsDesc: string; goalsCta: string;
    };
    a: string; aEmpty: string; aCta: string;
    b: string; bEmpty: string; bCta: string;
    c: string; cItems: string[]; cCta: string;
    // Added UI strings for profile section and labels
    profileTitle: string; profileSub: string;
    labelFullName: string; labelLanguages: string; labelPhone: string; labelCity: string; labelCountry: string; labelLat: string; labelLng: string;
    btnChangePhoto: string; btnUploadPhoto: string; btnUseLocation: string; btnSave: string; savingLabel: string; messagesLabel: string; profilePicLabel: string;
    couponsTitle: string; couponsEmpty: string; couponsViewAll: string; couponsCode: string; couponsStatus: string; couponsAvailable: string; couponsRedeemed: string;
  }>= {
    en: {
      h1: "Patient Portal",
      sub: "Welcome back. Here's a quick overview.",
      heroTitle: "Stay on track with your wellness journey",
      heroSub: "Review your upcoming appointments, messages, and resources. Tip: keep your profile up to date for better recommendations.",
      m1: "Upcoming appointments",
      m2: "Unread messages",
      m3: "Saved resources",
      actions: {
        findTitle: "Find a professional", findDesc: "Search by city or specialty and book an appointment.", findCta: "Open directory",
        updateTitle: "Update your profile", updateDesc: "Add conditions, interests, and preferences.", updateCta: "Coming soon",
        goalsTitle: "Track goals", goalsDesc: "Set weekly habits and monitor progress.", goalsCta: "Coming soon",
      },
      a: "Upcoming appointments", aEmpty: "No appointments yet", aCta: "Schedule",
      b: "Messages", bEmpty: "No messages", bCta: "Contact us",
      c: "Resources", cItems: ["Getting started guide", "Nutrition basics", "Holistic wellness"], cCta: "View",
      profileTitle: "Profile", profileSub: "Update your details so professionals can better assist you.",
      labelFullName: "Full name", labelLanguages: "Languages", labelPhone: "Phone", labelCity: "City", labelCountry: "Country", labelLat: "Lat", labelLng: "Lng",
      btnChangePhoto: "Change photo", btnUploadPhoto: "Upload photo", btnUseLocation: "Use my location", btnSave: "Save", savingLabel: "Saving…", messagesLabel: "Messages", profilePicLabel: "Profile picture",
      couponsTitle: "My Coupons", couponsEmpty: "No coupons yet.", couponsViewAll: "View all", couponsCode: "Code", couponsStatus: "Status", couponsAvailable: "Available", couponsRedeemed: "Redeemed",
    },
    de: {
      h1: "Patient:innen-Portal",
      sub: "Willkommen zurück. Eine kurze Übersicht.",
      heroTitle: "Bleiben Sie auf Kurs auf Ihrem Gesundheitsweg",
      heroSub: "Überblick über Termine, Nachrichten und Ressourcen. Tipp: Profil aktuell halten für bessere Empfehlungen.",
      m1: "Bevorstehende Termine",
      m2: "Ungelesene Nachrichten",
      m3: "Gespeicherte Ressourcen",
      actions: {
        findTitle: "Fachperson finden", findDesc: "Nach Stadt oder Fachgebiet suchen und Termin buchen.", findCta: "Verzeichnis öffnen",
        updateTitle: "Profil aktualisieren", updateDesc: "Beschwerden, Interessen und Präferenzen hinzufügen.", updateCta: "Bald verfügbar",
        goalsTitle: "Ziele verfolgen", goalsDesc: "Wöchentliche Gewohnheiten setzen und Fortschritt messen.", goalsCta: "Bald verfügbar",
      },
      a: "Bevorstehende Termine", aEmpty: "Noch keine Termine", aCta: "Vereinbaren",
      b: "Nachrichten", bEmpty: "Keine Nachrichten", bCta: "Kontakt",
      c: "Ressourcen", cItems: ["Einstiegshilfe", "Grundlagen der Ernährung", "Ganzheitliches Wohlbefinden"], cCta: "Ansehen",
      profileTitle: "Profil", profileSub: "Aktualisieren Sie Ihre Angaben, damit Fachpersonen Sie besser unterstützen können.",
      labelFullName: "Vollständiger Name", labelLanguages: "Sprachen", labelPhone: "Telefon", labelCity: "Stadt", labelCountry: "Land", labelLat: "Breite", labelLng: "Länge",
      btnChangePhoto: "Foto ändern", btnUploadPhoto: "Foto hochladen", btnUseLocation: "Meinen Standort verwenden", btnSave: "Speichern", savingLabel: "Speichern…", messagesLabel: "Nachrichten", profilePicLabel: "Profilbild",
      couponsTitle: "Meine Gutscheine", couponsEmpty: "Noch keine Gutscheine.", couponsViewAll: "Alle ansehen", couponsCode: "Code", couponsStatus: "Status", couponsAvailable: "Verfügbar", couponsRedeemed: "Eingelöst",
    },
    fr: {
      h1: "Portail Patient",
      sub: "Bon retour. Un aperçu rapide.",
      heroTitle: "Restez sur la bonne voie dans votre parcours santé",
      heroSub: "Consultez vos rendez‑vous, messages et ressources. Astuce : gardez votre profil à jour pour de meilleures recommandations.",
      m1: "Rendez‑vous à venir",
      m2: "Messages non lus",
      m3: "Ressources enregistrées",
      actions: {
        findTitle: "Trouver un professionnel", findDesc: "Recherchez par ville ou spécialité et réservez.", findCta: "Ouvrir l'annuaire",
        updateTitle: "Mettre à jour le profil", updateDesc: "Ajoutez vos conditions, intérêts et préférences.", updateCta: "Bientôt disponible",
        goalsTitle: "Suivre des objectifs", goalsDesc: "Définissez des habitudes hebdomadaires et suivez les progrès.", goalsCta: "Bientôt disponible",
      },
      a: "Rendez‑vous à venir", aEmpty: "Aucun rendez‑vous", aCta: "Planifier",
      b: "Messages", bEmpty: "Aucun message", bCta: "Nous contacter",
      c: "Ressources", cItems: ["Guide de démarrage", "Bases de la nutrition", "Bien‑être holistique"], cCta: "Voir",
      profileTitle: "Profil", profileSub: "Mettez vos informations à jour pour aider les professionnel·le·s à mieux vous accompagner.",
      labelFullName: "Nom complet", labelLanguages: "Langues", labelPhone: "Téléphone", labelCity: "Ville", labelCountry: "Pays", labelLat: "Lat", labelLng: "Lng",
      btnChangePhoto: "Modifier la photo", btnUploadPhoto: "Téléverser la photo", btnUseLocation: "Utiliser ma position", btnSave: "Enregistrer", savingLabel: "Enregistrement…", messagesLabel: "Messages", profilePicLabel: "Photo de profil",
      couponsTitle: "Mes coupons", couponsEmpty: "Aucun coupon pour l’instant.", couponsViewAll: "Tout voir", couponsCode: "Code", couponsStatus: "Statut", couponsAvailable: "Disponible", couponsRedeemed: "Utilisé",
    },
  };
  const t = copy[lang] ?? copy.en;
  async function uploadSelectedPhoto() {
    try {
      setNotice(null);
      if (!profilePictureFile) { setNotice('No photo selected'); return; }
      const token = (() => {
        try { const t = localStorage.getItem('auth_token'); if (t) return t; } catch {}
        try { const m = document.cookie.match(/(?:^|; )auth_token=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch {};
        return null;
      })();
      if (!token) throw new Error('Not authenticated');
      const fd = new FormData();
      fd.append('file', profilePictureFile);
      const upRes = await fetch(`${apiBase}/profiles/upload`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
      if (!upRes.ok) throw new Error('Upload failed');
      const j = await upRes.json().catch(() => ({}));
      const url = j?.url || j?.profilePictureUrl || j?.location || j?.path;
      if (!url) throw new Error('Upload URL missing');
      setProfilePictureUrl(typeof url === 'string' ? url.trim() : url);
      setImgError(false);
      setProfilePictureFile(null);
      setProfilePicturePreviewUrl(null);
      setNotice('Photo uploaded');
    } catch (e: any) {
      setNotice(e?.message || 'Photo upload failed');
    }
  }

  function uploadPhoto(file: File) {
    try {
      setProfilePictureFile(file);
      const url = URL.createObjectURL(file);
      setProfilePicturePreviewUrl(url);
      setNotice('Photo selected. Click Upload to send.');
    } catch (e: any) {
      setNotice(e?.message || 'Photo select failed');
    }
  }

  async function useMyLocation() {
    try {
      setNotice(null);
      await new Promise<void>((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
        navigator.geolocation.getCurrentPosition((pos) => {
          setLat(pos.coords.latitude);
          setLng(pos.coords.longitude);
          resolve();
        }, (err) => reject(err), { enableHighAccuracy: true, timeout: 8000 });
      });
    } catch (e: any) {
      setNotice(e?.message || 'Failed to get location');
    }
  }

  async function saveAll() {
    try {
      setSavingAll(true); setNotice(null);
      const token = (() => {
        try { const t = localStorage.getItem('auth_token'); if (t) return t; } catch {}
        try { const m = document.cookie.match(/(?:^|; )auth_token=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch {};
        return null;
      })();
      if (!token) throw new Error('Not authenticated');
      const latVal = typeof lat === 'number' ? lat : toNum(String(lat));
      const lngVal = typeof lng === 'number' ? lng : toNum(String(lng));
      const payload: any = {};
      if (name) payload.displayName = name;
      if (languages) payload.languages = languages;
      if (specialties) payload.specialties = specialties;
      if (city) payload.city = city;
      if (country) payload.country = country;
      if (phone) payload.telephone = phone;
      if (profilePictureUrl && !profilePictureUrl.startsWith('blob:')) payload.profilePictureUrl = profilePictureUrl;
      if (Number.isFinite(latVal)) payload.latitude = latVal;
      if (Number.isFinite(lngVal)) payload.longitude = lngVal;
      const res = await fetch(`${apiBase}/profiles/me`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      setNotice('Saved');
    } catch (e: any) {
      setNotice(e?.message || 'Failed');
    } finally {
      setSavingAll(false);
    }
  }

  return (
    <main className={styles.wrapper}>
      <div className="container">
        <header className={styles.header}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1>{t.h1}</h1>
              <p>{t.sub}</p>
            </div>
            <div className="d-inline-flex align-items-center">
              {profilePicturePreviewUrl || (profilePictureUrl && !imgError) ? (
                <img
                  key={(profilePicturePreviewUrl || profilePictureUrl) as string}
                  src={profilePicturePreviewUrl || profilePictureUrl || ''}
                  alt="Profile"
                  style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: '50%', border: '1px solid #e5e7eb' }}
                  onError={() => { setProfilePicturePreviewUrl(null); setImgError(true); }}
                />
              ) : (
                <div aria-hidden className="d-flex align-items-center justify-content-center" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e5e7eb', background: '#f8fafc', color: '#334155', fontWeight: 700 }}>
                  {(name || dash?.welcomeName || 'P').slice(0,1)}
                </div>
              )}
              <span className="ms-2 fw-semibold">{name || dash?.welcomeName || ''}</span>
              <a href="/messages" className="ms-3 d-inline-flex align-items-center text-decoration-none">
                <span className="badge bg-secondary me-2">{typeof (dash?.stats?.unreadMessages) === 'number' ? dash.stats.unreadMessages : 0}</span>
                <span className="text-muted small">{t.messagesLabel}</span>
              </a>
            </div>
          </div>
        </header>

        {/* Hero banner */}
        <section className={`${styles.section} ${styles.hero}`}>
          <div className={styles.heroCard}>
            <h3 className={styles.heroTitle}>{t.heroTitle}</h3>
            <p className={styles.heroSub}>{t.heroSub}</p>
            <div className={styles.metrics}>
              <div className={styles.metric}><strong>{typeof (dash?.stats?.profileCompleteness) === 'number' ? `${dash.stats.profileCompleteness}%` : '0'}</strong><span>{t.m1}</span></div>
              <div className={styles.metric}><strong>{typeof (dash?.stats?.unreadMessages) === 'number' ? dash.stats.unreadMessages : 0}</strong><span>{t.m2}</span></div>
              
            </div>
          </div>
        </section>
        {/* My Coupons section */}
        <section className={styles.section}>
          <div className={styles.card}>
            <div className="d-flex align-items-center justify-content-between">
              <div className={styles.sectionTitle}>{t.couponsTitle}</div>
              <a href="/portal/coupons" className="btn btn-outline-secondary btn-sm">{t.couponsViewAll}</a>
            </div>
            {purchases === null ? (
              <div className="text-muted py-2 small">Loading…</div>
            ) : (purchases?.length || 0) === 0 ? (
              <div className="text-muted py-2 small">{t.couponsEmpty}</div>
            ) : (
              <div className="list-group list-group-flush mt-2">
                {(purchases || []).slice(0, 2).map((p) => (
                  <div key={p.id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <strong>#{p.id}</strong>
                      <span className="badge bg-secondary">{p.quantity}</span>
                    </div>
                    <ul className="list-unstyled m-0">
                      {(p.generatedCodes || []).slice(0, 3).map((gc, idx) => (
                        <li key={`${p.id}-${idx}-${gc.code}`} className="d-flex justify-content-between align-items-center py-1">
                          <span className="small">{t.couponsCode}: <strong>{gc.code}</strong></span>
                          <span className={`badge ${gc.isRedeemed ? 'bg-secondary' : 'bg-success'}`}>{gc.isRedeemed ? t.couponsRedeemed : t.couponsAvailable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
            {purchErr && <div className="text-danger small mt-2">{purchErr}</div>}
          </div>
        </section>

        {/* Profile (like professional, without bio) */}
        <section className={styles.section}>
          <div className={styles.card}>
            <div className={styles.sectionTitle}>{t.profileTitle}</div>
            <p className="text-muted">{t.profileSub}</p>
            {/* Avatar + upload at top */}
            <div className="d-flex align-items-center gap-3 mb-3">
              {profilePicturePreviewUrl || (profilePictureUrl && !imgError) ? (
                <img
                  key={(profilePicturePreviewUrl || profilePictureUrl) as string}
                  src={profilePicturePreviewUrl || profilePictureUrl || ''}
                  alt="Profile"
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 12, border: '1px solid #e5e7eb' }}
                  onError={() => { setProfilePicturePreviewUrl(null); setImgError(true); }}
                />
              ) : (
                <div aria-hidden className="d-flex align-items-center justify-content-center" style={{ width: 72, height: 72, borderRadius: 12, border: '1px solid #e5e7eb', background: '#f8fafc', color: '#334155', fontWeight: 700 }}>
                  {(name || 'P').slice(0,1)}
                </div>
              )}
              <div>
                <div className="fw-semibold">{name || dash?.welcomeName || 'Profile'}</div>
                <div className="text-muted small">{t.profilePicLabel}</div>
                <label className="btn btn-sm" style={{backgroundColor:"var(--brand-primary)", color:"white", border:"1px solid var(--brand-primary)"}}>
                  {t.btnChangePhoto}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }} />
                </label>
                {profilePictureFile && (
                  <button type="button" className="btn btn-sm ms-2" onClick={uploadSelectedPhoto} style={{backgroundColor:"#0ea5e9", color:"white", border:"1px solid #0ea5e9"}}>
                    {t.btnUploadPhoto}
                  </button>
                )}
              </div>
            </div>

            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label">{t.labelFullName}</label>
                <input className="form-control" placeholder={t.labelFullName} value={name || (dash?.welcomeName ?? '')} onChange={(e) => setName(e.target.value)} disabled />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t.labelLanguages}</label>
                <input className="form-control" placeholder={t.labelLanguages} value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>

              <div className="col-md-4">
                <label className="form-label">{t.labelPhone}</label>
                <input className="form-control" placeholder={t.labelPhone} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t.labelCity}</label>
                <input className="form-control" placeholder={t.labelCity} value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t.labelCountry}</label>
                <input className="form-control" placeholder={t.labelCountry} value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">{t.labelLat}</label>
                <input className="form-control" placeholder={t.labelLat} value={lat} onChange={(e) => setLat(e.target.value as any)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">{t.labelLng}</label>
                <input className="form-control" placeholder={t.labelLng} value={lng} onChange={(e) => setLng(e.target.value as any)} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-4">
              <button style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid var(--brand-primary)"}} className="btn btn-outline-secondary btn-sm" onClick={useMyLocation}>{t.btnUseLocation}</button>
              <button style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid var(--brand-primary)"}} className="btn btn-primary btn-sm" onClick={saveAll} disabled={savingAll}>{savingAll ? t.savingLabel : t.btnSave}</button>
              {notice ? <span className="text-muted small ms-2">{notice}</span> : null}
            </div>
          </div>
        </section>
        
      </div>
      <Footer />
    </main>
  );
}
