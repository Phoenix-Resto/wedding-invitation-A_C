"use client";

import { useEffect, useRef, useState } from "react";
import { Languages, RotateCcw, Sparkles } from "lucide-react";
import { FloralCorner } from "./FloralCorner";
import { WeddingStory } from "./WeddingStory";
import { PetalField } from "./PetalField";
import { invitation, type Language } from "../config/invitation";

type Stage = "closed" | "opening" | "revealed";

/** Flap lift (1.1s) + cover drop (1s, starts after 1s) + a small margin. Keep in sync with globals.css. */
const OPEN_MS = 2150;

export function InvitationExperience() {
  const [language, setLanguage] = useState<Language>("en");
  const [stage, setStage] = useState<Stage>("closed");
  const [reducedMotion, setReducedMotion] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const c = invitation[language];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const stored = window.sessionStorage.getItem("wedding-language");
    if (stored === "en" || stored === "te") setLanguage(stored);
    window.scrollTo(0, 0);
    return () => window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.sessionStorage.setItem("wedding-language", language);
  }, [language]);

  // No scrolling until the card is fully revealed.
  useEffect(() => {
    document.documentElement.classList.toggle("is-locked", stage !== "revealed");
    return () => document.documentElement.classList.remove("is-locked");
  }, [stage]);

  const openInvitation = () => {
    if (stage !== "closed") return;
    if (reducedMotion) {
      setStage("revealed");
      return;
    }
    setStage("opening");
    timer.current = window.setTimeout(() => setStage("revealed"), OPEN_MS);
  };

  const replay = () => {
    window.clearTimeout(timer.current);
    window.scrollTo(0, 0);
    setStage("closed");
  };

  return (
    <main className="invite" data-stage={stage}>
      <WeddingStory language={language} reducedMotion={reducedMotion} />
      <PetalField active={stage === "revealed" && !reducedMotion} />

      {stage !== "revealed" && (
        <div className={`cover ${stage === "opening" ? "is-open" : ""}`}>
          <div className="cover-body">
            <div className="env-shadow">
              <div className="env-front" />
            </div>
            <svg className="env-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path d="M0 0 L50 43 L100 0" />
              <path d="M0 1.6 L50 44.6 L100 1.6" />
            </svg>
            <FloralCorner className="cover-floral cover-floral-bl" />
            <FloralCorner className="cover-floral cover-floral-br" />
            <div className="cover-info">
              <h2 className="cover-title">{c.invitation}</h2>
              <p className="cover-names">{c.groom} <em>&</em> {c.bride}</p>
              <button className="open-button" type="button" onClick={openInvitation} disabled={stage !== "closed"}>
                <Sparkles size={16} strokeWidth={1.4} aria-hidden="true" />
                <span>{c.open}</span>
              </button>
              <p className="cover-subtitle">{c.press}</p>
            </div>
            <span className="cover-date">{c.dateTag}</span>
          </div>

          <div className="cover-flap" aria-hidden="true">
            <div className="flap-face flap-front">
              <div className="flap-bg" />
              <svg className="flap-line" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 0 L50 100 L100 0" />
              </svg>
              <FloralCorner className="flap-floral flap-floral-l" />
              <FloralCorner className="flap-floral flap-floral-r" />
              <span className="cover-small-top">{c.top}</span>
              <div className="flap-seal"><img src="/images/ganesh-medallion.webp" alt="" decoding="async" /></div>
            </div>
            <div className="flap-face flap-back" />
          </div>
        </div>
      )}

      <nav className="floating-actions" aria-label="Invitation controls">
        <button
          type="button"
          className="floating-button language-button"
          onClick={() => setLanguage(language === "en" ? "te" : "en")}
          aria-label={language === "en" ? "Switch to Telugu" : "Switch to English"}
          title={language === "en" ? "Switch to Telugu" : "Switch to English"}
        >
          <Languages size={19} strokeWidth={1.7} aria-hidden="true" />
          <span>{language === "en" ? "తెలుగు" : "English"}</span>
        </button>
        {stage === "revealed" && (
          <button type="button" className="floating-button replay-button" onClick={replay} aria-label={c.replay} title={c.replay}>
            <RotateCcw size={20} strokeWidth={1.7} aria-hidden="true" />
          </button>
        )}
      </nav>
    </main>
  );
}
