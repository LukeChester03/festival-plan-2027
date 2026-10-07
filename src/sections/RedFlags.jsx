import { useState } from "react";
import { motion } from "motion/react";
import { SplitHeading } from "./shared.jsx";

// Scam checks from Crock Pot Cartel's festival guide
const flags = [
  { flag: "They ask for payment after you're picked", fix: "That's a scam every time. Real invites come from the festival's official address and never ask you to pay to keep the slot." },
  { flag: "\"Sell 40 tickets to keep your slot\"", fix: "They're making you their marketing department. Decline." },
  { flag: "A big fee and no date for a decision", fix: "Real festivals commit to a date they'll tell you yes or no." },
  { flag: "\"Industry execs will be there\", with no names", fix: "Real industry showcases publish who's attending. That list is the whole product." },
  { flag: "You can't find the event anywhere else", fix: "If the website looks dead and nobody else mentions it, don't send money or your details." },
];

function FlipCard({ f, i }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <motion.li
      className="flag"
      initial={{ opacity: 0, y: 60, rotate: i % 2 ? 4 : -4 }}
      whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1.5 : -1.5 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ type: "spring", stiffness: 110, damping: 14, delay: i * 0.08 }}
    >
      <button className="flag-btn" aria-pressed={flipped} onClick={() => setFlipped(v => !v)}>
        <motion.span
          className="flag-inner"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 160, damping: 18 }}
        >
          <span className="flag-face flag-front">
            <svg className="flag-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 22V3h11l-1.6 3.5L16 10H7v12z" /></svg>
            <span className="flag-text">{f.flag}</span>
            <span className="flag-hint">Tap for what to do</span>
          </span>
          <span className="flag-face flag-back">
            <span className="flag-text">{f.fix}</span>
          </span>
        </motion.span>
      </button>
    </motion.li>
  );
}

export default function RedFlags() {
  return (
    <section className="flags" id="red-flags" aria-labelledby="flags-h">
      <div className="wrap">
        <SplitHeading id="flags-h" className="display">Red flags before you pay anything</SplitHeading>
        <motion.p
          className="golden-rule"
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
        >
          Playing for free at a community festival is normal at your level. Paying to play isn't. A real festival pays you, splits the door or at least costs you nothing. If money flows away from you, through "buy your slot" or "sell 20 tickets or you're cut", it's a scam. Walk away.
        </motion.p>
        <ul className="flag-grid">
          {flags.map((f, i) => <FlipCard key={f.flag} f={f} i={i} />)}
        </ul>
      </div>
    </section>
  );
}
