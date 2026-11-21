import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import './InvitationExperience.css';

type Language = 'te' | 'en';
type SceneId = 'pilupu' | 'groom' | 'bride' | 'vivahamu' | 'venue' | 'final';
const SCENES: SceneId[] = ['pilupu', 'groom', 'bride', 'vivahamu', 'venue', 'final'];

/**
 * Scroll distances are in viewport heights. These values are not keyframes:
 * every DOM element is interpolated continuously from the native scrollTop.
 * Incoming ranges overlap, all arrivals finish before exits begin, and there
 * is an empty interval before the next scene starts.
 */
const FIRST_SCENE_SPAN = 2.2;
const SCENE_SPAN = 4.5;
const INCOMING_SCALE = 0.32;
const OUTGOING_SCALE = 2.2;
const ENTER_STAGGER = 0.94;
const ENTER_DURATION = 0.9;
const EXIT_BEGIN = 2.35;
const EXIT_STAGGER = 0.74;
const EXIT_DURATION = 0.79;
const FIRST_EXIT_BEGIN = 0.14;
const FIRST_EXIT_STAGGER = 0.34;
const FIRST_EXIT_DURATION = 1.12;
const FOCUS_AT = 2.16;
const FINAL_PETAL_SETTLE_MS = 4200;
const PILUPU_INTRO_MS = 8000;
const WORD_ORDER_GAP = 0.21;
const TOTAL_SCROLL_UNITS = FIRST_SCENE_SPAN + (SCENES.length - 2) * SCENE_SPAN + FOCUS_AT;
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (n: number) => { const x = clamp01(n); return x * x * (3 - 2 * x); };
const sceneStart = (index: number) => index === 0 ? 0 : FIRST_SCENE_SPAN + (index - 1) * SCENE_SPAN;

type MotionElement = { node: HTMLElement; order: number; relX: number; relY: number; };
type MotionScene = { holder: HTMLElement; elements: MotionElement[]; maxOrder: number; photo: HTMLElement | null; };

function InvitationImage({ src, alt, className = '', order }: { src: string; alt: string; className?: string; order?: number }) {
  return <img className={`${className} ${order === undefined ? '' : 'inv-motion'}`} data-motion-order={order} src={src} alt={alt} draggable={false} decoding="async" />;
}
function MotionBlock({ children, order, className = '' }: { children: ReactNode; order: number; className?: string }) {
  return <div className={`inv-motion ${className}`} data-motion-order={order}>{children}</div>;
}
// Each word gets its own scroll window; no setTimeout or CSS entrance animation.
function WordLine({ text, order, className = '' }: { text: string; order: number; className?: string }) {
  return (
    <span className={`inv-word-line ${className}`} role="text" aria-label={text}>
      {text.trim().split(/\s+/).map((word, i) => (
        <span className="inv-word inv-motion" data-motion-order={order + i * WORD_ORDER_GAP} key={`${i}-${word}`} aria-hidden="true">{word}</span>
      ))}
    </span>
  );
}

function PilupuScene({ introComplete }: { introComplete: boolean }) {
  return <div className={`inv-scene inv-scene--pilupu ${introComplete ? 'inv-pilupu--ready' : ''}`} lang="te">
    <InvitationImage className="inv-intro__deity inv-intro__deity--left" src="/images/pilupu/god-left.webp" alt="శ్రీ గణేశుడు" order={0} />
    <InvitationImage className="inv-intro__deity inv-intro__deity--right" src="/images/pilupu/god-right.webp" alt="పార్వతీ పరమేశ్వరులు" order={1} />
    <InvitationImage className="inv-intro__title" src="/images/pilupu/text-center.webp" alt="కోట వారి పెళ్లిపిలుపు" order={2} />
  </div>;
}

