"use client";
import styles from "./Professionals.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import ProsImg from "../assets/images/Fachpersonen-scaled.jpg";

export default function Professionals() {
  const { lang } = useLanguage();

  const copy: Record<string, { title: string; p1: string; p2: string; more: string }> = {
    en: {
      title: "For professionals",
      p1: "Our network offers doctors and therapists a platform for exchange, further education and collaboration.",
      p2: "We promote interdisciplinary cooperation, evidence-based approaches, and the shared goal of treating causes rather than symptoms.",
      more: "More",
    },
    de: {
      title: "Für Fachpersonen",
      p1: "Unser Netzwerk bietet Ärzt:innen und Therapeut:innen eine Plattform für Austausch, Weiterbildung und Zusammenarbeit.",
      p2: "Wir fördern die interdisziplinäre Zusammenarbeit, evidenzbasierte Ansätze und das gemeinsame Ziel, Ursachen statt Symptome zu behandeln.",
      more: "Mehr",
    },
    fr: {
      title: "Pour les professionnel·le·s",
      p1: "Notre réseau offre aux médecins et thérapeutes une plateforme d'échange, de formation continue et de collaboration.",
      p2: "Nous promouvons la coopération interdisciplinaire, les approches fondées sur des preuves et l'objectif commun de traiter les causes plutôt que les symptômes.",
      more: "En savoir plus",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className="row align-items-center g-4">
          {/* Text card on the left */}
          <div className="col-lg-6 order-2 order-lg-1">
            <div className={styles.card}>
              <h2 className={styles.title}>{t.title}</h2>
              {/* <div className={styles.underline}></div> */}
              <p className={styles.lead}>{t.p1}</p>
              <p className={styles.lead}>{t.p2}</p>
              {/* <a href="#" className={styles.cta}>{t.more}</a> */}
            </div>
          </div>
          {/* Image on the right */}
          <div className="col-lg-6 order-1 order-lg-2">
            <div className={styles.imageWrap}>
              <img
                src={ProsImg.src}
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
        </div>
      </div>
    </section>
  );
}
