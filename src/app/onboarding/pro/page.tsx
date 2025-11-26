"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";

type ProProfile = {
  name: string;
  category: "doctor" | "therapist" | "nutrition" | "";
  languages: string;
  bio: string;
  city: string;
  country: string;
  lat?: number | "";
  lng?: number | "";
  website?: string;
  contact?: string;
};

const STORAGE_KEY = "pro_onboarding";

function loadDraft(): ProProfile {
  if (typeof window === "undefined") return { name: "", category: "", languages: "", bio: "", city: "", country: "", lat: "", lng: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { name: "", category: "", languages: "", bio: "", city: "", country: "", lat: "", lng: "" };
    const parsed = JSON.parse(raw);
    return { name: "", category: "", languages: "", bio: "", city: "", country: "", lat: "", lng: "", ...parsed } as ProProfile;
  } catch { return { name: "", category: "", languages: "", bio: "", city: "", country: "", lat: "", lng: "" }; }
}

function saveDraft(d: ProProfile) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch {}
}

export default function ProOnboardingPage() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    title: string; exit: string; noticeNameCat: string; noticeCityCountry: string; geoNotSupported: string; geoFail: string;
    profile: string; location: string; review: string;
    fullName: string; category: string; select: string; doctor: string; therapist: string; nutrition: string; chemist: string;
    languages: string; languagesPh: string; website: string; websitePh: string; contact: string; contactPh: string; bio: string;
    city: string; country: string; back: string; next: string; useMyLoc: string; finish: string;
    rName: string; rCategory: string; rLanguages: string; rCity: string; rCountry: string;
  }> = {
    en: {
      title: "Professional Onboarding", exit: "Exit", noticeNameCat: "Please fill name and category.", noticeCityCountry: "Please set city and country.", geoNotSupported: "Geolocation not supported", geoFail: "Unable to get current location",
      profile: "Profile", location: "Location", review: "Review",
      fullName: "Full name", category: "Category", select: "Select", doctor: "Doctor", therapist: "Therapist", nutrition: "Nutrition", chemist: "Chemist",
      languages: "Languages", languagesPh: "e.g., English, German", website: "Website", websitePh: "e.g., https://nutriteam.ch", contact: "Contact", contactPh: "e.g., +4131371722", bio: "Short bio",
      city: "City", country: "Country", back: "Back", next: "Next", useMyLoc: "Use my location", finish: "Finish",
      rName: "Name", rCategory: "Category", rLanguages: "Languages", rCity: "City", rCountry: "Country",
    },
    de: {
      title: "Onboarding für Fachpersonen", exit: "Beenden", noticeNameCat: "Bitte Name und Kategorie ausfüllen.", noticeCityCountry: "Bitte Stadt und Land angeben.", geoNotSupported: "Geolokalisierung nicht unterstützt", geoFail: "Aktueller Standort kann nicht ermittelt werden",
      profile: "Profil", location: "Standort", review: "Überprüfung",
      fullName: "Vollständiger Name", category: "Kategorie", select: "Auswählen", doctor: "Ärzt:in", therapist: "Therapeut:in", nutrition: "Ernährung", chemist: "Chemiker:in",
      languages: "Sprachen", languagesPh: "z. B. Deutsch, Englisch", website: "Website", websitePh: "z. B. https://nutriteam.ch", contact: "Kontakt", contactPh: "z. B. +4131371722", bio: "Kurzprofil",
      city: "Stadt", country: "Land", back: "Zurück", next: "Weiter", useMyLoc: "Meinen Standort verwenden", finish: "Abschließen",
      rName: "Name", rCategory: "Kategorie", rLanguages: "Sprachen", rCity: "Stadt", rCountry: "Land",
    },
    fr: {
      title: "Onboarding professionnel", exit: "Quitter", noticeNameCat: "Veuillez renseigner le nom et la catégorie.", noticeCityCountry: "Veuillez indiquer la ville et le pays.", geoNotSupported: "Géolocalisation non prise en charge", geoFail: "Impossible d’obtenir la position actuelle",
      profile: "Profil", location: "Localisation", review: "Relecture",
      fullName: "Nom complet", category: "Catégorie", select: "Sélectionner", doctor: "Médecin", therapist: "Thérapeute", nutrition: "Nutrition", chemist: "Chimiste",
      languages: "Langues", languagesPh: "ex. Français, Allemand", website: "Site web", websitePh: "ex. https://nutriteam.ch", contact: "Contact", contactPh: "ex. +4131371722", bio: "Courte bio",
      city: "Ville", country: "Pays", back: "Retour", next: "Suivant", useMyLoc: "Utiliser ma position", finish: "Terminer",
      rName: "Nom", rCategory: "Catégorie", rLanguages: "Langues", rCity: "Ville", rCountry: "Pays",
    },
  };
  const t = copy[lang] ?? copy.en;
  const [step, setStep] = useState<1|2|3>(1);
  const [draft, setDraft] = useState<ProProfile>(loadDraft);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => { saveDraft(draft); }, [draft]);

  function next() {
    setNotice(null);
    if (step === 1) {
      if (!draft.name || !draft.category) { setNotice(t.noticeNameCat); return; }
      setStep(2);
    } else if (step === 2) {
      if (!draft.city || !draft.country) { setNotice(t.noticeCityCountry); return; }
      setStep(3);
    }
  }
  function back() { setStep((s) => (s === 1 ? 1 : ((s-1) as any))); }

  function useMyLocation() {
    if (!navigator.geolocation) { setNotice(t.geoNotSupported); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude; const lng = pos.coords.longitude;
      setDraft((d) => ({ ...d, lat, lng }));
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
        if (res.ok) {
          const data = await res.json();
          const addr = data?.address || {};
          setDraft((d) => ({ ...d, city: d.city || addr.city || addr.town || addr.village || addr.county || "", country: d.country || addr.country || "" }));
        }
      } catch {}
    }, () => setNotice(t.geoFail), { enableHighAccuracy: true, timeout: 8000 });
  }

  function finish() {
    // Frontend-only: pretend it's saved and route to professional portal
    try { localStorage.setItem("pro_profile_complete", "1"); } catch {}
    window.location.href = "/portal/professional";
  }

  return (
    <main style={{ paddingTop: 140, paddingBottom: 40 }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h1 className="h4 m-0">{t.title}</h1>
          <Link href="/" className="btn btn-outline-secondary btn-sm">{t.exit}</Link>
        </div>
        <div className="mb-3">
          <div className="progress" style={{ height: 6 }}>
            <div className="progress-bar" role="progressbar" style={{ width: `${step*33.34}%` }} />
          </div>
        </div>
        {notice ? <div className="alert alert-warning py-2">{notice}</div> : null}

        {step === 1 && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">{t.profile}</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">{t.fullName}</label>
                  <input className="form-control" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">{t.category}</label>
                  <select className="form-select" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value as any })}>
                    <option value="">{t.select}</option>
                    <option value="doctor">{t.doctor}</option>
                    <option value="therapist">{t.therapist}</option>
                    <option value="nutrition">{t.nutrition}</option>
                    <option value="chemist">{t.chemist}</option>
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">{t.languages}</label>
                  <input className="form-control" placeholder={t.languagesPh} value={draft.languages} onChange={(e) => setDraft({ ...draft, languages: e.target.value })} />
                </div>