function PhotoFrame({ person }: { person: 'groom' | 'bride' | 'couple' }) {
  const couple = person === 'couple';
  return <div className={`inv-photo-frame ${couple ? 'inv-photo-frame--couple' : ''}`} data-depth-photo="true">
    <div className="inv-photo-frame__paper" aria-hidden="true" />
    <InvitationImage className="inv-photo-frame__image" src={`/images/${person}.webp`} alt={couple ? 'The bride and groom' : `The ${person}`} />
    <span className="inv-photo-frame__sparkle inv-photo-frame__sparkle--a" aria-hidden="true">✦</span>
    <span className="inv-photo-frame__sparkle inv-photo-frame__sparkle--b" aria-hidden="true">✧</span>
    <span className="inv-photo-frame__sparkle inv-photo-frame__sparkle--c" aria-hidden="true">✦</span>
    {couple && <><span className="inv-photo-frame__bloom inv-photo-frame__bloom--a" aria-hidden="true" /><span className="inv-photo-frame__bloom inv-photo-frame__bloom--b" aria-hidden="true" /><span className="inv-photo-frame__bloom inv-photo-frame__bloom--c" aria-hidden="true" /></>}
    <span className="inv-photo-frame__sheen" aria-hidden="true" />
  </div>;
}

function PersonScene({ person, language }: { person: 'groom' | 'bride'; language: Language }) {
  const groom = person === 'groom';
  const header = language === 'te' ? (groom ? 'వరుడు' : 'వధువు') : (groom ? 'THE GROOM' : 'THE BRIDE');
  const lines = language === 'en'
    ? [
        { text: groom ? 'Chi. Abhinav Viswateja' : 'Chi. La. Sow. Chandana', kind: 'name' },
        { text: groom ? 'Son of' : 'Daughter of', kind: 'relation' },
        { text: groom ? 'Sri Kota Sivaprasad' : 'Sri Siddula Sainath', kind: 'parents' },
        { text: groom ? '& Smt. Hima Sailaja' : '& Smt. Naga Swapna', kind: 'parents' },
      ]
    : [
        { text: groom ? 'శ్రీ కోట శివప్రసాద్ –' : 'శ్రీ సిద్ధుల సాయినాథ్ –', kind: 'parents' },
        { text: groom ? 'శ్రీమతి హిమశైలజ' : 'శ్రీమతి నాగస్వప్న', kind: 'parents' },
        { text: groom ? 'గారి జ్యేష్ఠ పుత్రుడు' : 'గారి పుత్రిక', kind: 'relation' },
        { text: groom ? 'చి. అభినవ్ విశ్వతేజ' : 'చి. లా. సౌ. చందన', kind: 'name' },
      ];
  return <div className={`inv-scene inv-scene--person inv-scene--${person}`} lang={language}>
    <div className="inv-person__layout">
      <div className="inv-person__header"><WordLine text={header} order={0} /></div>
      <div className="inv-person__copy">
        {lines.map((line, index) => (
          <div key={`${index}-${line.text}`} className={`inv-person__line inv-person__line--${line.kind}`}>
            <WordLine text={line.text} order={1.15 + index * 1.22} />
          </div>
        ))}
      </div>
      <MotionBlock className="inv-person__portrait" order={7.65}><PhotoFrame person={person} /></MotionBlock>
    </div>
  </div>;
}

function VivahamuScene({ language }: { language: Language }) {
  return <div className="inv-scene inv-scene--vivahamu" lang={language}>
    <div className="inv-ceremony__layout">
      <div className="inv-ceremony__heading"><WordLine text={language === 'te' ? 'వివాహ మహోత్సవము' : 'Our Wedding'} order={0} /></div>
      <MotionBlock className="inv-ceremony__portrait" order={1.15}><PhotoFrame person="couple" /></MotionBlock>
      <div className="inv-ceremony__date">
        <div className="inv-ceremony__month"><WordLine text={language === 'te' ? 'డిసెంబర్' : 'December'} order={3.65} /></div>
        <MotionBlock className="inv-ceremony__date-ornament" order={3.3}><InvitationImage src="/images/ceremony/date-ornament.webp" alt="12 2026" /></MotionBlock>
        <div className="inv-ceremony__weekday"><WordLine text={language === 'te' ? 'స్థిరవారం' : 'Saturday'} order={3.95} /></div>
      </div>
      <div className="inv-ceremony__time"><WordLine text={language === 'te' ? 'సాయంత్రం 7:45 నుండి రాత్రి 9:30 వరకు' : 'Between 7:45 PM and 9:30 PM'} order={5} /></div>
    </div>
  </div>;
}

