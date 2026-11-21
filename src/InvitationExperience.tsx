import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import './InvitationExperience.css';

type Language = 'te' | 'en';
type SceneId = 'pilupu' | 'groom' | 'bride' | 'vivahamu' | 'venue' | 'final';
const SCENES: SceneId[] = ['pilupu', 'groom', 'bride', 'vivahamu', 'venue', 'final'];

// This is a continuous scroll curve, NOT three discrete animation stages.
// At -1 screen distance a new scene occupies about a quarter of the viewport
// area; at 0 it is full size; at +1 it has moved past the viewer.
const INCOMING_SCALE = 0.5;
const OUTGOING_SCALE = 2.05;
const MIDPOINT_TOLERANCE = 0.16;
const FIRST_SCENE_REVEAL_MS = 2900;
const FINAL_PETAL_SETTLE_MS = 3400;

const clamp01 = (number: number) => Math.min(1, Math.max(0, number));
const ease = (number: number) => {
  const x = clamp01(number);
  return x * x * (3 - 2 * x);
};

function getScenePose(index: number, position: number): CSSProperties {
  const distance = position - index;
  if (distance <= -1.02 || distance >= 1.01) {
    return { opacity: 0, visibility: 'hidden', transform: 'translate3d(0, 0, 0) scale(.5)' };
  }

  if (distance <= 0) {
    const arrival = ease(distance + 1);
    return {
      opacity: ease((distance + 0.92) / 0.82),
      // Transform ONLY the scene parent: all four quadrants naturally move
      // outward relative to the viewport center as the scene grows.
      transform: `translate3d(0, 0, 0) scale(${INCOMING_SCALE + (1 - INCOMING_SCALE) * arrival})`,
      visibility: 'visible',
    };
  }

  const departure = ease(distance);
  return {
    opacity: 1 - ease((distance - 0.18) / 0.66),
    transform: `translate3d(0, 0, 0) scale(${1 + (OUTGOING_SCALE - 1) * departure})`,
    visibility: 'visible',
  };
}

function InvitationImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return <img className={className} src={src} alt={alt} draggable={false} decoding="async" />;
}

function PilupuScene() {
  return (
    <div className="inv-scene inv-scene--pilupu" lang="te">
      <InvitationImage className="inv-intro__deity inv-intro__deity--left" src="/images/pilupu/god-left.webp" alt="శ్రీ గణేశుడు" />
      <InvitationImage className="inv-intro__deity inv-intro__deity--right" src="/images/pilupu/god-right.webp" alt="పార్వతీ పరమేశ్వరులు" />
      <InvitationImage className="inv-intro__title" src="/images/pilupu/text-center.webp" alt="కోట వారి పెళ్లిపిలుపు" />
      <div className="inv-intro__filigree" aria-hidden="true">❧</div>
    </div>
  );
}

function PersonScene({ person, language }: { person: 'groom' | 'bride'; language: Language }) {
  const isGroom = person === 'groom';
  return (
    <div className={`inv-scene inv-scene--person inv-scene--${person}`} lang={language}>
      <div className="inv-person__portrait">
        <InvitationImage src={`/images/${person}.webp`} alt={isGroom ? 'Photograph of the groom' : 'Photograph of the bride'} />
      </div>
      <div className="inv-person__copy" key={`${person}-${language}`}>
        <span className="inv-kicker">{language === 'te' ? (isGroom ? 'వరుడు' : 'వధువు') : (isGroom ? 'THE GROOM' : 'THE BRIDE')}</span>
        {language === 'en' ? (
          <>
            <h2>{isGroom ? 'Chi. Abhinav Viswateja' : 'Chi. La. Sow. Chandana'}</h2>
            <span className="inv-copy-divider" aria-hidden="true" />
            <p className="inv-relationship">{isGroom ? 'Son of' : 'Daughter of'}</p>
            <p className="inv-parent-names">{isGroom ? 'Sri Kota Sivaprasad' : 'Sri Siddula Sainath'}<span> &amp; </span>{isGroom ? 'Smt. Hima Sailaja' : 'Smt. Naga Swapna'}</p>
          </>
        ) : (
          <>
            <p className="inv-parent-names inv-parent-names--telugu">
              {isGroom ? 'శ్రీ కోట శివప్రసాద్ – శ్రీమతి హిమశైలజ' : 'శ్రీ సిద్ధుల సాయినాథ్ – శ్రీమతి నాగస్వప్న'}
            </p>
            <p className="inv-relationship">{isGroom ? 'గారి జ్యేష్ఠ పుత్రుడు' : 'గారి పుత్రిక'}</p>
            <span className="inv-copy-divider" aria-hidden="true" />
            <h2>{isGroom ? 'చి. అభినవ్ విశ్వతేజ' : 'చి. లా. సౌ. చందన'}</h2>
          </>
        )}
      </div>
    </div>
  );
}

