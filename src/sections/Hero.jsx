import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Record } from "./shared.jsx";

// One letter of the wordmark. It thins and widens as the cursor gets close.
function Letter({ ch, i, mx, my, ready }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const near = useTransform(() => {
    const el = ref.current;
    if (!el || reduce) return 0;
    const r = el.getBoundingClientRect();
    const d = Math.hypot(mx.get() - (r.left + r.width / 2), my.get() - (r.top + r.height / 2));
    return Math.max(0, 1 - d / 380);
  });
  const t = useSpring(near, { stiffness: 170, damping: 20 });
  const fontVariationSettings = useTransform(t, v => `"wght" ${Math.round(800 - v * 600)}, "wdth" ${75 + v * 25}, "opsz" 96`);

  return (
    <span className="ltr-mask">
      <motion.span
        ref={ref}
        className="ltr"
        style={{ fontVariationSettings }}
        initial={{ y: "115%", rotate: 10 }}
        animate={ready ? { y: "0%", rotate: 0 } : undefined}
        transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.1 + i * 0.055 }}
      >
        {ch}
      </motion.span>
    </span>
  );
}

function Line({ text, offset, ...rest }) {
  return (
    <span className="wordmark-line">
      {[...text].map((ch, i) => <Letter key={i} ch={ch} i={i + offset} {...rest} />)}
    </span>
  );
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 24 },
  transition: { delay, type: "spring", stiffness: 90, damping: 18 },
});

export default function Hero({ ready }) {
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const recordY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const spot = useMotionTemplate`radial-gradient(520px circle at ${mx}px ${my}px, rgba(255,255,255,.16), transparent 65%)`;

  const onMove = e => {
    mx.set(e.clientX);
    my.set(e.clientY);
  };

  return (
    <header className="hero" id="top" ref={ref} onPointerMove={onMove} onPointerLeave={() => { mx.set(-9999); my.set(-9999); }}>
      <motion.div className="hero-spot" style={{ background: spot }} aria-hidden="true" />

      <motion.div className="hero-copy" style={{ y: textY }}>
        <motion.p className="hero-kicker" {...fadeUp(0.55)} animate={ready ? { opacity: 1, y: 0 } : undefined}>
          UK festival applications for an indie/alt rock band
        </motion.p>

        <h1 className="wordmark" aria-label="Summer '27: apply to play">
          <Line text="SUMMER" offset={0} mx={mx} my={my} ready={ready} />
          <Line text="'27" offset={6} mx={mx} my={my} ready={ready} />
        </h1>

        <motion.div className="hero-foot" {...fadeUp(0.9)} animate={ready ? { opacity: 1, y: 0 } : undefined}>
          <p className="hero-lede">
            Every open festival application we could find, sorted by how likely a band with two releases is to get booked. Each one shows what they ask for, what they pay and how big it is.
          </p>
          <ul className="hero-stats" aria-label="Where the band is now">
            <li><b>2</b> songs out</li>
            <li><b>218</b> followers</li>
            <li>A few <b>hundred</b> monthly listeners</li>
          </ul>
          <p className="hero-date">Researched 7 October 2026. Check each festival's own page before applying.</p>
        </motion.div>
      </motion.div>

      <motion.div
        className="hero-record"
        style={{ y: recordY }}
        initial={{ x: "60%", rotate: -40, opacity: 0 }}
        animate={ready ? { x: "0%", rotate: 0, opacity: 1 } : undefined}
        transition={{ delay: 0.35, type: "spring", stiffness: 50, damping: 14 }}
      >
        <Record label="Apply to play" />
      </motion.div>

      <motion.a
        href="#expect"
        className="hero-cue"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 1.4 }}
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          aria-hidden="true"
          className="hero-cue-dot"
        />
        Scroll for the shortlist
      </motion.a>
    </header>
  );
}
