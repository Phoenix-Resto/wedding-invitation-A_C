import { useEffect, useRef, useState, type CSSProperties } from 'react';

type Phase = 'splash' | 'splash-exit' | 'cover-arrive' | 'cover' | 'button-drop' | 'opening' | 'opened';

// Deliberately sequential: the splash must finish fading OUT before the cover enters.
const SPLASH_VISIBLE_MS = 3550;
const SPLASH_EXIT_MS = 950;
const COVER_DROP_MS = 1650;
const BUTTON_DROP_MS = 650;

// Every frame has the same 1200×1600 transparent canvas. Do not crop them independently.
const OPENING_FRAMES = Array.from(
  { length: 11 },
  (_, index) => `/images/opening/frame-${String(index + 2).padStart(2, '0')}.webp`,
);
// Each dwell leaves enough time for its corresponding size/position transition.
// Frame 11 has a longer hold to begin the descent before frame 12 settles.
const OPENING_FRAME_MS = [250, 290, 460, 540, 410, 300, 310, 310, 340, 680] as const;

// Frame 2 and 3 stay at the resting depth; camera correction and the rise begin
// at frame 4, reach full-screen at 6, and remain there through 10.
// Frame 11 starts falling and frame 12 reaches the original ground level.
function openingPosition(index: number, fullScale: number) {
  if (index < 2) return { scale: 1, lift: '0svh', stage: 'rest' };
  if (index === 2) return { scale: 1.17, lift: '-2svh', stage: 'rising' };
  if (index === 3) return { scale: 1 + (fullScale - 1) * .52, lift: '-2svh', stage: 'rising' };
  if (index < 9) return { scale: fullScale, lift: '-1svh', stage: 'raised' };
  return { scale: fullScale, lift: '-3svh', stage: index === 9 ? 'falling' : 'landed' };
}

// x, resting height, delay, fall duration, size and rotation. Negative delays
// leave some petals already resting when the invitation first appears.
const groundPetals = [
  ['4%', '87%', '-4.2s', '3.1s', '1.1rem', '-22deg'],
  ['13%', '78%', '.2s', '2.8s', '.8rem', '48deg'],
  ['24%', '91%', '-3.7s', '3s', '.9rem', '72deg'],
  ['38%', '84%', '.8s', '3.2s', '.75rem', '-15deg'],
  ['59%', '92%', '-4s', '2.9s', '1rem', '26deg'],
  ['76%', '84%', '1.6s', '3s', '.72rem', '-37deg'],
  ['90%', '88%', '-3.5s', '2.7s', '1.05rem', '58deg'],
  ['96%', '74%', '2.2s', '3.4s', '.85rem', '-45deg'],
  ['8%', '67%', '1.2s', '3.2s', '.65rem', '24deg'],
  ['88%', '66%', '-3.7s', '3s', '.72rem', '-18deg'],
] as const;

// These petals settle over the image, while the group above stays underneath it.
const surfacePetals = [
  ['8%', '78%', '-4.3s', '3.2s', '.63rem', '45deg'],
  ['85%', '88%', '1.4s', '3.1s', '.7rem', '-30deg'],
  ['69%', '72%', '2.1s', '3.5s', '.57rem', '72deg'],
] as const;

// A few loose petals move across the floor in a gentle right-to-left breeze.
const breezePetals = [
  ['89%', '12s', '-3s', '.82rem', '-18deg'],
  ['77%', '15s', '-11s', '.62rem', '34deg'],
  ['94%', '17s', '-7s', '1rem', '15deg'],
] as const;