function VivahamuScene({ language }: { language: Language }) {
  return (
    <div className="inv-scene inv-scene--vivahamu" lang={language}>
      <div className="inv-ceremony__portrait">
        <InvitationImage src="/images/couple.webp" alt="Photograph of the couple" />
      </div>
      <h2 className="inv-ceremony__heading">{language === 'te' ? 'వివాహ మహోత్సవము' : 'Our Wedding'}</h2>
      <div className="inv-ceremony__emblem">
        <InvitationImage src="/images/ceremony/panigrahanam.webp" alt="Traditional panigrahanam wedding emblem with the couple’s names" />
      </div>
      <div className="inv-ceremony__date" aria-label={language === 'te' ? 'శనివారం, 12 డిసెంబర్ 2026' : 'Saturday, 12 December 2026'}>
        <span className="inv-ceremony__month">{language === 'te' ? 'డిసెంబర్' : 'December'}</span>
        <div className="inv-ceremony__date-ornament">
          <InvitationImage src="/images/ceremony/date-ornament.webp" alt="12, 2026" />
        </div>
        <span className="inv-ceremony__weekday">{language === 'te' ? 'శనివారం' : 'Saturday'}</span>
      </div>
      <p className="inv-ceremony__time">{language === 'te' ? 'సాయంత్రం 7:45 నుండి 9:30 వరకు' : '7:45 PM – 9:30 PM'}</p>
    </div>
  );
}

function VenueScene({ language }: { language: Language }) {
  return (
    <div className="inv-scene inv-scene--venue" lang={language}>
      <div className="inv-venue__content" key={`venue-${language}`}>
        <span className="inv-kicker">{language === 'te' ? 'శుభ వివాహ వేడుక' : 'THE CELEBRATION'}</span>
        <h2>{language === 'te' ? 'శుభ ముహూర్తము' : 'Muhurtham'}</h2>
        <p className="inv-venue__important">{language === 'te' ? 'శనివారం, 12 డిసెంబర్ 2026' : 'Saturday, 12 December 2026'}</p>
        <p>{language === 'te' ? 'సాయంత్రం 7:45 నుండి రాత్రి 9:30 వరకు' : 'Between 7:45 PM and 9:30 PM'}</p>
        <p>{language === 'te' ? 'పుష్కర కాలం: రాత్రి 8:27' : 'Pushkara Kalam: 8:27 PM'}</p>
        <p className="inv-venue__secondary">{language === 'te' ? 'ఉత్తరాషాఢ నక్షత్రం, కర్కాటక లగ్నం' : 'Uttarashada Nakshatram · Karkataka Lagnam'}</p>
        <span className="inv-venue__ornament" aria-hidden="true">❧</span>
        <h2>{language === 'te' ? 'కళ్యాణ వేదిక' : 'Wedding Venue'}</h2>
        <p className="inv-venue__important">{language === 'te' ? 'T.G.K. కళ్యాణ మండపము' : 'T.G.K. Kalyana Mandapam'}</p>
        <p>{language === 'te' ? 'బుర్రిపాలెం రోడ్, తెనాలి' : 'Burripalem Road, Tenali'}</p>
        <span className="inv-venue__ornament" aria-hidden="true">❧</span>
        <h3>{language === 'te' ? 'విందు భోజనము' : 'Dinner'}</h3>
        <p>{language === 'te' ? 'రాత్రి 8:00 గంటల నుండి' : '8:00 PM onwards'}</p>
      </div>
    </div>
  );
}

function FinalScene() {
  return (
    <div className="inv-scene inv-scene--final">
      <div className="inv-final__slokam" lang="te">
        <span className="inv-final__ornament" aria-hidden="true">❧</span>
        <p>వాగర్థావివ సంపృక్తౌ<br />వాగర్థప్రతిపత్తయే ।<br />జగతః పితరౌ వందే<br />పార్వతీపరమేశ్వరౌ ॥</p>
      </div>
      <div className="inv-final__invitation" lang="en">
        <p>We solicit your gracious presence with family and friends on the auspicious occasion of the marriage.</p>
        <span>With best compliments from</span>
        <strong>Near &amp; Dear</strong>
      </div>
    </div>
  );
}

type Petal = {
  x: number; y: number; startY: number; endY: number;
  vx: number; spin: number; angle: number; size: number; depth: number;
  age: number; fallTime: number; falling: boolean; sway: number; alpha: number;
};

