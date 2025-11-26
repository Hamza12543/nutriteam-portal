"use client";
import styles from "./MobileApp.module.scss";
import { useLanguage } from "../providers/LanguageProvider";

export default function MobileApp() {
  const { lang } = useLanguage();
  const copy: Record<string, {
    title: string;
    subtitle: string;
    desc: string;
    f1: string;
    f2: string;
    f3: string;
    getApp: string;
    learnMore: string;
  }> = {
    en: {
      title: "OmniCheck AI Mobile App",
      subtitle: "Your health companion — anywhere, anytime.",
      desc: "Track your wellness journey and access resources on the go. Keep your personal plan and reminders in your pocket.",
      f1: "Personal plan and reminders",
      f2: "Track habits and goals",
      f3: "Resources and guidance, offline-ready",
      getApp: "Get the app",
      learnMore: "Learn more",
    },
    de: {
      title: "OmniCheck AI Mobile-App",
      subtitle: "Ihr Gesundheitsbegleiter – jederzeit und überall.",
      desc: "Verfolgen Sie Ihren Gesundheitsweg und greifen Sie unterwegs auf Ressourcen zu. Persönlicher Plan und Erinnerungen immer griffbereit.",
      f1: "Persönlicher Plan und Erinnerungen",
      f2: "Fortschritt und Gewohnheiten verfolgen",
      f3: "Ressourcen und Leitfäden, offline verfügbar",
      getApp: "App herunterladen",
      learnMore: "Mehr erfahren",
    },
    fr: {
      title: "Application mobile OmniCheck AI",
      subtitle: "Votre compagnon santé – partout, à tout moment.",
      desc: "Suivez votre parcours et accédez aux ressources en mobilité. Conservez votre plan personnalisé et vos rappels à portée de main.",
      f1: "Plan personnalisé et rappels",
      f2: "Suivi des habitudes et objectifs",
      f3: "Ressources et guides, accessibles hors‑ligne",
      getApp: "Télécharger l’app",
      learnMore: "En savoir plus",
    },
  };
  const t = copy[lang] ?? copy.en;
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrap}>
          <div className={styles.stage}>
            <div className={styles.phoneWrap}>
              <div className={styles.iphone}>
                <div className={styles.iphoneScreen}>
                  <video
                    className={styles.iphoneImg}
                    src={"/assets/video/app-video.mp4"}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className={styles.title}>{t.title}</h2>
            <p className={styles.subtitle}>{t.subtitle}</p>
            <p className={styles.desc}>{t.desc}</p>
            <ul className="mt-2" style={{color:'#475569'}}>
              <li>{t.f1}</li>
              <li>{t.f2}</li>
              <li>{t.f3}</li>
            </ul>
            <div className={styles.storeBadges}>
              <a className={styles.badge} href="#" target="_blank" rel="noopener noreferrer" aria-label="Download on the App Store">
                <img className={styles.badgeImg} src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" />
              </a>
              <a className={styles.badge} href="#" target="_blank" rel="noopener noreferrer" aria-label="Get it on Google Play">
                <img className={styles.badgeImg} src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
