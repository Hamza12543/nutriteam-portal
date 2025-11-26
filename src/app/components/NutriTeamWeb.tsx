"use client";
import styles from "./NutriTeamWeb.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import MockImage from '../assets/images/nutriTeam-mockup.png'

export default function NutriTeamWeb() {
  const { lang } = useLanguage();
  const copy: Record<string, { title: string;  desc: string; longDesc: string; cta: string }>= {
    en: {
      title: "OmniCheck Health Assistant",
      // sub: "AI-powered guidance for faster insights.",
      desc: "Start with a quick AI assessment to receive personalized suggestions and next steps. Safe, private, and fast.",
      longDesc: "Personalized nutrition coaching — Our certified nutritionists provide you with customized plans and ongoing support on your weight loss journey. Using our advanced LLM model aligned with Mediterranean Diet, Hormone Balance, Microbiome Optimization and Fitness, we deliver precise, evidence-based recommendations. Our AI-powered application analyzes your individual needs and creates personalized nutritional strategies to take your health to a new level. Start your transformation today and experience the precision and efficiency of data-driven nutrition coaching.",
      cta: "Open Health Assistant",
    },
    de: {
      title: "OmniCheck Health Assistant",
      // sub: "KI-gestützte Orientierung für schnelle Einblicke.",
      desc: "Beginnen Sie mit einer kurzen KI‑Einschätzung und erhalten Sie personalisierte Vorschläge und nächste Schritte. Sicher, privat und schnell.",
      longDesc: "Personalisierte Ernährungsberatung — Unsere zertifizierten Ernährungsexpert:innen erstellen individuelle Pläne und begleiten Sie kontinuierlich auf Ihrem Weg zur Gewichtsreduktion. Mit unserem fortschrittlichen LLM‑Modell, abgestimmt auf mediterrane Ernährung, Hormonbalance, Mikrobiom‑Optimierung und Fitness, liefern wir präzise, evidenzbasierte Empfehlungen. Unsere KI‑gestützte Anwendung analysiert Ihre individuellen Bedürfnisse und entwickelt personalisierte Ernährungsstrategien, die Ihre Gesundheit auf das nächste Level heben. Starten Sie Ihre Transformation noch heute und erleben Sie Präzision und Effizienz datengetriebener Ernährungsberatung.",
      cta: "Health Assistant öffnen",
    },
    fr: {
      title: "OmniCheck Assistant santé",
      // sub: "Conseils rapides grâce à l’IA.",
      desc: "Lancez une évaluation IA rapide pour obtenir des suggestions personnalisées et des prochaines étapes. Sûr, privé et rapide.",
      longDesc: "Coaching nutritionnel personnalisé — Nos nutritionnistes certifiés vous proposent des plans sur mesure et un accompagnement continu dans votre parcours de perte de poids. Grâce à notre modèle LLM avancé, aligné avec le régime méditerranéen, l’équilibre hormonal, l’optimisation du microbiome et la condition physique, nous fournissons des recommandations précises et fondées sur des preuves. Notre application propulsée par l’IA analyse vos besoins individuels et conçoit des stratégies nutritionnelles personnalisées pour porter votre santé à un niveau supérieur. Commencez votre transformation dès aujourd’hui et découvrez la précision et l’efficacité d’un coaching nutritionnel guidé par les données.",
      cta: "Ouvrir l’Assistant santé",
    },
  };
  const t = copy[lang] ?? copy.en;
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrap}>
       
          <div className={styles.mock}>
            <img className={styles.mockImg} src={MockImage.src} alt="NutriTeam mockup" />
          </div>
             <div>
            <h2 className={styles.title}>{t.title}</h2>
            {/* <p className={styles.subtitle}>{t.sub}</p> */}
            <p className={styles.desc}>{t.desc}</p>
            <p className={styles.desc}>{t.longDesc}</p>
            <a className={styles.badgeLink} href="https://ki.nutriteam.ch/?utm_source=nutriteam-network&utm_medium=homepage&utm_campaign=health-assistant" target="_blank" rel="noopener noreferrer">
              <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none"><path d="M3 12h18M12 3v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              <span>{t.cta}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
