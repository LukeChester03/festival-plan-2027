import { useEffect } from "react";
import { motion } from "motion/react";

export default function Loader({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1600);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      className="loader"
      role="status"
      aria-label="Loading"
      exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="loader-deck">
        <motion.div
          className="loader-disc"
          initial={{ scale: 0.3, rotate: 0, opacity: 0 }}
          animate={{ scale: 1, rotate: 900, opacity: 1 }}
          transition={{ duration: 1.6, ease: [0.5, 0, 0.2, 1] }}
        >
          <span className="loader-label" />
        </motion.div>
        <motion.div
          className="loader-arm"
          initial={{ rotate: -38 }}
          animate={{ rotate: -6 }}
          transition={{ delay: 0.45, type: "spring", stiffness: 140, damping: 12 }}
        />
      </div>
      <motion.p
        className="loader-text"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Summer '27
      </motion.p>
    </motion.div>
  );
}
