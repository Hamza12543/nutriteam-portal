"use client";
import styles from "./page.module.scss";
import Footer from "../components/Footer";
import { useLanguage } from "../providers/LanguageProvider";

export default function FaqPage() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    h1: string;
    sub: string;
    qa: Array<{ q: string; a: string }>;
    contact: string;
  }> = {
    en: {
      h1: "Frequently Asked Questions",
      sub: "Answers about OmniCheck Network for patients and professionals.",
      qa: [
        { q: "What is OmniCheck Network?", a: "A platform connecting patients with verified professionals across functional, preventative and holistic healthcare." },
        { q: "Is it free to join?", a: "Browsing is free. Advanced features for professionals may require a plan in the future." },
        { q: "How do I find professionals?", a: "Use the Directory page to search by city, country or profession and explore profiles on the map." },
        { q: "Which countries are supported?", a: "We cover most of Europe and are expanding continuously." },
        { q: "How is my data protected?", a: "We follow privacy-by-design principles and only collect what is necessary to offer our services." },
      ],
      contact: "Still have questions? Contact us",
    },
    de: {
      h1: "Häufige Fragen",
      sub: "Antworten zum OmniCheck Network für Patient:innen und Fachpersonen.",
      qa: [
        { q: "Was ist das OmniCheck Network?", a: "Eine Plattform, die Patient:innen mit verifizierten Fachpersonen aus der funktionellen, präventiven und ganzheitlichen Medizin verbindet." },
        { q: "Ist die Nutzung kostenlos?", a: "Das Stöbern ist kostenlos. Erweiterte Funktionen für Fachpersonen können künftig kostenpflichtig sein." },
        { q: "Wie finde ich Fachpersonen?", a: "Nutzen Sie die Verzeichnis-Seite, um nach Stadt, Land oder Beruf zu suchen und Profile auf der Karte zu entdecken." },
        { q: "Welche Länder werden unterstützt?", a: "Wir decken den Großteil Europas ab und erweitern unser Angebot fortlaufend." },
        { q: "Wie werden meine Daten geschützt?", a: "Wir folgen Privacy-by-Design und erheben nur notwendige Daten." },
      ],
      contact: "Noch Fragen? Kontaktieren Sie uns",
    },
    fr: {
      h1: "Questions fréquentes",
      sub: "Réponses à propos de OmniCheck Network pour patients et professionnels.",
      qa: [
        { q: "Qu’est-ce que OmniCheck Network ?", a: "Une plateforme reliant des patients à des professionnels vérifiés en santé fonctionnelle, préventive et holistique." },
        { q: "Est-ce gratuit ?", a: "La consultation est gratuite. Des fonctionnalités avancées pour les professionnels pourront être payantes." },
        { q: "Comment trouver des professionnels ?", a: "Utilisez l’Annuaire pour rechercher par ville, pays ou profession et explorez les profils sur la carte." },
        { q: "Quels pays sont pris en charge ?", a: "La plupart de l’Europe, avec une expansion continue." },
        { q: "Comment mes données sont-elles protégées ?", a: "Nous appliquons une approche privacy-by-design et collectons uniquement le nécessaire." },
      ],
      contact: "Encore des questions ? Contactez-nous",
    },
  };

  const t = copy[lang] ?? copy.en;

  return (
    <main className={styles.wrapper}>
      <div className={styles.heroBg} />
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>{t.h1}</h1>
          <p className={styles.subtitle}>{t.sub}</p>
        </div>
      </section>

      <section className={styles.content}> 
        <div className="container">
          <div className={`accordion ${styles.accordion}`} id="faq">
            {t.qa.map((item, idx) => {
              const headerId = `faq-h-${idx}`;
              const collapseId = `faq-c-${idx}`;
              const isFirst = idx === 0;
              return (
                <div className="accordion-item" key={idx}>
                  <h2 className="accordion-header" id={headerId}>
                    <button
                      className={`accordion-button ${!isFirst ? 'collapsed' : ''} ${styles.q}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${collapseId}`}
                      aria-expanded={isFirst}
                      aria-controls={collapseId}
                    >
                      {item.q}
                    </button>
                  </h2>
                  <div
                    id={collapseId}
                    className={`accordion-collapse collapse ${isFirst ? 'show' : ''}`}
                    aria-labelledby={headerId}
                    data-bs-parent="#faq"
                  >
                    <div className={`accordion-body ${styles.a}`}>{item.a}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.cta}> 
            <a style={{ backgroundColor: "#0c6172", borderColor: "#0c6172" }} href="/about" className="btn btn-primary">{t.contact}</a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
