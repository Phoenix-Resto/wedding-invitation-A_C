"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Languages, RotateCcw, ArrowDown, Sparkles } from "lucide-react";
import { FloralCorner } from "./FloralCorner";
import { PetalField } from "./PetalField";
import { WeddingStory } from "./WeddingStory";
import { invitation, type Language } from "../config/invitation";

type Stage = "closed" | "opening" | "revealed";

export function InvitationExperience() {
  const [language, setLanguage] = useState<Language>("en");
  const [stage, setStage] = useState<Stage>("closed");
  const [reducedMotion, setReducedMotion] = useState(false);
  const stageRef = useRef<Stage>("closed");
  const coverRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const t = invitation[language];

  const moveStage = useCallback((next: Stage) => { stageRef.current = next; setStage(next); }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("wedding-language");
    if (stored === "en" || stored === "te") setLanguage(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.sessionStorage.setItem("wedding-language", language);
  }, [language]);

  useEffect(() => () => { tlRef.current?.kill(); }, []);

  const openInvitation = () => {
    if (stageRef.current !== "closed") return;
    moveStage("opening");
    tlRef.current?.kill();
    const cover = coverRef.current;
    const card = cardRef.current;
    const reveal = revealRef.current;
    if (!cover || !card || !reveal) { moveStage("revealed"); return; }
    if (reducedMotion) {
      gsap.set(cover, { rotateY: -112, opacity: 0, pointerEvents: "none" });
      gsap.set(reveal, { opacity: 1, y: 0 });
      moveStage("revealed");
      return;
    }
    const timeline = gsap.timeline({
      onComplete: () => { gsap.set(cover, { pointerEvents: "none" }); moveStage("revealed"); }
    });
    tlRef.current = timeline;
    timeline
      .to(card, { scale: 1.025, duration: .65, ease: "power2.inOut" }, 0)
      .to(cover, { rotateY: -112, duration: 1.75, ease: "power3.inOut" }, .15)
      .to(cover, { opacity: 0, duration: .45, ease: "power1.out" }, 1.45)
      .fromTo(reveal, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.15, ease: "power2.out" }, 1.1)
      .to(card, { scale: 1, duration: .8, ease: "power2.out" }, 1.5);
  };

  const replay = () => {
    tlRef.current?.kill();
    window.scrollTo({ top: 0, behavior: "instant" });
    gsap.set(coverRef.current, { clearProps: "all" });
    gsap.set(cardRef.current, { clearProps: "all" });
    gsap.set(revealRef.current, { clearProps: "all" });
    moveStage("closed");
  };

  return (
    <main className="invitation-page">
      <PetalField />
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="surface-grain" aria-hidden="true" />
      <div className="page-decoration page-decoration-left" aria-hidden="true">✧</div>
      <div className="page-decoration page-decoration-right" aria-hidden="true">✧</div>

      <header className="page-heading">
        <span className="heading-divider" />
        <span>ABHINAV <span className="heading-amp">&</span> CHANDANA</span>
        <span className="heading-divider" />
      </header>

      <section className="hero" aria-label="Wedding invitation">
        <div className="hero-subtitle">{t.blessing}</div>
        <div className={`book-frame ${stage !== "closed" ? "is-opening" : ""}`}>
          <div className="invite-book" ref={cardRef}>
            <div className="inside-page">
              <div className="paper-border" />
              <FloralCorner className="inside-floral inside-floral-top" />
              <FloralCorner className="inside-floral inside-floral-bottom" />
              <div className="inside-content" ref={revealRef}>
                <div className="inside-ornament">✦ <span>✦</span> ✦</div>
                <span className="inside-eyebrow">{t.eyebrow}</span>
                <div className="small-flourish">❦</div>
                <span className="inside-title">{t.invitationSmall}</span>
                <h1 className={`names ${language === "te" ? "telugu-names" : ""}`}>
                  <span>{t.groom}</span>
                  <em>&</em>
                  <span>{t.bride}</span>
                </h1>
                <p className="invitation-message">{t.join}</p>
                <span className="date-rule" />
                <strong className="wedding-date">{t.date}</strong>
                <span className="wedding-time">{t.time}</span>
                <div className="venue-info"><span>{t.venue}</span><small>{t.city}</small></div>
                <span className="bottom-flourish">❧</span>
              </div>
            </div>

            <div className="outer-cover" ref={coverRef}>
              <div className="cover-texture" />
              <div className="cover-outline" />
              <FloralCorner className="cover-floral cover-floral-top" />
              <FloralCorner className="cover-floral cover-floral-bottom" />
              <div className="cover-content">
                <span className="cover-small-top">{t.top}</span>
                <div className="emblem-wrap"><img src="/images/ganesh-medallion.png" alt="Traditional Ganesha medallion from the original wedding invitation" /></div>
                <span className="cover-tiny">WITH THE BLESSINGS OF THE ALMIGHTY</span>
                <div className="cover-ornament">❧ ❦ ❧</div>
                <h2 className="cover-title">{t.invitation}</h2>
                <p className="cover-subtitle">{t.press}</p>
                <button className="open-button" type="button" onClick={openInvitation} disabled={stage !== "closed"}>
                  <Sparkles size={16} strokeWidth={1.4} aria-hidden="true" />
                  <span>{t.open}</span>
                </button>
                <span className="cover-date">{t.dateTag}</span>
              </div>
              <div className="book-spine" />
            </div>
          </div>
        </div>
        <div className={`under-card ${stage === "revealed" ? "visible" : ""}`}>
          {stage === "revealed" ? <><ArrowDown size={15} aria-hidden="true" /><span>{t.scroll}</span></> : <span>✧ &nbsp; 12 · 12 · 2026 &nbsp; ✧</span>}
        </div>
      </section>

      {stage === "revealed" && <WeddingStory language={language} reducedMotion={reducedMotion} />}

      <nav className="floating-actions" aria-label="Invitation controls">
        <button type="button" className="floating-button language-button" onClick={() => setLanguage(language === "en" ? "te" : "en")} aria-label={language === "en" ? "Switch to Telugu" : "Switch to English"} title={language === "en" ? "Switch to Telugu" : "Switch to English"}>
          <Languages size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>{language === "en" ? "తెలుగు" : "English"}</span>
        </button>
        {stage === "revealed" && (
          <button type="button" className="floating-button replay-button" onClick={replay} aria-label={t.replay} title={t.replay}>
            <RotateCcw size={20} strokeWidth={1.7} aria-hidden="true" />
          </button>
        )}
      </nav>
    </main>
  );
}