function CurtainDrawing() {
  return <svg viewBox="0 0 360 236" preserveAspectRatio="none" aria-hidden="true" className="inv-venue__curtain-svg">
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 228 V8 H355 V228" />
      <path d="M12 225 C26 150 24 99 26 17 M22 226 C37 150 37 95 38 17 M34 226 C47 159 48 91 50 17 M349 225 C334 150 336 99 334 17 M338 225 C323 150 323 95 322 17 M326 225 C313 159 312 91 310 17" />
      <path d="M48 15 Q70 53 92 15 Q114 53 136 15 Q158 53 180 15 Q202 53 224 15 Q246 53 268 15 Q290 53 312 15" />
      <path d="M48 18 Q70 64 92 18 Q114 64 136 18 Q158 64 180 18 Q202 64 224 18 Q246 64 268 18 Q290 64 312 18" />
      <path d="M48 21 Q70 73 92 21 Q114 73 136 21 Q158 73 180 21 Q202 73 224 21 Q246 73 268 21 Q290 73 312 21" />
      <path d="M6 116 Q20 121 35 116 M325 116 Q340 121 354 116" strokeWidth="3" />
    </g>
  </svg>;
}
function VenueScene({ language }: { language: Language }) {
  return <div className="inv-scene inv-scene--venue" lang={language}>
    <div className="inv-venue__layout">
      <div className="inv-venue__heading"><WordLine text={language === 'te' ? 'కళ్యాణ వేదిక' : 'Wedding Venue'} order={0} /></div>
      <div className="inv-venue__curtains">
        <MotionBlock className="inv-venue__curtain-layer" order={1.25}><CurtainDrawing /></MotionBlock>
        <div className="inv-venue__address">
          <div className="inv-venue__address-main"><WordLine text={language === 'te' ? 'T.G.K. కళ్యాణ మండపము' : 'T.G.K. Kalyana Mandapam'} order={2.65} /></div>
          <div className="inv-venue__address-sub"><WordLine text={language === 'te' ? 'బుర్రిపాలెం రోడ్, తెనాలి' : 'Burripalem Road, Tenali'} order={4} /></div>
        </div>
      </div>
      <div className="inv-venue__dinner-heading"><WordLine text={language === 'te' ? 'విందు భోజనము' : 'Dinner'} order={5.6} /></div>
      <div className="inv-venue__dinner-time"><WordLine text={language === 'te' ? 'రాత్రి 8:00 గంటల నుండి' : '8:00 PM onwards'} order={6.7} /></div>
    </div>
  </div>;
}
function FinalScene() {
  return <div className="inv-scene inv-scene--final">
    <div className="inv-final__layout">
      <div className="inv-final__slokam" lang="te">
        <div className="inv-final__slokam-line"><WordLine text="వాగర్థావివ సంపృక్తౌ వాగర్థ ప్రతిపత్తయే ।" order={0} /></div>
        <div className="inv-final__slokam-line"><WordLine text="జగతః పితరౌ వందే పార్వతీ పరమేశ్వరౌ ॥" order={2.1} /></div>
      </div>
      <div className="inv-final__invitation" lang="en"><WordLine text="We solicit your gracious presence with family and friends on the auspicious occasion of the marriage." order={5} /></div>
    </div>
  </div>;
}

type Petal = {
  x: number; y: number; startY: number; endY: number;
  vx: number; spin: number; angle: number; size: number; depth: number;
  age: number; fallTime: number; falling: boolean; sway: number; alpha: number;
};

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
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
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
        const gradient = ctx.createLinearGradient(-apparentSize, -apparentSize, apparentSize, apparentSize);
        gradient.addColorStop(0, '#fff3e8');
        gradient.addColorStop(0.55, '#edb8b6');
        gradient.addColorStop(1, '#b87f85');
        ctx.fillStyle = gradient;
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
    petalsRef.current.push(...batch);
  }, [burst]);

  return <canvas ref={canvasRef} className="inv-petals-canvas" aria-hidden="true" />;
}


