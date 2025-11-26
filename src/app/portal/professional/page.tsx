"use client";
import styles from "../page.module.scss";
import Footer from "../../components/Footer";
import { useLanguage } from "../../providers/LanguageProvider";
import { useEffect, useState } from "react";

export default function ProfessionalPortalPage() {
  const { lang } = useLanguage();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("doctor");
  const [languages, setLanguages] = useState("");
  const [specialties, setSpecialties] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreviewUrl, setProfilePicturePreviewUrl] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const [lat, setLat] = useState<number | "">("");
  const [lng, setLng] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAll, setSavingAll] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [needsLocation, setNeedsLocation] = useState(false);
  const [dash, setDash] = useState<any | null>(null);
  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || "https://gdp.codefest.io/app7").replace(/\/$/, "");
  function toNum(v: string) { const n = Number(v); return Number.isFinite(n) ? n : NaN; }
  // Use URLs exactly as provided by the backend (no normalization)
  // Prefill profile and enforce location completion (temporary userId until auth wired)
  useEffect(() => {
    try {
      const uid = typeof window !== 'undefined' ? (localStorage.getItem('demo_userId') || '') : '';
      if (!uid) { setNeedsLocation(true); return; }
      (async () => {
        const res = await fetch(`/api/profile/get?userId=${encodeURIComponent(uid)}`);
        if (!res.ok) { setNeedsLocation(true); return; }
        const json = await res.json();
        const p = json?.profile || null;
        if (p) {
          if (p.category) setCategory(p.category);
          if (p.languages) setLanguages(p.languages);
          if (p.specialties) setSpecialties(p.specialties);
          if (p.bio) setBio(p.bio);
          if (p.city) setCity(p.city);
          if (p.country) setCountry(p.country);
          if (typeof p.lat === 'number') setLat(p.lat);
          if (typeof p.lng === 'number') setLng(p.lng);
        }
        const missing = !p || !(p.city && p.country) || !(typeof p.lat === 'number' && typeof p.lng === 'number');
        setNeedsLocation(missing);
      })();
    } catch {
      setNeedsLocation(true);
    }
  }, []);

  // Recompute practice location completeness to toggle the warning automatically
  useEffect(() => {
    const latVal = typeof lat === 'number' ? lat : toNum(String(lat));
    const lngVal = typeof lng === 'number' ? lng : toNum(String(lng));
    const complete = Boolean(city && country && Number.isFinite(latVal) && Number.isFinite(lngVal));
    setNeedsLocation(!complete);
  }, [city, country, lat, lng]);
  useEffect(() => {
    try {
      const fn = typeof window !== 'undefined' ? (localStorage.getItem('fullName') || '').trim() : '';
      if (fn) setName(fn);
    } catch {}
  }, []);
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
        const pd = j?.profileData || {};
        if (pd.displayName) setName(pd.displayName);
        else if (j?.welcomeName && !name) setName(j.welcomeName);
        if (pd.languages) setLanguages(pd.languages);
        if (pd.specialties) setSpecialties(pd.specialties);
        if (pd.bio) setBio(pd.bio);
        if (pd.city) setCity(pd.city);
        if (pd.country) setCountry(pd.country);
        if (pd.phone || pd.telephone) setPhone(pd.phone || pd.telephone);
        if (pd.profilePictureUrl) setProfilePictureUrl(pd.profilePictureUrl);
        if (typeof pd.latitude === 'number') setLat(pd.latitude);
        if (typeof pd.longitude === 'number') setLng(pd.longitude);
      } catch {}
    })();
  }, []);
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
      if (bio) payload.bio = bio;
      if (languages) payload.languages = languages;
      if (specialties) payload.specialties = specialties;
      if (city) payload.city = city;
      if (country) payload.country = country;
      if (phone) { payload.telephone = phone; }
      if (profilePictureUrl && !profilePictureUrl.startsWith('blob:')) payload.profilePictureUrl = profilePictureUrl;
      if (Number.isFinite(latVal)) payload.latitude = latVal;
      if (Number.isFinite(lngVal)) payload.longitude = lngVal;
      const res = await fetch(`${apiBase}/profiles/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      const updated = await res.json().catch(() => null);
      if (updated) setDash((d: any) => ({ ...(d || {}), profileData: updated }));
      // Post-save refresh to get authoritative state
      try {
        const dashRes = await fetch(`${apiBase}/dashboard`, { headers: { 'Authorization': `Bearer ${token}` } });
        const dashJson = await dashRes.json().catch(() => null);
        if (dashJson) {
          setDash(dashJson);
          const pd = dashJson?.profileData || dashJson?.profile || dashJson?.profileInfo || null;
          if (pd) {
            if (typeof pd.displayName === 'string') setName(pd.displayName);
            if (typeof pd.bio === 'string') setBio(pd.bio || '');
            if (typeof pd.languages === 'string') setLanguages(pd.languages || '');
            if (typeof pd.specialties === 'string') setSpecialties(pd.specialties || '');
            if (typeof pd.city === 'string') setCity(pd.city || '');
            if (typeof pd.country === 'string') setCountry(pd.country || '');
            const tel = pd?.user?.telephone || pd?.telephone || pd?.phone || '';
            if (typeof tel === 'string') setPhone(tel || '');
            const rawPic: string | null = (typeof pd?.profilePictureUrl === 'string' ? pd.profilePictureUrl : null);
            const pic = rawPic ? rawPic.trim() : null;
            setProfilePictureUrl(pic);
            setProfilePicturePreviewUrl(null);
            setImgError(false);
            if (typeof pd.latitude === 'number') setLat(pd.latitude);
            if (typeof pd.longitude === 'number') setLng(pd.longitude);
          }
        }
      } catch {}
      setNotice('Saved');
    } catch (e: any) {
      setNotice(e?.message || 'Failed');
    } finally {
      setSavingAll(false);
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
      // Reverse geocode (lightweight, client-side)
      const la = typeof lat === 'number' ? lat : undefined;
      const lo = typeof lng === 'number' ? lng : undefined;
      const latVal = la ?? (typeof lat === 'string' ? toNum(lat) : NaN);
      const lngVal = lo ?? (typeof lng === 'string' ? toNum(lng) : NaN);
      if (Number.isFinite(latVal) && Number.isFinite(lngVal)) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latVal}&lon=${lngVal}`;
        const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
        if (res.ok) {
          const data = await res.json();
          const addr = data?.address || {};
          setCity(addr.city || addr.town || addr.village || addr.county || "");
          setCountry(addr.country || "");
        }
      }
    } catch (e: any) {
      setNotice(e?.message || 'Failed to get location');
    }
  }
  async function saveLocation() {
    try {
      setSaving(true); setNotice(null);
      const token = (() => {
        try { const t = localStorage.getItem('auth_token'); if (t) return t; } catch {}
        try { const m = document.cookie.match(/(?:^|; )auth_token=([^;]+)/); return m ? decodeURIComponent(m[1]) : null; } catch {};
        return null;
      })();
      if (!token) throw new Error('Not authenticated');
      const latVal = typeof lat === 'number' ? lat : toNum(String(lat));
      const lngVal = typeof lng === 'number' ? lng : toNum(String(lng));
      const payload: any = {};
      if (city) payload.city = city;
      if (country) payload.country = country;
      if (Number.isFinite(latVal)) payload.latitude = latVal;
      if (Number.isFinite(lngVal)) payload.longitude = lngVal;
      const res = await fetch(`${apiBase}/profiles/me`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      setNotice('Saved');
    } catch (e: any) {
      setNotice(e?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  }
  const copy: Record<string, {
    h1: string; sub: string;
    heroTitle: string; heroSub: string;
    messagesTitle: string; noMessages: string; btnOpen: string;
    profileTitle: string; profileSub: string;
    labelFullName: string; labelRole: string; labelLanguages: string; labelSpecialties: string; labelCity: string; labelCountry: string; labelLat: string; labelLng: string;
    btnUseLocation: string; btnSave: string;
  }>= {
    en: {
      h1: "Professional portal",
      sub: "Welcome back. Here's a quick overview.",
      heroTitle: "Grow your practice with better visibility",
      heroSub: "Keep your profile complete, respond to inquiries quickly, and share resources to build trust.",
      messagesTitle: "Messages",
      noMessages: "No new messages",
      btnOpen: "Open",
      profileTitle: "Profile",
      profileSub: "Keep your details up to date so patients can find and contact you.",
      labelFullName: "Full name",
      labelRole: "Role",
      labelLanguages: "Languages",
      labelSpecialties: "Specialties",
      labelCity: "City",
      labelCountry: "Country",
      labelLat: "Lat",
      labelLng: "Lng",
      btnUseLocation: "Use my location",
      btnSave: "Save",
    },
    de: {
      h1: "Fachpersonen-Portal",
      sub: "Willkommen zurück. Eine kurze Übersicht.",
      heroTitle: "Mehr Sichtbarkeit für Ihre Praxis",
      heroSub: "Halten Sie Ihr Profil vollständig, antworten Sie schnell und teilen Sie Ressourcen, um Vertrauen aufzubauen.",
      messagesTitle: "Nachrichten",
      noMessages: "Keine neuen Nachrichten",
      btnOpen: "Öffnen",
      profileTitle: "Profil",
      profileSub: "Aktualisieren Sie Ihre Angaben, damit Patient:innen Sie finden und kontaktieren können.",
      labelFullName: "Vollständiger Name",
      labelRole: "Rolle",
      labelLanguages: "Sprachen",
      labelSpecialties: "Fachgebiete",
      labelCity: "Stadt",
      labelCountry: "Land",
      labelLat: "Breite",
      labelLng: "Länge",
      btnUseLocation: "Meinen Standort verwenden",
      btnSave: "Speichern",
    },
    fr: {
      h1: "Portail professionnel",
      sub: "Bon retour. Un aperçu rapide.",
      heroTitle: "Développez votre pratique avec plus de visibilité",
      heroSub: "Gardez votre profil complet, répondez vite et partagez des ressources pour instaurer la confiance.",
      messagesTitle: "Messages",
      noMessages: "Aucun nouveau message",
      btnOpen: "Ouvrir",
      profileTitle: "Profil",
      profileSub: "Mettez vos informations à jour pour être trouvé et contacté par les patient·e·s.",
      labelFullName: "Nom complet",
      labelRole: "Rôle",
      labelLanguages: "Langues",
      labelSpecialties: "Spécialités",
      labelCity: "Ville",
      labelCountry: "Pays",
      labelLat: "Lat",
      labelLng: "Lng",
      btnUseLocation: "Utiliser ma position",
      btnSave: "Enregistrer",
    },
  };
  const t = copy[lang] ?? copy.en;
  return (
    <main className={styles.wrapper}>
      <div className="container">
        {/* Top header bar */}
        <div className={styles.topBar}>
          <div className={styles.topLeft}>
            <span>Dashboard</span>
           
          </div>
          {/* <nav className={styles.topCenter} aria-label="Portal navigation">
            <a href="/portal/patient">Patients</a>
            <a href="/settings">Settings</a>
            <a href="/messages">Messages</a>
          </nav> */}
          <div className={styles.topRight}>
            <div className="d-inline-flex align-items-center ms-3">
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
                 <strong> {(name || dash?.welcomeName || 'P').slice(0,1)}</strong>
                </div>
              )}
              <span className="ms-2 fw-semibold">{name || dash?.welcomeName || ''}</span>
            </div>
          </div>
        </div>
        {needsLocation && (
          <div className="alert alert-warning mt-3" role="alert">
            Please complete your practice location (city, country, latitude and longitude) to be visible in the directory and enable patient contact.
          </div>
        )}
        <header className={styles.header}>
          <h1>{t.h1}</h1>
          <p>{t.sub}</p>
        </header>

        {/* Hero row with Messages (right) */}
        <section className={`${styles.section} ${styles.hero}`}>
          <div className={styles.columns}>
            <div>
              <div className={styles.heroCard}>
                <h3 className={styles.heroTitle}>{t.heroTitle}</h3>
                <p className={styles.heroSub}>{t.heroSub}</p>
                <div className={styles.metrics}>
                  <div className={styles.metric}><strong>{typeof (dash?.stats?.profileCompleteness) === 'number' ? `${dash.stats.profileCompleteness}%` : '70%'}</strong><span>Profile completeness</span></div>
                  <div className={styles.metric}><strong>{typeof (dash?.stats?.newInquiries) === 'number' ? dash.stats.newInquiries : 0}</strong><span>New inquiries</span></div>
                  <div className={styles.metric}><strong>{typeof (dash?.stats?.unreadMessages) === 'number' ? dash.stats.unreadMessages : 0}</strong><span>Unread messages</span></div>
                </div>
              </div>
            </div>
            <div>
              <div className={styles.card}>
                <div className={styles.sectionTitle}>{t.messagesTitle}</div>
                <ul className={styles.list}>
                  <li className={styles.listItem}><span>{t.noMessages}</span><button style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid var(--brand-primary)"}} className="btn btn-sm" disabled>{t.btnOpen}</button></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Profile & Location (combined) */}
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
                <div className="text-muted small">Profile picture</div>
                <label className="btn btn-sm" style={{backgroundColor:"var(--brand-primary)", color:"white", border:"1px solid var(--brand-primary)"}}>
                  Change photo
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); }} />
                </label>
                {profilePictureFile && (
                  <button type="button" className="btn btn-sm ms-2" onClick={uploadSelectedPhoto} style={{backgroundColor:"#0ea5e9", color:"white", border:"1px solid #0ea5e9"}}>
                    Upload photo
                  </button>
                )}
              </div>
            </div>
            <div className="row g-2">
              <div className="col-md-4">
                <label className="form-label">{t.labelFullName}</label>
                <input className="form-control" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} disabled />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t.labelRole}</label>
                <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="doctor">Doctor</option>
                  <option value="dietitian">Dietitian</option>
                  <option value="nutritionist">Nutritionist</option>
                  <option value="coach">Health Coach</option>
                  <option value="therapist">Therapist</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">{t.labelLanguages}</label>
                <input className="form-control" placeholder="Languages" value={languages} onChange={(e) => setLanguages(e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label">{t.labelSpecialties}</label>
                <input className="form-control" placeholder="Specialties" value={specialties} onChange={(e) => setSpecialties(e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label">Bio</label>
                <textarea className="form-control" placeholder="Short bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>

              <div className="col-md-4">
                <label className="form-label">Phone</label>
                <input className="form-control" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              {/* bottom photo controls removed per request */}

              <div className="col-md-4">
                <label className="form-label">{t.labelCity}</label>
                <input className="form-control" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="col-md-4">
                <label className="form-label">{t.labelCountry}</label>
                <input className="form-control" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">{t.labelLat}</label>
                <input className="form-control" placeholder="Lat" value={lat} onChange={(e) => setLat(e.target.value as any)} />
              </div>
              <div className="col-md-2">
                <label className="form-label">{t.labelLng}</label>
                <input className="form-control" placeholder="Lng" value={lng} onChange={(e) => setLng(e.target.value as any)} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-5">
              <button style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid var(--brand-primary)"}} className="btn btn-outline-secondary btn-sm" onClick={useMyLocation}>{t.btnUseLocation}</button>
              <button style={{backgroundColor:"var(--brand-primary)",color:"white", border: "1px solid var(--brand-primary)"}} className="btn btn-primary btn-sm" onClick={saveAll} disabled={savingAll}>{savingAll ? 'Saving…' : t.btnSave}</button>
              {notice ? <span className="text-muted small ms-2">{notice}</span> : null}
            </div>
          </div>
        </section>

        {/* Messages shown on right of hero; bottom section removed */}
      </div>
      <Footer />
    </main>
  );
}
