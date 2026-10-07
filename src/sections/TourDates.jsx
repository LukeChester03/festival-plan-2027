import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useSpring } from "motion/react";
import { fests, tiers } from "../data.js";
import { SplitHeading } from "./shared.jsx";

const filters = [
  ["all", "All"],
  ["good", "Good shot"],
  ["worth", "Worth a shot"],
  ["long", "Long shot"],
  ["closed", "Closed"],
];
const tierTag = { good: "Good odds", worth: "Worth a shot", long: "Long shot", closed: "Closed" };
const spring = { type: "spring", stiffness: 260, damping: 30 };

function Row({ f, open, onToggle, onHover }) {
  const id = `fest-${f.n.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <motion.li
      layout
      className={`gig gig-${f.t}${open ? " is-open" : ""}`}
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60, transition: { duration: 0.2 } }}
      transition={spring}
      onPointerEnter={() => onHover(f.t)}
      onPointerLeave={() => onHover(null)}
    >
      <button className="gig-head" aria-expanded={open} aria-controls={id} onClick={onToggle}>
        <span className="gig-when">{f.when}</span>
        <span className="gig-name">
          <motion.span className="gig-title" whileHover={{ x: 10 }} transition={spring}>{f.n}</motion.span>
          <span className="gig-where">{f.where}</span>
        </span>
        <span className="gig-dl">{f.dl}</span>
        <span className="gig-tag">{tierTag[f.t]}</span>
        <motion.span className="gig-plus" animate={{ rotate: open ? 45 : 0 }} transition={spring} aria-hidden="true">+</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            className="gig-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="gig-body-inner">
              <p className="gig-read">{f.read}</p>
              <dl className="gig-facts">
                <div><dt>Size</dt><dd>{f.size}</dd></div>
                <div><dt>Pay</dt><dd>{f.pay}</dd></div>
                <div><dt>What they ask for</dt><dd>{f.asks}</dd></div>
              </dl>
              <motion.a className="gig-apply" href={f.url} target="_blank" rel="noopener" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                Open {f.n}'s page
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default function TourDates() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const [hoverTier, setHoverTier] = useState(null);

  // Sticker that trails the cursor over the list
  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const sx = useSpring(cx, { stiffness: 300, damping: 28 });
  const sy = useSpring(cy, { stiffness: 300, damping: 28 });

  const items = [];
  for (const t of Object.keys(tiers)) {
    if (filter !== "all" && filter !== t) continue;
    const rows = fests.filter(f => f.t === t);
    items.push({ kind: "head", key: `h-${t}`, t });
    rows.forEach(f => items.push({ kind: "row", key: f.n, f }));
  }

  return (
    <section
      className="tour"
      id="festivals"
      aria-labelledby="festivals-h"
      onPointerMove={e => { cx.set(e.clientX); cy.set(e.clientY); }}
    >
      <div className="wrap">
        <SplitHeading id="festivals-h" className="display">Every festival, sorted by your odds</SplitHeading>
        <p className="section-lede">Laid out like tour dates. Odds are our judgement from each festival's size, how it books and what it asks for. Sizes are approximate. Open a festival for the details.</p>

        <LayoutGroup>
          <div className="tabs" role="group" aria-label="Filter by odds">
            {filters.map(([key, label]) => {
              const count = key === "all" ? fests.length : fests.filter(f => f.t === key).length;
              const active = filter === key;
              return (
                <motion.button
                  key={key}
                  className={`tab tab-${key}`}
                  aria-pressed={active}
                  onClick={() => { setFilter(key); setOpen(null); }}
                  whileTap={{ scale: 0.92 }}
                >
                  {active && <motion.span layoutId="tab-pill" className="tab-pill" transition={spring} />}
                  <span className="tab-text">{label} <span className="tab-count">{count}</span></span>
                </motion.button>
              );
            })}
          </div>

          <motion.ul className="gigs" layout>
            <AnimatePresence mode="popLayout" initial={false}>
              {items.map(item =>
                item.kind === "head" ? (
                  <motion.li
                    layout
                    key={item.key}
                    className={`gig-group gig-group-${item.t}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={spring}
                  >
                    <h3>{tiers[item.t].title}</h3>
                    <p>{tiers[item.t].note}</p>
                  </motion.li>
                ) : (
                  <Row
                    key={item.key}
                    f={item.f}
                    open={open === item.f.n}
                    onToggle={() => setOpen(open === item.f.n ? null : item.f.n)}
                    onHover={setHoverTier}
                  />
                )
              )}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>

        <p className="skipped">Left off because the genre doesn't fit: Gate to Southwell, Priddy, Folk in a Field, Shrewsbury and Moseley folk festivals; Mostly Jazz, Manchester Jazz and Love Supreme; British Country Music Festival; Africa Oye; Bloodstock (metal).</p>
      </div>

      <motion.div
        className={`cursor-sticker cursor-${hoverTier || "none"}`}
        style={{ x: sx, y: sy }}
        animate={{ scale: hoverTier ? 1 : 0, rotate: hoverTier ? -4 : -20 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        aria-hidden="true"
      >
        {hoverTier ? tierTag[hoverTier] : ""}
      </motion.div>
    </section>
  );
}