// The canvas is intentionally persistent across sections. Batches never reset or
// get re-used; older petals drift off the viewport naturally, with extra breeze
// while the user scrolls. Only canvas pixels are redrawn each animation frame.
function PersistentPetals({ burst, scrollEnergy }: { burst: number; scrollEnergy: RefObject<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const dimensions = useRef({ width: 1, height: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    let animationId = 0;
    let last = 0;
    let reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => { reduced = motionQuery.matches; };
    motionQuery.addEventListener?.('change', updateMotion);

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
      dimensions.current = { width: bounds.width, height: bounds.height };
      canvas.width = Math.ceil(bounds.width * ratio);
      canvas.height = Math.ceil(bounds.height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const paint = (stamp: number) => {
      if (!last) last = stamp;
      const dt = Math.min((stamp - last) / 1000, 0.05);
      last = stamp;
      const { width, height } = dimensions.current;
      ctx.clearRect(0, 0, width, height);
      const boost = Math.min(3.2, scrollEnergy.current || 0);
      scrollEnergy.current = Math.max(0, boost - dt * 1.15);
      const petals = petalsRef.current;
      for (let i = petals.length - 1; i >= 0; i -= 1) {
        const p = petals[i];
        if (p.age < 0) { p.age += dt; continue; }
        if (!reduced) {
          p.age += dt;
          if (p.falling) {
            const progress = clamp01(p.age / p.fallTime);
            p.y = p.startY + (p.endY - p.startY) * (1 - Math.pow(1 - progress, 2.2));
            p.x += p.vx * dt * 0.7 + Math.sin(p.age * 3 + p.sway) * dt * 8;
            if (progress >= 1) p.falling = false;
          } else {
            p.x += p.vx * dt * (1 + boost * 1.35);
            p.y += Math.sin(p.age * 1.3 + p.sway) * dt * 1.9;
          }
          p.angle += p.spin * dt * (1 + boost * 0.3);
        } else if (p.falling) {
          p.y = p.endY;
          p.falling = false;
        }
        if (p.x < -width * 0.2 || p.x > width * 1.2 || p.y > height * 1.25) {
          petals.splice(i, 1);
          continue;
        }
        const fallFraction = clamp01(p.age / p.fallTime);
        const apparentSize = p.size * (0.55 + fallFraction * 0.45) * p.depth;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.globalAlpha = p.alpha * Math.min(1, p.age * 3);
        ctx.shadowColor = 'rgba(109, 60, 57, .16)';
        ctx.shadowBlur = apparentSize * 0.4;
        ctx.shadowOffsetY = apparentSize * 0.17;
        const petalGradient = ctx.createLinearGradient(-apparentSize, -apparentSize, apparentSize, apparentSize);
        petalGradient.addColorStop(0, '#fff3e8');
        petalGradient.addColorStop(0.55, '#edb8b6');
        petalGradient.addColorStop(1, '#b87f85');
        ctx.fillStyle = petalGradient;
        ctx.beginPath();
        ctx.moveTo(-apparentSize * 0.48, apparentSize * 0.15);
        ctx.quadraticCurveTo(-apparentSize * 0.6, -apparentSize * 0.75, apparentSize * 0.56, -apparentSize * 0.36);
        ctx.quadraticCurveTo(apparentSize * 0.55, apparentSize * 0.28, -apparentSize * 0.48, apparentSize * 0.15);
        ctx.fill();
        ctx.restore();
      }
      animationId = window.requestAnimationFrame(paint);
    };
    animationId = window.requestAnimationFrame(paint);
    return () => {
      window.cancelAnimationFrame(animationId);
      observer.disconnect();
      motionQuery.removeEventListener?.('change', updateMotion);
    };
  }, [scrollEnergy]);

  useEffect(() => {
    if (!burst) return;
    const { width, height } = dimensions.current;
    const count = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 7 : 17;
    const batch: Petal[] = Array.from({ length: count }, (_, i) => {
      const direction = Math.random() < 0.5 ? -1 : 1;
      return {
        x: width * (Math.random() * 1.12 - 0.06),
        y: -height * (0.04 + Math.random() * 0.35),
        startY: -height * (0.04 + Math.random() * 0.35),
        endY: height * (0.56 + Math.random() * 0.40),
        vx: direction * (6 + Math.random() * 20),
        spin: direction * (0.45 + Math.random() * 1.0),
        angle: Math.random() * Math.PI * 2,
        size: Math.max(8, Math.min(width / 27, 17)) * (0.65 + Math.random() * 0.8),
        depth: 0.7 + Math.random() * 0.55,
        age: -Math.random() * 0.48 - i * 0.025,
        fallTime: 1.5 + Math.random() * 1.3,
        falling: true,
        sway: Math.random() * 6.28,
        alpha: 0.5 + Math.random() * 0.36,
      };
    });
    // Never discard a previously fallen bunch; each petal remains until it
    // drifts naturally beyond the canvas edges.
    petalsRef.current.push(...batch);
  }, [burst]);

  return <canvas ref={canvasRef} className="inv-petals-canvas" aria-hidden="true" />;
}

export default function InvitationExperience({ onReplay }: { onReplay: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);
  const currentMidpoint = useRef(-1);
  const scrollEnergy = useRef(0);
  const animationFrame = useRef(0);
  const [position, setPosition] = useState(0);
  const [language, setLanguage] = useState<Language>('te');
  const [introComplete, setIntroComplete] = useState(false);
  const [burst, setBurst] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [finalReplayReady, setFinalReplayReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroComplete(true), FIRST_SCENE_REVEAL_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const updateScroll = () => {
    const scroll = scrollRef.current;
    if (!scroll || animationFrame.current) return;
    const delta = Math.abs(scroll.scrollTop - lastScrollTop.current);
    lastScrollTop.current = scroll.scrollTop;
    scrollEnergy.current = Math.max(scrollEnergy.current, Math.min(3.1, delta / 18));
    animationFrame.current = requestAnimationFrame(() => {
      animationFrame.current = 0;
      const next = scroll.scrollTop / Math.max(scroll.clientHeight, 1);
      setPosition(Math.min(SCENES.length - 1, Math.max(0, next)));
    });
  };

  useEffect(() => () => window.cancelAnimationFrame(animationFrame.current), []);

  // Only crossing a NEW section's focus point allows an earlier section to
  // trigger another FRESH bunch. Reverse scrolling within a section does not.
  useEffect(() => {
    if (!introComplete) return;
    const nearest = Math.round(position);
    if (Math.abs(position - nearest) > MIDPOINT_TOLERANCE) return;
    if (nearest === currentMidpoint.current) return;
    currentMidpoint.current = nearest;
    setFocusedIndex(nearest);
    setBurst((value) => value + 1);
  }, [introComplete, position]);

  const atFinalMidpoint = Math.abs(position - (SCENES.length - 1)) <= 0.22;
  useEffect(() => {
    if (focusedIndex !== SCENES.length - 1 || !atFinalMidpoint) {
      setFinalReplayReady(false);
      return;
    }
    const timer = window.setTimeout(() => setFinalReplayReady(true), FINAL_PETAL_SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, [focusedIndex, atFinalMidpoint]);

  const showingFinal = position > 4.68;
  const showLanguage = introComplete && position > 0.58 && !showingFinal;
  const showCornerReplay = !showingFinal;

  return (
    <div className="inv-experience" aria-label="Wedding invitation details">
      <div className="inv-scene-stage" aria-live="off">
        {SCENES.map((id, index) => (
          <section
            key={id}
            className={`inv-scene-holder inv-scene-holder--${id}`}
            style={{ ...getScenePose(index, position), zIndex: SCENES.length - index }}
            aria-hidden={Math.abs(position - index) > 0.55}
          >
            {id === 'pilupu' && <PilupuScene />}
            {id === 'groom' && <PersonScene person="groom" language={language} />}
            {id === 'bride' && <PersonScene person="bride" language={language} />}
            {id === 'vivahamu' && <VivahamuScene language={language} />}
            {id === 'venue' && <VenueScene language={language} />}
            {id === 'final' && <FinalScene />}
          </section>
        ))}
      </div>
      <PersistentPetals burst={burst} scrollEnergy={scrollEnergy} />

      <div
        ref={scrollRef}
        className={`inv-scroll-viewport ${introComplete ? 'inv-scroll-viewport--enabled' : ''}`}
        onScroll={updateScroll}
        tabIndex={introComplete ? 0 : -1}
        role="region"
        aria-label="Scroll through the wedding invitation sections"
        aria-disabled={!introComplete}
      >
        <div className="inv-scroll-track" aria-hidden="true">
          {SCENES.map((id) => <div key={id} className="inv-scroll-stop" />)}
        </div>
      </div>

      <div className="inv-controls" aria-label="Invitation controls">
        <div className={`inv-language-toggle ${showLanguage ? 'inv-control--shown' : ''}`} aria-label="Invitation language">
          <button className={language === 'te' ? 'is-active' : ''} aria-pressed={language === 'te'} onClick={() => setLanguage('te')} type="button" tabIndex={showLanguage ? 0 : -1}>తెలుగు</button>
          <span aria-hidden="true">|</span>
          <button className={language === 'en' ? 'is-active' : ''} aria-pressed={language === 'en'} onClick={() => setLanguage('en')} type="button" tabIndex={showLanguage ? 0 : -1}>English</button>
        </div>
        {showCornerReplay && (
          <button className="inv-replay inv-replay--corner" onClick={onReplay} type="button" aria-label="Replay invitation" title="Replay invitation">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a9 9 0 1 1 1 6M3 4v6h6" /></svg>
          </button>
        )}
        {showingFinal && finalReplayReady && (
          <button className="inv-replay inv-replay--final" onClick={onReplay} type="button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a9 9 0 1 1 1 6M3 4v6h6" /></svg>
            <span>Replay</span>
          </button>
        )}
      </div>
    </div>
  );
}
