"use client";

import { useEffect, useRef } from "react";
import { ArrowDown, MapPin, CalendarDays, Utensils, Heart } from "lucide-react";
import { invitation, type Language } from "../config/invitation";
import { weddingPhotos } from "../config/photos";
import { FloralCorner } from "./FloralCorner";
import { BG_SCREENS_PER_SCENE, UNIT_VH, sceneStart, sceneState, totalUnits } from "../lib/cameraMath";

type Props = { language: Language; reducedMotion: boolean };

/** Extra depth: these elements scale a little faster than their scene, like objects closer to the camera. */
const DEPTH: Array<[selector: string, exponent: number]> = [
  [".scene-floral", 1.6],
  [".scene-ornament", 1.25],
];

/**
 * The full-screen card. Everything lives on one fixed stage; native scrolling only
 * drives a progress value. Each scene is scaled like a camera moving through it
 * (fast in, slow drift, fast out) while a patterned background moves very slowly.
 * Only transform and opacity are written per frame, and only for visible scenes.
 */
export function WeddingStory({ language, reducedMotion }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const c = invitation[language];
  const t = c.story;

  useEffect(() => {
    const root = rootRef.current;
    const spacer = spacerRef.current;
    const bg = bgRef.current;
    if (!root || !spacer || !bg || reducedMotion) return;

    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const depth = scenes.map((scene) =>
      DEPTH.flatMap(([selector, exponent]) =>
        Array.from(scene.querySelectorAll<HTMLElement>(selector)).map((el) => ({ el, exponent })),
      ),
    );
    const n = scenes.length;
    const shown: boolean[] = new Array(n).fill(false);

    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let unit = vh * UNIT_VH;
    let tile = 240;
    let raf = 0;

    const hide = (i: number) => {
      const el = scenes[i];
      el.style.visibility = "hidden";
      el.style.pointerEvents = "none";
      el.style.willChange = "";
      shown[i] = false;
    };

    const update = () => {
      raf = 0;
      const y = Math.max(0, window.scrollY);
      const u = y / unit;
      let again = false;

      for (let i = 0; i < n; i++) {
        const el = scenes[i];
        const s = sceneState(u - sceneStart(i), i === n - 1);
        if (!s.visible) {
          if (shown[i]) hide(i);
          continue;
        }
        if (!shown[i]) {
          // Paint the first frame at full size so the browser rasterises text sharply,
          // then start scaling from the next frame.
          el.style.visibility = "visible";
          el.style.willChange = "transform, opacity";
          el.style.transform = "scale(1)";
          el.style.opacity = "0";
          shown[i] = true;
          again = true;
          continue;
        }
        el.style.transform = `scale(${s.scale.toFixed(4)})`;
        el.style.opacity = s.opacity.toFixed(3);
        el.style.pointerEvents = s.active ? "auto" : "none";
        const layers = depth[i];
        for (let d = 0; d < layers.length; d++) {
          layers[d].el.style.setProperty("--ds", Math.pow(s.scale, layers[d].exponent - 1).toFixed(4));
        }
      }

      // Background: a seamless tile that drifts a fraction of the total scroll.
      const total = totalUnits(n) * unit;
      const progress = total > 0 ? Math.min(1, y / total) : 0;
      const travel = progress * n * BG_SCREENS_PER_SCENE * vh;
      bg.style.transform = `translate3d(0,${(-(travel % tile)).toFixed(1)}px,0)`;

      if (again) raf = requestAnimationFrame(update);
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      unit = vh * UNIT_VH;
      tile = Math.round(Math.min(vw * 0.62, 320));
      root.style.setProperty("--tile", `${tile}px`);
      spacer.style.height = `${Math.round(totalUnits(n) * unit + vh)}px`;
      schedule();
    };

    const onResize = () => {
      // Ignore the small height changes caused by mobile browser bars appearing/disappearing.
      if (window.innerWidth === vw && Math.abs(window.innerHeight - vh) < vh * 0.25) return;
      measure();
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      scenes.forEach((el) => el.removeAttribute("style"));
      bg.removeAttribute("style");
      spacer.removeAttribute("style");
    };
  }, [reducedMotion]);

  return (
    <section className={`camera ${reducedMotion ? "is-static" : ""}`} ref={rootRef} aria-label={t.aria}>
      <div className="paper" aria-hidden="true" />
      <div className="bg-pattern" ref={bgRef} aria-hidden="true" />
      <div className="card-frame" aria-hidden="true" />

      <div className="stage">
        {/* 1 · The card itself (what the guest sees when the envelope opens) */}
        <div className="scene scene-card" data-scene aria-label={c.invitation}>
          <FloralCorner className="scene-floral scene-floral-a" />
          <FloralCorner className="scene-floral scene-floral-b" />
          <div className="scene-content card-content">
            <div className="card-ornament" aria-hidden="true">✦ <span>✦</span> ✦</div>
            <span className="card-eyebrow">{c.eyebrow}</span>
            <span className="card-flourish" aria-hidden="true">❦</span>
            <span className="card-title">{c.invitationSmall}</span>
            <h1 className={`names ${language === "te" ? "telugu-names" : ""}`}>
              <span>{c.groom}</span>
              <em>&</em>
              <span>{c.bride}</span>
            </h1>
            <p className="card-message">{c.join}</p>
            <span className="date-rule" aria-hidden="true" />
            <strong className="wedding-date">{c.date}</strong>
            <span className="wedding-time">{c.time}</span>
            <div className="venue-info"><span>{c.venue}</span><small>{c.city}</small></div>
          </div>
          <span className="scroll-hint card-hint"><ArrowDown size={15} aria-hidden="true" /> {c.scroll}</span>
        </div>

        {/* 2 · Blessings */}
        <div className="scene story-blessing" data-scene aria-label={t.blessings.heading}>
          <FloralCorner className="scene-floral scene-floral-a" />
          <div className="scene-content">
            <span className="scene-kicker">{t.blessings.kicker}</span>
            <div className="scene-ornament medallion-scene" aria-hidden="true"><img src="/images/ganesh-medallion.webp" alt="" decoding="async" /></div>
            <h2>{t.blessings.heading}</h2>
            <div className="scene-divider" aria-hidden="true">✦ ❦ ✦</div>
            <p>{t.blessings.message}</p>
          </div>
        </div>

        {/* 3 · Couple */}
        <div className="scene story-couple" data-scene aria-label={t.couple.heading}>
          <FloralCorner className="scene-floral scene-floral-b" />
          <div className="scene-content couple-content">
            <span className="scene-kicker">{t.couple.kicker}</span>
            <h2>{t.couple.heading}</h2>
            <div className="couple-portrait-frame scene-ornament" aria-hidden="true">
              {weddingPhotos.together ? (
                <img className="couple-portrait-image" src={weddingPhotos.together} alt="" decoding="async" />
              ) : (
                <div className="couple-photo-mark"><Heart size={44} strokeWidth={1} /><span>12 · 12 · 2026</span></div>
              )}
            </div>
            <div className="couple-display"><strong>{c.groom}</strong><span>&</span><strong>{c.bride}</strong></div>
            <p>{t.couple.message}</p>
          </div>
        </div>

        {/* 4 · Portraits (only when photos are configured) */}
        {(weddingPhotos.groom || weddingPhotos.bride) && (
          <div className="scene story-gallery" data-scene aria-label={t.gallery.heading}>
            <FloralCorner className="scene-floral scene-floral-a" />
            <FloralCorner className="scene-floral scene-floral-b" />
            <div className="scene-content gallery-content">
              <span className="scene-kicker">{t.gallery.kicker}</span>
              <h2>{t.gallery.heading}</h2>
              <div className="portrait-pair">
                {weddingPhotos.groom && <figure className="portrait-sheet">
                  <img src={weddingPhotos.groom} alt={t.gallery.groomAlt} decoding="async" />
                  <figcaption>{c.groom}</figcaption>
                </figure>}
                {weddingPhotos.bride && <figure className="portrait-sheet">
                  <img src={weddingPhotos.bride} alt={t.gallery.brideAlt} decoding="async" />
                  <figcaption>{c.bride}</figcaption>
                </figure>}
              </div>
              <p>{t.gallery.message}</p>
            </div>
          </div>
        )}

        {/* 5 · Family */}
        <div className="scene story-family" data-scene aria-label={t.family.heading}>
          <FloralCorner className="scene-floral scene-floral-a" />
          <div className="scene-content">
            <span className="scene-kicker">{t.family.kicker}</span>
            <div className="scene-ornament filigree-ornament" aria-hidden="true">❦</div>
            <h2>{t.family.heading}</h2>
            <p className="family-names">{t.family.parents}</p>
            <div className="scene-divider" aria-hidden="true">✧ ✧ ✧</div>
            <p>{t.family.message}</p>
          </div>
        </div>

        {/* 6 · Date */}
        <div className="scene story-date" data-scene aria-label={t.ceremony.heading}>
          <FloralCorner className="scene-floral scene-floral-b" />
          <div className="scene-content">
            <span className="scene-kicker">{t.ceremony.kicker}</span>
            <CalendarDays className="scene-icon scene-ornament" size={52} strokeWidth={1} aria-hidden="true" />
            <h2>{t.ceremony.heading}</h2>
            <div className="ceremony-date"><span>12</span><small>{t.ceremony.month}</small><small>2026</small></div>
            <p>{t.ceremony.day}</p>
            <p className="time-emphasis">{t.ceremony.time}</p>
            <p className="scene-note">{t.ceremony.note}</p>
          </div>
        </div>

        {/* 7 · Venue */}
        <div className="scene story-venue" data-scene aria-label={t.venue.heading}>
          <FloralCorner className="scene-floral scene-floral-a" />
          <div className="scene-content">
            <span className="scene-kicker">{t.venue.kicker}</span>
            <MapPin className="scene-icon scene-ornament" size={52} strokeWidth={1} aria-hidden="true" />
            <h2>{t.venue.heading}</h2>
            <p className="venue-title">{c.venue}</p>
            <p>{c.city}</p>
            <div className="scene-divider" aria-hidden="true">❦</div>
            <p className="venue-dinner"><Utensils size={17} aria-hidden="true" /> {t.venue.dinner}</p>
            <a className="venue-link" href="https://www.google.com/maps/search/?api=1&query=T.G.K.+Kalyana+Mandapam+Burripalem+Road+Tenali" target="_blank" rel="noopener noreferrer">{t.venue.directions} <MapPin size={16} aria-hidden="true" /></a>
          </div>
        </div>

        {/* 8 · Finale */}
        <div className="scene story-finale" data-scene aria-label={t.closing.heading}>
          <FloralCorner className="scene-floral scene-floral-b" />
          <div className="scene-content">
            <span className="scene-kicker">{t.closing.kicker}</span>
            <div className="scene-ornament filigree-ornament" aria-hidden="true">❧</div>
            <h2>{t.closing.heading}</h2>
            <p>{t.closing.message}</p>
            <div className="scene-divider" aria-hidden="true">✦ ❦ ✦</div>
            <p className="closing-names">{c.groom} & {c.bride}</p>
            <p className="scene-note">12 · 12 · 2026</p>
          </div>
        </div>
      </div>

      {/* Gives the page its native scroll length; the JS sets the exact height. */}
      <div className="camera-spacer" ref={spacerRef} aria-hidden="true" />
    </section>
  );
}
