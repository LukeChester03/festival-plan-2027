import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { geoMercator } from "d3-geo";
import { fests } from "../data.js";
import map from "../ukmap.json";
import { SplitHeading } from "./shared.jsx";

const projection = geoMercator().scale(map.scale).translate(map.translate);
const tierTag = { good: "Good odds", worth: "Worth a shot" };
const spring = { type: "spring", stiffness: 260, damping: 26 };
const views = [["both", "Both"], ["good", "Good shot"], ["worth", "Worth a shot"]];

export default function FestivalMap() {
  const [view, setView] = useState("both");
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  // One dot per location, ordered south to north so they pop in up the country
  const dots = useMemo(() => {
    const out = [];
    fests.filter(f => f.at && (f.t === "good" || f.t === "worth")).forEach(f => {
      f.at.forEach(([lat, lon], k) => {
        const [x, y] = projection([lon, lat]);
        out.push({ key: `${f.n}-${k}`, f, x, y });
      });
    });
    return out.sort((a, b) => b.y - a.y);
  }, []);

  const visible = dots.filter(d => view === "both" || d.f.t === view);
  const active = selected && visible.some(d => d.f.n === selected.n) ? selected : null;
  const label = hovered && visible.find(d => d.key === hovered);

  const choose = f => setSelected(s => (s && s.n === f.n ? null : f));

  return (
    <section className="mapsec" id="map" aria-labelledby="map-h">
      <div className="wrap">
        <SplitHeading id="map-h" className="display">Where they are</SplitHeading>
        <p className="section-lede">Every good-odds and worth-a-shot festival on one map. Pins are approximate. Some schemes only take local acts, so read the notes before you plan a trip.</p>

        <div className="map-layout">
          <div className="map-frame">
            <svg viewBox={`0 0 ${map.width} ${map.height}`} className="map-svg" role="group" aria-label="Map of festival locations in the UK">
              <motion.path
                d={map.ie}
                className="map-ie"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              />
              <motion.path
                d={map.uk}
                className="map-uk"
                initial={{ pathLength: 0, fillOpacity: 0 }}
                whileInView={{ pathLength: 1, fillOpacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -20% 0px" }}
                transition={{ pathLength: { duration: 1.8, ease: "easeInOut" }, fillOpacity: { delay: 1.1, duration: 0.6 } }}
              />

              <AnimatePresence>
                {visible.map((d, i) => {
                  const isActive = active && active.n === d.f.n;
                  return (
                    <motion.g
                      key={d.key}
                      className={`pin pin-${d.f.t}${isActive ? " is-active" : ""}`}
                      transform={`translate(${d.x} ${d.y})`}
                      role="button"
                      tabIndex={0}
                      aria-label={`${d.f.n}, ${d.f.where}, ${tierTag[d.f.t]}`}
                      aria-pressed={!!isActive}
                      onClick={() => choose(d.f)}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); choose(d.f); } }}
                      onPointerEnter={() => setHovered(d.key)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setHovered(d.key)}
                      onBlur={() => setHovered(null)}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      <motion.g
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 380, damping: 14, delay: 1.2 + i * 0.05 }}
                        whileHover={{ scale: 1.45 }}
                      >
                        {d.f.t === "good" && (
                          <motion.circle
                            r="8"
                            className="pin-pulse"
                            animate={{ r: [8, 22], opacity: [0.7, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut", delay: (i % 5) * 0.35 }}
                          />
                        )}
                        {isActive && (
                          <motion.circle initial={{ r: 8, opacity: 0 }} animate={{ r: 17, opacity: 1 }} className="pin-ring" transition={spring} />
                        )}
                        <circle r="8" className="pin-dot" />
                      </motion.g>
                    </motion.g>
                  );
                })}
              </AnimatePresence>

              <AnimatePresence>
                {label && (
                  <motion.g
                    key={label.key}
                    className="pin-label"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    style={{ pointerEvents: "none" }}
                  >
                    <text x={label.x + (label.x > 330 ? -16 : 16)} y={label.y + 5} textAnchor={label.x > 330 ? "end" : "start"}>
                      {label.f.n}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </svg>
          </div>

          <div className="map-side">
            <LayoutGroup id="mapviews">
              <div className="map-views" role="group" aria-label="Show on map">
                {views.map(([k, l]) => (
                  <motion.button key={k} className="map-view" aria-pressed={view === k} onClick={() => setView(k)} whileTap={{ scale: 0.92 }}>
                    {view === k && <motion.span layoutId="map-pill" className="map-pill" transition={spring} />}
                    <span className="map-view-text">{l}</span>
                  </motion.button>
                ))}
              </div>
            </LayoutGroup>

            <ul className="map-key" aria-label="Key">
              <li><span className="key-dot key-good" /> Good odds</li>
              <li><span className="key-dot key-worth" /> Worth a shot</li>
            </ul>

            <AnimatePresence mode="wait">
              {active ? (
                <motion.article
                  key={active.n}
                  className={`map-card map-card-${active.t}`}
                  initial={{ opacity: 0, y: 30, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={spring}
                >
                  <span className="map-card-tag">{tierTag[active.t]}</span>
                  <h3>{active.n}</h3>
                  <p className="map-card-where">{active.where}, {active.when}</p>
                  <p className="map-card-dl"><b>Deadline:</b> {active.dl}</p>
                  <p className="map-card-read">{active.read}</p>
                  <div className="map-card-actions">
                    <a href={active.url} target="_blank" rel="noopener" className="map-card-go">Open {active.n}'s page</a>
                    <button className="map-card-close" onClick={() => setSelected(null)}>Close</button>
                  </div>
                </motion.article>
              ) : (
                <motion.div
                  key="empty"
                  className="map-empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="map-empty-num">{new Set(visible.map(d => d.f.n)).size}</p>
                  <p>festivals on the map. Tap a pin to see the details and the link to apply.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
