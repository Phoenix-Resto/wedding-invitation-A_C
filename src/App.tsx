import { useEffect, useState, type CSSProperties } from 'react';

type Phase = 'splash' | 'splash-exit' | 'cover-arrive' | 'cover' | 'opening' | 'opened';

// Deliberately sequential: the splash must finish fading OUT before the cover enters.
const SPLASH_VISIBLE_MS = 3550;
const SPLASH_EXIT_MS = 950;
const COVER_APPROACH_MS = 1350;

// Every frame has the same 1200×1600 transparent canvas. Do not crop them independently.
const OPENING_FRAMES = Array.from(
  { length: 11 },
  (_, index) => `/images/opening/frame-${String(index + 2).padStart(2, '0')}.webp`,
);
const OPENING_FRAME_MS = [220, 280, 250, 260, 260, 245, 260, 275, 295, 330] as const;

const petals = [
  ['5%', '-1.5s', '11s', '1.2rem', '8vw', '28deg'],
  ['17%', '-7.4s', '17s', '.8rem', '-11vw', '-10deg'],
  ['29%', '-3.8s', '15s', '1rem', '13vw', '48deg'],
  ['42%', '-10s', '16s', '.65rem', '-9vw', '15deg'],
  ['55%', '-5.7s', '14s', '1rem', '14vw', '63deg'],
  ['68%', '-2.8s', '13s', '.7rem', '-14vw', '19deg'],
  ['83%', '-11s', '19s', '1.2rem', '-8vw', '52deg'],
  ['94%', '-6s', '16s', '.9rem', '-12vw', '12deg'],
  ['10%', '-13s', '20s', '.7rem', '10vw', '27deg'],
  ['76%', '-9s', '18s', '.68rem', '-17vw', '36deg'],
  ['36%', '-14s', '20s', '.85rem', '15vw', '67deg'],
  ['87%', '-3s', '21s', '.8rem', '-18vw', '35deg'],
] as const;

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
      <div className="ambience__petals">
        {petals.map(([x, delay, duration, size, drift, turn], index) => (
          <i
            key={index}
            className="petal"
            style={{
              '--x': x,
              '--delay': delay,
              '--duration': duration,
              '--size': size,
              '--drift': drift,
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
    const timeout = window.setTimeout(() => setPhase('cover'), COVER_APPROACH_MS);
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
    setPhase('opening');
  };

  return (
    <main className={`invitation-app phase-${phase}${splashLoaded ? ' is-ready' : ''}`}>
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
            <div className="splash-loader" role="status" aria-label="Preparing your invitation">
              <div className="splash-loader__line"><span /></div>
              <span className="splash-loader__gem" aria-hidden="true">✧</span>
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
        <div className="stage">
          <div className="invitation-card invitation-card--cover">
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
