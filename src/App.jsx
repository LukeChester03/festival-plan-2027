import { useCallback, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import Loader from "./sections/Loader.jsx";
import Hero from "./sections/Hero.jsx";
import Strips from "./sections/Strips.jsx";
import Expect from "./sections/Expect.jsx";
import Countdown from "./sections/Countdown.jsx";
import TourDates from "./sections/TourDates.jsx";
import Rider from "./sections/Rider.jsx";
import Footer from "./sections/Footer.jsx";

function Nav() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });
  return (
    <>
      <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />
      <nav className="nav" aria-label="Sections">
        <a href="#top" className="nav-mark">Summer '27</a>
        <ul>
          <li><a href="#expect">Expect</a></li>
          <li><a href="#deadlines">Deadlines</a></li>
          <li><a href="#festivals">Festivals</a></li>
          <li><a href="#checklist">Checklist</a></li>
        </ul>
      </nav>
    </>
  );
}

export default function App() {
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(!reduce);
  const finishLoading = useCallback(() => setLoading(false), []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {loading && <Loader key="loader" onDone={finishLoading} />}
      </AnimatePresence>
      <Nav />
      <main>
        <Hero ready={!loading} />
        <Strips />
        <Expect />
        <Countdown />
        <TourDates />
        <Rider />
      </main>
      <Footer />
    </MotionConfig>
  );
}
