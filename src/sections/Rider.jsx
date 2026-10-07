import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SplitHeading } from "./shared.jsx";

const items = [
  { id: "video", b: "One live video.", t: "A single song, filmed well, with clear audio. DonnyFest and Sunshine both ask for one." },
  { id: "spotify", b: "Spotify for Artists claimed,", t: "with a photo and a bio. This is the first thing bookers click." },
  { id: "pitch", b: "A 280-character pitch.", t: "Teddy Rocks caps it there. Say where you're from, who you sound like and one fact that sets you apart." },
  { id: "bbc", b: "A BBC Introducing upload.", t: "It's free, gets you local radio plays and puts you in the running for Camper Calling's Freshly Squeezed stage." },
  { id: "pli", b: "Public liability insurance and PRS membership.", t: "Dart asks for both. Musicians' Union membership includes insurance." },
  { id: "dates", b: "A shared calendar of dates you can play.", t: "Several forms ask you to confirm you're free on every day of the festival." },
  { id: "third", b: "A third release before February,", t: "if you can. It shows momentum to the showcase festivals that close later." },
  { id: "local", b: "A note of where you live.", t: "DonnyFest, Twyfest, Wokingham and In It Together all favour local acts, so lead with it where it fits." },
];

const KEY = "summer27-rider";

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export default function Rider() {
  const [done, setDone] = useState(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(done)); } catch { /* storage unavailable */ }
  }, [done]);

  const toggle = id => setDone(d => (d.includes(id) ? d.filter(x => x !== id) : [...d, id]));
  const ratio = done.length / items.length;

  return (
    <section className="rider" id="checklist" aria-labelledby="checklist-h">
      <div className="wrap">
        <SplitHeading id="checklist-h" className="display">Have these ready before you apply</SplitHeading>
        <p className="section-lede">Most forms ask for the same things. Get them sorted once and each application takes about ten minutes. Tick them off as you go; this page remembers.</p>

        <div className="rider-meter" aria-live="polite">
          <span className="rider-count">{done.length} of {items.length} ready</span>
          <div className="rider-track"><motion.span animate={{ scaleX: ratio }} transition={{ type: "spring", stiffness: 120, damping: 18 }} /></div>
        </div>

        <ul className="rider-list">
          {items.map((it, i) => {
            const on = done.includes(it.id);
            return (
              <motion.li
                key={it.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.08, type: "spring", stiffness: 120, damping: 18 }}
              >
                <motion.button
                  className={`rider-item${on ? " is-on" : ""}`}
                  aria-pressed={on}
                  onClick={() => toggle(it.id)}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="rider-box" viewBox="0 0 32 32" aria-hidden="true">
                    <rect x="2" y="2" width="28" height="28" rx="3" />
                    <motion.path
                      d="M8 17l6 6 11-14"
                      initial={false}
                      animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 22 }}
                    />
                  </svg>
                  <span><b>{it.b}</b> {it.t}</span>
                </motion.button>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
