import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "motion/react";

const panels = [
  {
    big: "£0–£150",
    title: "Pay",
    body: "Plan to play for free or close to it. Twyfest says outright it can't pay. Dart asks you to propose a fee. Research into unsigned stages puts the typical fee around £100, which rarely covers van hire and fuel. You pay your own travel and accommodation almost everywhere.",
  },
  {
    big: "20–40 min",
    title: "The slot",
    body: "Expect an early-afternoon slot on a small or second stage. FOCUS Wales showcase sets are 30 minutes. Two songs won't fill that, so you'll need a set of unreleased material that's ready to play live.",
  },
  {
    big: "Silence",
    title: "Replies",
    body: "The Great Escape, Sunshine Festival and Wokingham all say they can't reply to everyone. If you hear nothing, you weren't picked. The Great Escape says no reply by 31 March 2027 means no.",
  },
  {
    big: "Live video",
    title: "What helps most",
    body: "DonnyFest asks for one and Sunshine won't consider entries without performance links. One well-filmed live song does more for your chances than more followers would. A BBC Introducing upload helps too, because Camper Calling's Freshly Squeezed stage books BBC Introducing acts.",
  },
];

export default function Expect() {
  const section = useRef(null);
  const track = useRef(null);
  const distance = useMotionValue(0);
  const { scrollYProgress, scrollY } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * distance.get());

  // Big stats lean into the direction of travel
  const velocity = useSpring(useVelocity(scrollY), { stiffness: 300, damping: 50 });
  const skewX = useTransform(velocity, [-2000, 2000], [14, -14], { clamp: true });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useLayoutEffect(() => {
    const measure = () => {
      const d = track.current.scrollWidth - window.innerWidth;
      distance.set(Math.max(0, d));
      section.current.style.height = `${window.innerHeight + Math.max(0, d)}px`;
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [distance]);

  return (
    <section className="expect" id="expect" ref={section} aria-labelledby="expect-h">
      <div className="expect-sticky">
        <motion.div className="expect-track" ref={track} style={{ x }}>
          <div className="expect-panel expect-intro">
            <h2 id="expect-h" className="display">What to expect at your size</h2>
            <p>With two songs and a few hundred listeners, your best odds are community festivals, multi-venue town festivals and smaller rock festivals. The big festivals mostly book through agents and labels.</p>
            <p className="expect-hint" aria-hidden="true">Keep scrolling</p>
          </div>
          {panels.map(p => (
            <article className="expect-panel" key={p.title}>
              <motion.p className="expect-big" style={{ skewX }}>{p.big}</motion.p>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </motion.div>
        <div className="expect-bar" aria-hidden="true"><motion.span style={{ scaleX: barScale }} /></div>
      </div>
    </section>
  );
}
