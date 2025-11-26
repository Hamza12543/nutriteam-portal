"use client";
import styles from "./Patients.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import PatientsImg from "../assets/images/Blumenwiese-scaled.jpg";

export default function Patients() {
  const { lang } = useLanguage();

  const copy: Record<string, { title: string; p1: string; p2: string; more: string }> = {
    en: {
      title: "For patients",
      p1: "Are you looking for competent contacts who think outside the box and take time for your individual health?",
      p2: "In our network you will find qualified experts from all over Switzerland who combine functional medicine with scientific competence, empathy and holistic thinking.",
      more: "More",
    },
    de: {
      title: "Für Patient:innen",
      p1: "Suchen Sie kompetente Ansprechpersonen, die über den Tellerrand hinausdenken und sich Zeit für Ihre individuelle Gesundheit nehmen?",
      p2: "In unserem Netzwerk finden Sie qualifizierte Expert:innen aus der ganzen Schweiz, die funktionelle Medizin mit wissenschaftlicher Kompetenz, Empathie und ganzheitlichem Denken verbinden.",
      more: "Mehr",
    },
    fr: {
      title: "Pour les patient·e·s",
      p1: "Vous recherchez des interlocuteurs compétents qui pensent différemment et prennent le temps pour votre santé individuelle ?",
      p2: "Dans notre réseau, vous trouverez des experts qualifiés de toute la Suisse qui allient médecine fonctionnelle, compétence scientifique, empathie et pensée holistique.",
      more: "En savoir plus",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <div className={styles.imageWrap}>
              <img
                src={PatientsImg.src}
                alt={t.title}
                className={styles.image}
                onError={(e) => {
                  const img = e.currentTarget as unknown as HTMLImageElement;
                  (img as any).style.display = "none";
                  const fallback = img.parentElement?.querySelector(`.${styles.visual}`) as HTMLElement;
                  if (fallback) fallback.style.display = "block";
                }}
              />
              <div className={styles.visual} aria-hidden="true" style={{ display: "none" }} />
            </div>
          </div>
          <div className="col-lg-6">
            <div className={styles.card}>
              <h2 className={styles.title}>{t.title}</h2>
              {/* <div className={styles.underline}></div> */}
              <p className={styles.lead}>{t.p1}</p>
              <p className={styles.lead}>{t.p2}</p>
              {/* <a href="#" className={styles.cta}>{t.more}</a> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
