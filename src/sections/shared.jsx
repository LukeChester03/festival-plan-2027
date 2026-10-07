import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useVelocity } from "motion/react";

// A vinyl record that idles at a slow spin and speeds up while the page scrolls
export function Record({ className = "", label = "Summer '27" }) {
  const rotate = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const reduce = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const boost = Math.min(Math.abs(velocity.get()), 4000) / 500;
    rotate.set(rotate.get() + (delta / 1000) * 50 * (1 + boost));
  });

  return (
    <div className={`record ${className}`} aria-hidden="true">
      <motion.div className="record-disc" style={{ rotate }}>
        <div className="record-label">
          <span className="record-label-top">{label}</span>
          <span className="record-hole" />
          <span className="record-label-bottom">Side A</span>
        </div>
      </motion.div>
      <div className="record-sheen" />
    </div>
  );
}

// Section heading whose words rise out of a mask when it scrolls into view
export function SplitHeading({ as: Tag = "h2", children, className = "", id }) {
  const words = String(children).split(" ");
  return (
    <Tag className={`split ${className}`} id={id} aria-label={children}>
      {words.map((w, i) => (
        <span className="split-mask" key={i} aria-hidden="true">
          <motion.span
            className="split-word"
            initial={{ y: "105%", rotate: 6 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ type: "spring", stiffness: 110, damping: 16, delay: i * 0.06 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
