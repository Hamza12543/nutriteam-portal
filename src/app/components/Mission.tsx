"use client";
import styles from "./Mission.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import MissionImg from '../assets/images/Mission-scaled.jpg'

export default function Mission() {
  const { lang } = useLanguage();

  const copy: Record<string, { title: string; p1: string; p2: string; more: string }> = {
    en: {
      title: "Our mission",
      p1: "We want to connect people — share knowledge — and make functional medicine visible in German‑speaking countries.",
      p2: "Together we are shaping the future of medicine that focuses on prevention, individuality and sustainability.",
      more: "More",
    },
    de: {
      title: "Unsere Mission",
      p1: "Wir möchten Menschen verbinden – Wissen teilen – und die Funktionelle Medizin im deutschsprachigen Raum sichtbar machen.",
      p2: "Gemeinsam gestalten wir die Zukunft der Medizin – mit Fokus auf Prävention, Individualität und Nachhaltigkeit.",
      more: "Mehr",
    },
    fr: {
      title: "Notre mission",
      p1: "Nous voulons connecter les personnes, partager les connaissances et rendre la médecine fonctionnelle visible dans l’espace germanophone.",
      p2: "Ensemble, nous façonnons l’avenir de la médecine, axé sur la prévention, l’individualité et la durabilité.",
      more: "En savoir plus",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <section className={`${styles.mission} container`}>
      <div className="row align-items-center g-4">
          <div className="col-lg-6">
          <h2 className={styles.title}>{t.title}</h2>
          {/* <div className={styles.underline}></div> */}
          <p className={styles.lead}>{t.p1}</p>
          <p className={styles.lead}>{t.p2}</p>
        </div>
        <div className="col-lg-6">
          {/* Replace the src path with your actual file if different */}
          <div className="position-relative">
            <img
              src={MissionImg.src}
              alt={t.title}
              className="img-fluid rounded"
              onError={(e) => {
                // Hide broken image and show fallback visual
                const img = e.currentTarget as unknown as HTMLImageElement;
                (img as any).style.display = 'none';
                const fallback = (img.parentElement?.querySelector(`.${styles.visual}`) as HTMLElement);
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className={styles.visual} aria-hidden="true" style={{display:'none'}} />
          </div>
        </div>
         
      </div>
    </section>
  );
}