// Offset measurements are made with the transforms removed. This gives every
// word and photo its real destination position, including after language swaps
// and orientation changes. The far-away start is the VIEWPORT center.
function measureScenes(holders: HTMLElement[]): MotionScene[] {
  return holders.map((holder) => {
    const nodes = Array.from(holder.querySelectorAll<HTMLElement>('[data-motion-order]'));
    const preserved = nodes.map((node) => node.style.transform);
    nodes.forEach((node) => { node.style.transform = 'none'; });
    const stage = holder.getBoundingClientRect();
    const elements = nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return {
        node,
        order: Number(node.dataset.motionOrder || 0),
        relX: box.left + box.width / 2 - (stage.left + stage.width / 2),
        relY: box.top + box.height / 2 - (stage.top + stage.height / 2),
      };
    });
    nodes.forEach((node, index) => { node.style.transform = preserved[index]; });
    return {
      holder,
      elements,
      maxOrder: Math.max(1, ...elements.map((element) => element.order)),
      photo: holder.querySelector<HTMLElement>('[data-depth-photo]'),
    };
  });
}

function applyMotion(element: MotionElement, inProgress: number, outProgress: number, reduced: boolean) {
  const enter = smooth(inProgress);
  const leave = smooth(outProgress);
  const scale = reduced ? 1 : (INCOMING_SCALE + (1 - INCOMING_SCALE) * enter) * (1 - leave) + OUTGOING_SCALE * leave;
  // Parent is not zoomed. A child's final location is fixed by grid layout.
  // On entry translate from the center; on exit continue outwards with scale.
  const x = reduced ? 0 : -element.relX * (1 - enter) + element.relX * .35 * leave;
  const y = reduced ? 0 : -element.relY * (1 - enter) + element.relY * .35 * leave;
  const opacity = clamp01(enter * (1 - leave));
  const blur = reduced ? 0 : (1 - enter) * 7 + leave * 4;
  element.node.style.opacity = `${opacity}`;
  element.node.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${scale.toFixed(4)})`;
  element.node.style.filter = `blur(${blur.toFixed(2)}px)`;
}

function applyPhotoReveal(photo: HTMLElement | null, local: number) {
  if (!photo) return;
  // Frame appears empty first. Its photograph is scrubbed into view near the
  // end of the final frame's arrival; rewinding scroll reverses the reveal.
  const amount = smooth((local - 1.62) / 0.45);
  const image = photo.querySelector<HTMLElement>('.inv-photo-frame__image');
  if (image) {
    image.style.opacity = `${amount}`;
    image.style.clipPath = `inset(${((1 - amount) * 95).toFixed(2)}% 0 0 0)`;
    image.style.filter = `blur(${((1 - amount) * 6).toFixed(2)}px)`;
  }
  const sparkle = Math.sin(amount * Math.PI) ** 2;
  photo.style.setProperty('--photo-sparkle', `${sparkle}`);
  photo.style.setProperty('--photo-bloom', `${amount}`);
}

export default function InvitationExperience({ onReplay }: { onReplay: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const holderRefs = useRef<HTMLElement[]>([]);
  const metrics = useRef<MotionScene[]>([]);
  const raf = useRef(0);
  const scrollUnit = useRef(0);
  const previousTop = useRef(0);
  const lastFocus = useRef(-1);
  const finalAtRest = useRef(false);
  const scrollEnergy = useRef(0);
  const hintTimer = useRef<number | undefined>(undefined);
  const finalTimer = useRef<number | undefined>(undefined);
  const [introComplete, setIntroComplete] = useState(false);
  const [language, setLanguage] = useState<Language>('te');
  const [burst, setBurst] = useState(0);
  const [activeScene, setActiveScene] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [finalReplayReady, setFinalReplayReady] = useState(false);
  const [finalFocused, setFinalFocused] = useState(false);

  const scheduleHint = () => {
    window.clearTimeout(hintTimer.current);
    setShowHint(false);
    if (!introComplete || scrollUnit.current > .28) return;
    hintTimer.current = window.setTimeout(() => {
      if (scrollUnit.current <= .28) setShowHint(true);
    }, 5000);
  };

  const draw = () => {
    const scroll = scrollRef.current;
    if (!scroll || metrics.current.length !== SCENES.length) return;
    const units = scroll.scrollTop / Math.max(1, scroll.clientHeight);
    scrollUnit.current = units;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let active = 0;
    metrics.current.forEach((scene, index) => {
      const local = units - sceneStart(index);
      if (index > 0 && units >= sceneStart(index)) active = index;
      const last = index === SCENES.length - 1;
      const inRange = index === 0 ? local < FIRST_SCENE_SPAN : local >= -0.06 && (last || local <= 4.0);
      scene.holder.style.visibility = inRange ? 'visible' : 'hidden';
      if (!inRange) return;

      // Initial Pilupu entrance plays on opening, then its EXIT is scrubbed.
      // The other five sections are entirely scroll-scrubbed both ways.
      if (index === 0 && !introComplete) return;
      for (const element of scene.elements) {
        const order = element.order / scene.maxOrder;
        if (index === 0) {
          const outgoing = (local - (FIRST_EXIT_BEGIN + order * FIRST_EXIT_STAGGER)) / FIRST_EXIT_DURATION;
          applyMotion(element, 1, outgoing, reduced);
        } else {
          const entering = (local - order * ENTER_STAGGER) / ENTER_DURATION;
          const outgoing = last ? 0 : (local - EXIT_BEGIN - order * EXIT_STAGGER) / EXIT_DURATION;
          applyMotion(element, entering, outgoing, reduced);
        }
      }
      if (index > 0) applyPhotoReveal(scene.photo, local);
    });
    setActiveScene((previous) => previous === active ? previous : active);

    // Persistent petals: a new burst only after a DIFFERENT section reaches
    // its resting center. Old petals are never reused or restarted.
    if (introComplete) {
      const inPilupu = units <= .035;
      const newFocus = inPilupu ? 0 : SCENES.findIndex((_, i) => i > 0 && Math.abs(units - sceneStart(i) - FOCUS_AT) <= .12);
      if (newFocus >= 0 && newFocus !== lastFocus.current) {
        lastFocus.current = newFocus;
        setBurst((previous) => previous + 1);
        if (newFocus !== SCENES.length - 1) {
          window.clearTimeout(finalTimer.current);
          finalAtRest.current = false;
          setFinalReplayReady(false);
        }
      }
      // The final Replay control needs its own *hold* check. Moving back
      // before the words settle cancels the delay but never reuses petals.
      const lastStart = sceneStart(SCENES.length - 1);
      const restingFinal = units >= lastStart + FOCUS_AT - .10;
      setFinalFocused((previous) => previous === restingFinal ? previous : restingFinal);
      if (restingFinal && lastFocus.current === SCENES.length - 1 && !finalAtRest.current) {
        finalAtRest.current = true;
        window.clearTimeout(finalTimer.current);
        finalTimer.current = window.setTimeout(() => setFinalReplayReady(true), FINAL_PETAL_SETTLE_MS);
      } else if (!restingFinal && finalAtRest.current) {
        finalAtRest.current = false;
        window.clearTimeout(finalTimer.current);
        setFinalReplayReady(false);
      }
    }
  };

  const scheduleDraw = () => {
    if (raf.current) return;
    raf.current = window.requestAnimationFrame(() => { raf.current = 0; draw(); });
  };
  const onScroll = () => {
    const top = scrollRef.current?.scrollTop ?? 0;
    const delta = Math.abs(top - previousTop.current);
    previousTop.current = top;
    if (delta > .05) {
      scrollEnergy.current = Math.max(scrollEnergy.current, Math.min(3.1, delta / 18));
      setShowHint(false);
      window.clearTimeout(hintTimer.current);
      // Restart the idle prompt only if still on the first page.
      if (introComplete) scheduleHint();
    }
    scheduleDraw();
  };

  // Measure the real destinations after React lays out each language's text.
  useLayoutEffect(() => {
    const refresh = () => {
      metrics.current = measureScenes(holderRefs.current);
      scheduleDraw();
    };
    refresh();
    const observer = new ResizeObserver(refresh);
    holderRefs.current.forEach((node) => observer.observe(node));
    // If a WebP loads after initial layout, recompute the destination centers.
    const images = holderRefs.current.flatMap((node) => Array.from(node.querySelectorAll('img')));
    images.forEach((image) => image.addEventListener('load', refresh));
    window.addEventListener('resize', refresh);
    return () => {
      // The pending frame belongs to this measurement cycle. Clear its ID
      // before StrictMode/layout-effect remounts try to schedule the next one.
      if (raf.current) {
        window.cancelAnimationFrame(raf.current);
        raf.current = 0;
      }
      observer.disconnect();
      images.forEach((image) => image.removeEventListener('load', refresh));
      window.removeEventListener('resize', refresh);
    };
  }, [language, introComplete]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIntroComplete(true);
      lastFocus.current = 0;
      setBurst((previous) => previous + 1);
    }, PILUPU_INTRO_MS);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (introComplete) scheduleHint();
    return () => window.clearTimeout(hintTimer.current);
  }, [introComplete]);
  useEffect(() => () => {
    // React StrictMode cleans up and re-runs effects in development. A canceled
    // request must release its ID; otherwise scheduleDraw() sees a nonzero ID
    // forever and none of the scroll-controlled scenes can render.
    if (raf.current) {
      window.cancelAnimationFrame(raf.current);
      raf.current = 0;
    }
    window.clearTimeout(hintTimer.current);
    window.clearTimeout(finalTimer.current);
  }, []);

  // Keep the earlier controls while the last scene approaches; switch only
  // when its final words have settled and the petal-focus point is reached.
  const showingFinal = activeScene === SCENES.length - 1 && finalFocused;
  const showLanguage = introComplete && activeScene > 0 && !showingFinal;
  return <div className="inv-experience" aria-label="Wedding invitation details">
    <div className="inv-scene-stage" aria-live="off">
      {SCENES.map((scene, index) => (
        <section key={scene} ref={(node) => { if (node) holderRefs.current[index] = node; }} className={`inv-scene-holder inv-scene-holder--${scene}`} aria-label={`${scene} section`}>
          {scene === 'pilupu' && <PilupuScene introComplete={introComplete} />}
          {scene === 'groom' && <PersonScene person="groom" language={language} />}
          {scene === 'bride' && <PersonScene person="bride" language={language} />}
          {scene === 'vivahamu' && <VivahamuScene language={language} />}
          {scene === 'venue' && <VenueScene language={language} />}
          {scene === 'final' && <FinalScene />}
        </section>
      ))}
    </div>
    <PersistentPetals burst={burst} scrollEnergy={scrollEnergy} />
    <div
      ref={scrollRef}
      className={`inv-scroll-viewport ${introComplete ? 'inv-scroll-viewport--enabled' : ''}`}
      onScroll={onScroll}
      tabIndex={introComplete ? 0 : -1}
      role="region"
      aria-label="Scroll through the wedding invitation sections"
      aria-disabled={!introComplete}
    >
      <div className="inv-scroll-track" style={{ height: `${(TOTAL_SCROLL_UNITS + 1) * 100}dvh` }} aria-hidden="true" />
    </div>
    <div className={`inv-scroll-hint ${showHint && activeScene === 0 ? 'inv-scroll-hint--visible' : ''}`} aria-hidden="true"><span>Scroll to explore</span><span className="inv-scroll-hint__chevron">⌄</span></div>
    <div className="inv-controls" aria-label="Invitation controls">
      <div className={`inv-language-toggle ${showLanguage ? 'inv-control--shown' : ''}`} aria-label="Invitation language">
        <button className={language === 'te' ? 'is-active' : ''} aria-pressed={language === 'te'} type="button" tabIndex={showLanguage ? 0 : -1} onClick={() => setLanguage('te')}>తెలుగు</button>
        <span aria-hidden="true">|</span>
        <button className={language === 'en' ? 'is-active' : ''} aria-pressed={language === 'en'} type="button" tabIndex={showLanguage ? 0 : -1} onClick={() => setLanguage('en')}>English</button>
      </div>
      {!showingFinal && <button className="inv-replay inv-replay--corner" onClick={onReplay} type="button" aria-label="Replay invitation" title="Replay invitation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a9 9 0 1 1 1 6M3 4v6h6" /></svg></button>}
      {showingFinal && finalReplayReady && <button className="inv-replay inv-replay--final" onClick={onReplay} type="button"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10a9 9 0 1 1 1 6M3 4v6h6" /></svg><span>Replay</span></button>}
    </div>
  </div>;
}
