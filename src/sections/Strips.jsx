import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";

const lineA = ["DonnyFest closes 31 Oct", "Home Farm opens 9 Oct, 4pm", "FOCUS Wales closes 1 Nov", "Home Farm closes 6 Nov", "Great Escape closes 15 Feb"];
const lineB = ["Best odds", "DonnyFest", "Home Farm", "Teddy Rocks", "Loopfest", "Dart Music", "Twyfest", "Wokingham"];

// A strip that drifts on its own and races (or reverses) with scroll speed
function Strip({ items, baseVelocity, className }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const x = useTransform(baseX, v => `${wrap(-25, 0, v)}%`);
  const direction = useRef(1);
  const reduce = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    if (factor.get() < 0) direction.current = -1;
    else if (factor.get() > 0) direction.current = 1;
    moveBy += direction.current * moveBy * factor.get();
    baseX.set(baseX.get() + moveBy);
  });

  const group = (
    <span className="strip-group">
      {items.map((t, i) => (
        <span key={i} className="strip-item">
          {t}
          <svg className="strip-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
        </span>
      ))}
    </span>
  );

  return (
    <div className={`strip ${className}`}>
      <motion.div className="strip-track" style={{ x }} aria-hidden="true">
        {group}{group}{group}{group}
      </motion.div>
    </div>
  );
}

export default function Strips() {
  return (
    <section className="strips" aria-label="Key deadlines">
      <p className="sr-only">{lineA.join(". ")}.</p>
      <Strip items={lineA} baseVelocity={-2.2} className="strip-volt" />
      <Strip items={lineB} baseVelocity={1.6} className="strip-black" />
    </section>
  );
}