<div className="col-6">
                  <label className="form-label">{t.website}</label>
                  <input className="form-control" placeholder={t.websitePh} value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">{t.contact}</label>
                  <input className="form-control" placeholder={t.contactPh} value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label">{t.bio}</label>
                  <textarea className="form-control" rows={3} value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} />
                </div>
                
              </div>
              <div className="d-flex justify-content-end gap-2 mt-3">
                <button className="btn btn-primary" onClick={next}>{t.next}</button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">{t.location}</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">{t.city}</label>
                  <input className="form-control" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">{t.country}</label>
                  <input className="form-control" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
                </div>
                {/* <div className="col-md-6">
                  <label className="form-label">Latitude</label>
                  <input className="form-control" value={draft.lat ?? ""} onChange={(e) => {
                    const v = e.target.value;
                    setDraft({ ...draft, lat: v === "" ? "" : Number(v) });
                  }} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Longitude</label>
                  <input className="form-control" value={draft.lng ?? ""} onChange={(e) => {
                    const v = e.target.value;
                    setDraft({ ...draft, lng: v === "" ? "" : Number(v) });
                  }} />
                </div> */}
              </div>
              <div className="d-flex justify-content-between gap-2 mt-3">
                <button className="btn btn-outline-secondary" onClick={back}>{t.back}</button>
                <div className="d-flex gap-2">
                  <button className="btn btn-outline-secondary" onClick={useMyLocation}>{t.useMyLoc}</button>
                  <button className="btn btn-primary" onClick={next}>{t.next}</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-3">{t.review}</h5>
              <ul className="list-group mb-3">
                <li className="list-group-item d-flex justify-content-between"><span>{t.rName}</span><strong>{draft.name || "—"}</strong></li>
                <li className="list-group-item d-flex justify-content-between"><span>{t.rCategory}</span><strong>{draft.category || "—"}</strong></li>
                <li className="list-group-item d-flex justify-content-between"><span>{t.rLanguages}</span><strong>{draft.languages || "—"}</strong></li>
                <li className="list-group-item d-flex justify-content-between"><span>{t.rCity}</span><strong>{draft.city || "—"}</strong></li>
                <li className="list-group-item d-flex justify-content-between"><span>{t.rCountry}</span><strong>{draft.country || "—"}</strong></li>
              </ul>
              <div className="d-flex justify-content-between gap-2">
                <button className="btn btn-outline-secondary" onClick={back}>{t.back}</button>
                <button className="btn btn-success" onClick={finish}>{t.finish}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