function LandingPetals({ onCard = false }: { onCard?: boolean }) {
  const collection = onCard ? surfacePetals : groundPetals;
  return (
    <div className={onCard ? 'petal-layer petal-layer--surface' : 'petal-layer petal-layer--ground'} aria-hidden="true">
      {collection.map(([x, y, delay, duration, size, turn], index) => (
        <i
          key={index}
          className="petal petal--land"
          style={{
            '--x': x,
            '--y': y,
            '--delay': delay,
            '--duration': duration,
            '--size': size,
            '--turn': turn,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

const stars = [
  ['11%', '19%', '0s'],
  ['82%', '18%', '1.4s'],
  ['17%', '76%', '2s'],
  ['92%', '66%', '.5s'],
  ['64%', '9%', '3s'],
  ['73%', '89%', '2.2s'],
] as const;

function AmbientDecorations() {
  return (
    <div className="ambience" aria-hidden="true">
      <div className="ambience__glow ambience__glow--left" />
      <div className="ambience__glow ambience__glow--right" />
      <div className="ambience__engraving ambience__engraving--left">
        <svg viewBox="0 0 230 440" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M13 419C104 317 54 207 167 47M35 367C28 344 10 329 6 299M60 319C91 296 117 299 147 308M81 262C60 231 42 230 30 214M107 218C136 187 163 189 193 196M135 142C120 118 105 103 103 76M160 72C184 57 208 55 223 61" />
          <path d="M16 302C47 289 59 306 35 330C14 329 5 313 16 302ZM95 300C118 279 140 280 150 300C136 320 115 319 95 300ZM24 212C42 187 60 192 68 219C57 241 37 231 24 212ZM148 193C162 171 182 165 196 183C190 209 170 211 148 193ZM97 74C91 50 106 39 125 51C136 73 118 88 97 74ZM179 56C181 33 202 29 217 46C214 65 195 75 179 56Z" />
        </svg>
      </div>
      <div className="ambience__engraving ambience__engraving--right">
        <svg viewBox="0 0 230 440" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M13 419C104 317 54 207 167 47M35 367C28 344 10 329 6 299M60 319C91 296 117 299 147 308M81 262C60 231 42 230 30 214M107 218C136 187 163 189 193 196M135 142C120 118 105 103 103 76M160 72C184 57 208 55 223 61" />
          <path d="M16 302C47 289 59 306 35 330C14 329 5 313 16 302ZM95 300C118 279 140 280 150 300C136 320 115 319 95 300ZM24 212C42 187 60 192 68 219C57 241 37 231 24 212ZM148 193C162 171 182 165 196 183C190 209 170 211 148 193ZM97 74C91 50 106 39 125 51C136 73 118 88 97 74ZM179 56C181 33 202 29 217 46C214 65 195 75 179 56Z" />
        </svg>
      </div>
      <LandingPetals />
      <div className="petal-layer petal-layer--breeze">
        {breezePetals.map(([y, duration, delay, size, turn], index) => (
          <i
            key={index}
            className="petal petal--breeze"
            style={{
              '--y': y,
              '--duration': duration,
              '--delay': delay,
              '--size': size,
              '--turn': turn,
            } as CSSProperties}
          />
        ))}
      </div>
      {stars.map(([x, y, delay], index) => (
        <i
          key={index}
          className="twinkle"
          style={{ '--x': x, '--y': y, '--delay': delay } as CSSProperties}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>('splash');
  const [splashLoaded, setSplashLoaded] = useState(false);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const [replayCount, setReplayCount] = useState(0);
  const [fullScale, setFullScale] = useState(1.2);
  const cardRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLElement>(null);

  // Make the raised frames truly extend beyond the phone viewport, even on
  // unusually tall phones. offsetHeight ignores CSS transforms/animations.
  useEffect(() => {
    const card = cardRef.current;
    const app = appRef.current;
    if (!card || !app) return;
    const recalculate = () => {
      const cardHeight = card.offsetHeight;
      if (!cardHeight) return;
      const next = Math.min(1.45, Math.max(1.05, (app.clientHeight * 0.80) / cardHeight));
      setFullScale((previous) => Math.abs(previous - next) < .01 ? previous : next);
    };
    recalculate();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(recalculate) : undefined;
    observer?.observe(app);
    observer?.observe(card);
    window.addEventListener('resize', recalculate);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', recalculate);
    };
  }, []);

  const openingPose = openingPosition(frameIndex, fullScale);

  useEffect(() => {
    if (phase !== 'splash' || !splashLoaded) return;
    const timeout = window.setTimeout(() => setPhase('splash-exit'), SPLASH_VISIBLE_MS);
    return () => window.clearTimeout(timeout);
  }, [phase, splashLoaded, replayCount]);

  useEffect(() => {
    if (phase !== 'splash-exit' || !coverLoaded) return;
    const timeout = window.setTimeout(() => setPhase('cover-arrive'), SPLASH_EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [phase, coverLoaded]);

  useEffect(() => {
    if (phase !== 'cover-arrive') return;
    const timeout = window.setTimeout(() => setPhase('cover'), COVER_DROP_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  // The button falls off the screen before the physical envelope begins opening.
  useEffect(() => {
    if (phase !== 'button-drop') return;
    const timeout = window.setTimeout(() => setPhase('opening'), BUTTON_DROP_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  // Preload and decode all the opening images while the visitor watches the intro.
  // A single aligned img is swapped per frame: no overlapping ghost/flap layers.
  useEffect(() => {
    if (!coverLoaded) return;
    const preloads = OPENING_FRAMES.slice(1).map((src) => {
      const image = new window.Image();
      image.src = src;
      if (typeof image.decode === 'function') {
        void image.decode().catch(() => undefined);
      }
      return image;
    });
    return () => { preloads.forEach((image) => { image.src = ''; }); };
  }, [coverLoaded]);

  useEffect(() => {
    if (phase !== 'opening') return;
    if (frameIndex === OPENING_FRAMES.length - 1) {
      setPhase('opened'); // Remain on the final, fully extracted invitation image.
      return;
    }
    const timeout = window.setTimeout(
      () => setFrameIndex((index) => Math.min(index + 1, OPENING_FRAMES.length - 1)),
      OPENING_FRAME_MS[frameIndex],
    );
    return () => window.clearTimeout(timeout);
  }, [phase, frameIndex]);

  const replay = () => {
    setFrameIndex(0);
    setReplayCount((count) => count + 1);
    // Both images remain cached, so replay does not depend on a second onLoad event.
    setPhase('splash');
  };

  const startOpening = () => {
    if (phase !== 'cover') return;
    setFrameIndex(0);
    setPhase('button-drop');
  };

  return (
    <main
      ref={appRef}
      className={`invitation-app phase-${phase}${splashLoaded ? ' is-ready' : ''}`}
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      <AmbientDecorations />

      <section
        key={`splash-${replayCount}`}
        className="screen screen--splash"
        aria-label="Wedding invitation introduction"
        aria-hidden={phase !== 'splash' && phase !== 'splash-exit'}
      >
        <div className="stage">
          <div className="invitation-card invitation-card--splash">
            <img
              className="invitation-card__image"
              src="/images/splash.webp"
              alt="Wedding invitation with floral artwork and a gold Ganesha emblem"
              onLoad={() => setSplashLoaded(true)}
              onError={() => setSplashLoaded(true)}
              fetchPriority="high"
              draggable={false}
            />
            <LandingPetals onCard />
            <div className="splash-loader" role="status" aria-label="Preparing your invitation">
              <div className="splash-loader__line"><span /></div>
              <span className="splash-loader__petal" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section
        className="screen screen--cover"
        aria-label="Wedding invitation card"
        aria-hidden={phase === 'splash' || phase === 'splash-exit'}
        inert={phase !== 'cover' && phase !== 'opened'}
      >
        <div className="stage stage--cover">
          <div
            ref={cardRef}
            className={`invitation-card invitation-card--cover opening-pose--${openingPose.stage}`}
            style={{
              '--opening-scale': openingPose.scale,
              '--opening-lift': openingPose.lift,
              '--opening-full-scale': fullScale,
            } as CSSProperties}
          >
            <img
              className="invitation-card__image"
              src={OPENING_FRAMES[frameIndex]}
              alt={phase === 'opening' || phase === 'opened'
                ? 'Wedding envelope opening to reveal the inner invitation'
                : 'Antique ivory floral wedding envelope, ready to open'}
              onLoad={() => setCoverLoaded(true)}
              onError={() => setCoverLoaded(true)}
              draggable={false}
            />
            <LandingPetals onCard />
          </div>
          <div className="ground-controls">
            <button
              type="button"
              className="open-card-button"
              disabled={phase !== 'cover'}
              onClick={startOpening}
            >
              <span className="open-card-button__spark" aria-hidden="true">✧</span>
              <span>Open Card</span>
              <span className="open-card-button__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </div>
        {phase === 'opened' && (
          <button className="replay-button" type="button" onClick={replay}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a9 9 0 1 1 1 6M3 4v6h6" /></svg>
            Replay
          </button>
        )}
      </section>
    </main>
  );
}
