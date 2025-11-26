"use client";
import styles from "./FindDoctor.module.scss";
import { useRouter } from "next/navigation";
import { useLanguage } from "../providers/LanguageProvider";

export default function FindDoctor() {
  const router = useRouter();
  const { lang } = useLanguage();

  const copy: Record<string, {
    kicker: string; heading: string; sub: string;
    namePH: string; specPH: string; locPH: string; btn: string;
  }> = {
    en: { kicker: "Find A Doctor", heading: "Discover Your Ideal Medical Specialist", sub: "Connect with our network of certified healthcare professionals across all medical disciplines", namePH: "Search by name…", specPH: "Select specialty", locPH: "All locations", btn: "Search" },
    de: { kicker: "Arzt/Ärztin finden", heading: "Finden Sie Ihre passende Fachperson", sub: "Verbinden Sie sich mit unserem Netzwerk zertifizierter Gesundheitsfachpersonen", namePH: "Nach Name suchen…", specPH: "Fachgebiet wählen", locPH: "Alle Orte", btn: "Suchen" },
    fr: { kicker: "Trouver un médecin", heading: "Trouvez votre spécialiste idéal", sub: "Connectez-vous à notre réseau de professionnels de santé certifiés", namePH: "Rechercher par nom…", specPH: "Choisir une spécialité", locPH: "Tous les lieux", btn: "Rechercher" },
  };
  const t = copy[lang] ?? copy.en;

  function goDirectory(e?: React.FormEvent) {
    if (e) e.preventDefault();
    router.push("/directory");
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.kicker}>{t.kicker}</div>
          <div className={styles.rule}></div>
          <h2 className={styles.title}>{t.heading}</h2>
          <p className={styles.sub}>{t.sub}</p>
        </div>

        <form className={styles.panel} onSubmit={goDirectory}>
          <div className="row g-3 align-items-center">
            <div className="col-lg-4">
              <label className="form-label small">Practitioner Name</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="2"/><path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
                <input type="text" className="form-control" placeholder={t.namePH} aria-label={t.namePH} />
              </div>
            </div>
            <div className="col-lg-4">
              <label className="form-label small">Medical Specialty</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/></svg></span>
                <input type="text" className="form-control" placeholder={t.specPH} aria-label={t.specPH} />
              </div>
            </div>
            <div className="col-lg-3">
              <label className="form-label small">Location</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-0"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10Z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="11" r="2" fill="currentColor"/></svg></span>
                <input type="text" className="form-control" placeholder={t.locPH} aria-label={t.locPH} />
              </div>
            </div>
            <div className="col-lg-1 d-flex align-items-end">
              <button type="submit" className={styles.goBtn} aria-label={t.btn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
