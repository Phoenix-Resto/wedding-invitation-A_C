"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, MapPin, CalendarDays, Utensils, Heart } from "lucide-react";
import { invitation, type Language } from "../config/invitation";
import { FloralCorner } from "./FloralCorner";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = { language: Language; reducedMotion: boolean };

export function WeddingStory({ language, reducedMotion }: Props) {
  const root = useRef<HTMLElement>(null);
  const t = invitation[language].story;

  useEffect(() => {
    const rootElement = root.current;
    if (!rootElement || reducedMotion) return;
    const context = gsap.context(() => {
      const scenes = gsap.utils.toArray<HTMLElement>(".story-scene", rootElement);
      scenes.forEach((scene) => {
        const back = scene.querySelector<HTMLElement>(".scene-backdrop");
        const ornament = scene.querySelector<HTMLElement>(".scene-ornament");
        const parts = gsap.utils.toArray<HTMLElement>("[data-story-reveal]", scene);
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scene,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 1.15)}`,
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
          }
        });
        timeline.fromTo(parts, { opacity: 0, y: "3rem" }, {
          opacity: 1, y: "0rem", stagger: 0.12, duration: 0.5, ease: "power2.out"
        }, 0.07);
        if (ornament) timeline.fromTo(ornament, { scale: 0.86, rotate: -8, opacity: 0.35 }, {
          scale: 1.05, rotate: 5, opacity: 1, duration: 1.3, ease: "none"
        }, 0);
        if (back) timeline.fromTo(back, { yPercent: -4, scale: 1.06 }, { yPercent: 4, scale: 1, duration: 1.5, ease: "none" }, 0);
        timeline.to(parts, { opacity: 0, y: "-2rem", stagger: 0.055, duration: 0.35, ease: "power1.in" }, 1.05);
      });
      ScrollTrigger.refresh();
    }, rootElement);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <section className={`wedding-story ${reducedMotion ? "story-static" : ""}`} ref={root} aria-label={t.aria}>
      <div className="story-scene story-blessing" aria-label={t.blessings.heading}>
        <div className="scene-backdrop" aria-hidden="true" />
        <FloralCorner className="scene-floral scene-floral-a" />
        <div className="scene-content">
          <span className="scene-kicker" data-story-reveal>{t.blessings.kicker}</span>
          <div className="scene-ornament medallion-scene" aria-hidden="true"><img src="/images/ganesh-medallion.png" alt="" /></div>
          <h2 data-story-reveal>{t.blessings.heading}</h2>
          <div className="scene-divider" data-story-reveal>✦ ❦ ✦</div>
          <p data-story-reveal>{t.blessings.message}</p>
          <span className="scroll-hint" data-story-reveal><ArrowDown size={16} aria-hidden="true" /> {t.scrollHint}</span>
        </div>
      </div>

      <div className="story-scene story-couple" aria-label={t.couple.heading}>
        <div className="scene-backdrop" aria-hidden="true" />
        <FloralCorner className="scene-floral scene-floral-b" />
        <div className="scene-content couple-content">
          <span className="scene-kicker" data-story-reveal>{t.couple.kicker}</span>
          <h2 data-story-reveal>{t.couple.heading}</h2>
          <div className="couple-portrait-frame scene-ornament" aria-hidden="true">
            <div className="couple-photo-mark"><Heart size={44} strokeWidth={1} /><span>12 · 12 · 2026</span></div>
          </div>
          <div className="couple-display" data-story-reveal><strong>{invitation[language].groom}</strong><span>&</span><strong>{invitation[language].bride}</strong></div>
          <p data-story-reveal>{t.couple.message}</p>
        </div>
      </div>

      <div className="story-scene story-family" aria-label={t.family.heading}>
        <div className="scene-backdrop" aria-hidden="true" />
        <FloralCorner className="scene-floral scene-floral-a" />
        <div className="scene-content">
          <span className="scene-kicker" data-story-reveal>{t.family.kicker}</span>
          <div className="scene-ornament filigree-ornament" aria-hidden="true">❦</div>
          <h2 data-story-reveal>{t.family.heading}</h2>
          <p className="family-names" data-story-reveal>{t.family.parents}</p>
          <div className="scene-divider" data-story-reveal>✧ ✧ ✧</div>
          <p data-story-reveal>{t.family.message}</p>
        </div>
      </div>

      <div className="story-scene story-date" aria-label={t.ceremony.heading}>
        <div className="scene-backdrop" aria-hidden="true" />
        <FloralCorner className="scene-floral scene-floral-b" />
        <div className="scene-content">
          <span className="scene-kicker" data-story-reveal>{t.ceremony.kicker}</span>
          <CalendarDays className="scene-icon scene-ornament" size={52} strokeWidth={1} aria-hidden="true" />
          <h2 data-story-reveal>{t.ceremony.heading}</h2>
          <div className="ceremony-date" data-story-reveal><span>12</span><small>{t.ceremony.month}</small><small>2026</small></div>
          <p data-story-reveal>{t.ceremony.day}</p>
          <p className="time-emphasis" data-story-reveal>{t.ceremony.time}</p>
          <p className="scene-note" data-story-reveal>{t.ceremony.note}</p>
        </div>
      </div>

      <div className="story-scene story-venue" aria-label={t.venue.heading}>
        <div className="scene-backdrop" aria-hidden="true" />
        <FloralCorner className="scene-floral scene-floral-a" />
        <div className="scene-content">
          <span className="scene-kicker" data-story-reveal>{t.venue.kicker}</span>
          <MapPin className="scene-icon scene-ornament" size={52} strokeWidth={1} aria-hidden="true" />
          <h2 data-story-reveal>{t.venue.heading}</h2>
          <p className="venue-title" data-story-reveal>{invitation[language].venue}</p>
          <p data-story-reveal>{invitation[language].city}</p>
          <div className="scene-divider" data-story-reveal>❦</div>
          <p data-story-reveal><Utensils size={17} aria-hidden="true" /> {t.venue.dinner}</p>
          <a className="venue-link" data-story-reveal href="https://www.google.com/maps/search/?api=1&query=T.G.K.+Kalyana+Mandapam+Burripalem+Road+Tenali" target="_blank" rel="noopener noreferrer">{t.venue.directions} <MapPin size={16} aria-hidden="true" /></a>
        </div>
      </div>

      <div className="story-scene story-finale" aria-label={t.closing.heading}>
        <div className="scene-backdrop" aria-hidden="true" />
        <FloralCorner className="scene-floral scene-floral-b" />
        <div className="scene-content">
          <span className="scene-kicker" data-story-reveal>{t.closing.kicker}</span>
          <div className="scene-ornament filigree-ornament" aria-hidden="true">❧</div>
          <h2 data-story-reveal>{t.closing.heading}</h2>
          <p data-story-reveal>{t.closing.message}</p>
          <div className="scene-divider" data-story-reveal>✦ ❦ ✦</div>
          <p className="closing-names" data-story-reveal>{invitation[language].groom} & {invitation[language].bride}</p>
          <p className="scene-note" data-story-reveal>12 · 12 · 2026</p>
        </div>
      </div>
    </section>
  );
}
