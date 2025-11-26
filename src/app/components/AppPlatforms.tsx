"use client";
import styles from "./AppPlatforms.module.scss";
import { useLanguage } from "../providers/LanguageProvider";
import Omniweb from '../assets/images/web-nutri-laptop.png'
import Omniapp from '../assets/images/mob-nutri.png'
import playStore from '../assets/images/google-play.png'
import appStore from '../assets/images/app-store.png' 

export default function AppPlatforms() {
  const { lang } = useLanguage();
  const t: Record<string, any> = {
    en: {
      mobile: {
        heading: "Mobile App",
        desc:
          "Use our mobile app to access all features on the go with fast performance and full functionality in your pocket.",
        bullets: ["iOS & Android", "Offline mode", "Push notifications"],
      },
      web: {
        heading: "Web App",
        desc:
          "Use our web app from anywhere. Full functionality in the browser with modern design and optimal performance on all devices.",
        bullets: ["Responsive design", "Cloud sync", "Real‑time collaboration"],
      },
    },
    de: {
      mobile: {
        heading: "Mobile App",
        desc:
          "Unsere mobile App bietet dir Zugriff auf alle Features unterwegs. Intuitive Bedienung, schnelle Performance und vollständige Funktionalität in deiner Hosentasche.",
        bullets: ["iOS & Android", "Offline‑Modus", "Push‑Benachrichtigungen"],
      },
      web: {
        heading: "Web App",
        desc:
          "Nutze unsere Web‑App von überall aus. Vollständige Funktionalität im Browser mit modernem Design und optimaler Performance auf allen Geräten.",
        bullets: [
          "Responsive Design",
          "Cloud‑Synchronisation",
          "Echtzeit‑Zusammenarbeit",
        ],
      },
    },
    fr: {
      mobile: {
        heading: "Application mobile",
        desc:
          "Notre app mobile vous donne accès à toutes les fonctionnalités en déplacement, avec des performances rapides et une expérience complète.",
        bullets: ["iOS et Android", "Mode hors ligne", "Notifications push"],
      },
      web: {
        heading: "Application Web",
        desc:
          "Utilisez notre application Web de n'importe où. Fonctionnalités complètes dans le navigateur avec un design moderne et des performances optimales.",
        bullets: [
          "Design responsive",
          "Synchronisation cloud",
          "Collaboration en temps réel",
        ],
      },
    },
  };
  const copy = t[lang] ?? t.en;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {/* Mobile card */}
          <article className={styles.card}>
            <div className={styles.mediaWrap}>
              <img
                className={styles.media}
                src={Omniapp.src}
                alt="Mobile app preview"
                loading="lazy"
              />
            </div>
            <div className={styles.body}>
              <div className={styles.headingRow}>
                <span className={`${styles.icon} ${styles.iconMobile}`} aria-hidden>
                  📱
                </span>
                <h3 className={styles.title}>{copy.mobile.heading}</h3>
              </div>
              <p className={styles.desc}>{copy.mobile.desc}</p>
              <ul className={styles.list}>
                {copy.mobile.bullets.map((b: string) => (
                  <li key={b}>
                    <span className={`${styles.check} ${styles.checkGreen}`} aria-hidden>
                      ✓
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className={styles.storeBadges}>
                <a
                  className={`${styles.badge} ${styles.badgeApple}`}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                >
                  <img
                    className={styles.badgeImg}
                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                    alt="Download on the App Store"
                  />
                </a>
                <a
                  className={`${styles.badge} ${styles.badgeGoogle}`}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get it on Google Play"
                >
                  <img
                    className={styles.badgeImg}
                    src={playStore.src}
                    alt="Get it on Google Play"
                  />
                </a>
              </div>
            </div>
          </article>

          {/* Web card */}
          <article className={styles.card}>
            <div className={styles.mediaWrap}>
              <img
                className={styles.media}
                src={Omniweb.src}
                alt="Web app preview on laptop"
                loading="lazy"
              />
            </div>
            <div className={styles.body}>
              <div className={styles.headingRow}>
                <span className={`${styles.icon} ${styles.iconWeb}`} aria-hidden>
                  🌐
                </span>
                <h3 className={styles.title}>{copy.web.heading}</h3>
              </div>
              <p className={styles.desc}>{copy.web.desc}</p>
              <ul className={styles.list}>
                {copy.web.bullets.map((b: string) => (
                  <li key={b}>
                    <span className={`${styles.check} ${styles.checkBlue}`} aria-hidden>
                      ●
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
              <div className={styles.actions}>
                <a href="/portal" className={styles.primaryBtn}>Open Web App</a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
