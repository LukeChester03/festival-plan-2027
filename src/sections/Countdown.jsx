import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { SplitHeading } from "./shared.jsx";

const deadlines = [
  { id: "hf-open", name: "Home Farm Festival", verb: "Opens", at: "2026-10-09T16:00:00+01:00", when: "Fri 9 Oct, 4pm", note: "The window is four weeks and may close early if they get a lot of applications. Apply on day one.", tier: "good" },
  { id: "donny", name: "DonnyFest", verb: "Closes", at: "2026-10-31T23:59:00+00:00", when: "31 Oct", note: "They ask for a Spotify profile and a live clip.", tier: "good" },
  { id: "focus", name: "FOCUS Wales", verb: "Closes", at: "2026-11-01T18:00:00+00:00", when: "1 Nov, 6pm", note: "Free to apply through Amplead. Showcase sets are 30 minutes.", tier: "worth" },
  { id: "hf-close", name: "Home Farm Festival", verb: "Closes", at: "2026-11-06T16:00:00+00:00", when: "6 Nov, 4pm", note: "Or sooner if they hit their limit.", tier: "good" },
  { id: "esk", name: "Eskfest", verb: "Closes", at: "2027-02-01T23:59:00+00:00", when: "1 Feb", note: "Email your application. Lake District, 8–10 July.", tier: "good" },
  { id: "tge", name: "The Great Escape", verb: "Closes", at: "2027-02-15T23:59:00+00:00", when: "15 Feb", note: "No reply by 31 March 2027 means you weren't picked.", tier: "long" },
];

const tierLabel = { good: "Good odds", worth: "Worth a shot", long: "Long shot" };

function useNow(ms = 30000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(t);
  }, [ms]);
  return now;
}

function CountUp({ value }) {
  const ref = useRef(null);
  const mv = useMotionValue(0);
  const shown = useTransform(mv, v => Math.round(v));
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(mv, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => c.stop();
  }, [inView, value, mv]);
  return <motion.span ref={ref}>{shown}</motion.span>;
}

function Pass({ d, i, now }) {
  const ms = new Date(d.at).getTime() - now;
  const passed = ms <= 0;
  const days = Math.max(0, Math.floor(ms / 86400000));
  const hours = Math.max(0, Math.floor((ms % 86400000) / 3600000));
  const tilt = [-4, 3, -2, 4, -3][i % 5];

  return (
    <motion.li
      className={`pass pass-${d.tier}${passed ? " pass-passed" : ""}`}
      style={{ originY: 0 }}
      initial={{ y: -260, rotate: tilt * 4, opacity: 0 }}
      whileInView={{ y: 0, rotate: tilt, opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{ type: "spring", stiffness: 90, damping: 9, delay: i * 0.12 }}
      whileHover={{ rotate: tilt * -1.5 }}
      drag
      dragSnapToOrigin
      dragElastic={0.5}
      whileDrag={{ scale: 1.05, rotate: tilt * 3, zIndex: 5, cursor: "grabbing" }}
    >
      <span className="pass-lanyard" aria-hidden="true" />
      <span className="pass-hole" aria-hidden="true" />
      <p className="pass-verb">{d.verb} {d.when}</p>
      <h3 className="pass-name">{d.name}</h3>
      {passed ? (
        <p className="pass-count"><span className="pass-num">{d.verb === "Opens" ? "Open now" : "Closed"}</span></p>
      ) : (
        <p className="pass-count" aria-label={`${days} days and ${hours} hours to go`}>
          <span className="pass-num"><CountUp value={days} /></span>
          <span className="pass-unit">{days === 1 ? "day" : "days"}<br />{hours} hrs</span>
        </p>
      )}
      <p className="pass-note">{d.note}</p>
      <span className="pass-tier">{tierLabel[d.tier]}</span>
    </motion.li>
  );
}

export default function Countdown() {
  const now = useNow();
  return (
    <section className="countdown" id="deadlines" aria-labelledby="deadlines-h">
      <div className="wrap">
        <SplitHeading id="deadlines-h" className="display">Deadlines, counting down</SplitHeading>
        <p className="section-lede">Two good-odds festivals close within a month, so start this week. Grab a pass and throw it around if you like.</p>
        <ol className="passes">
          {deadlines.map((d, i) => <Pass key={d.id} d={d} i={i} now={now} />)}
        </ol>
        <p className="rolling">
          <b>No published deadline:</b> Teddy Rocks, Loopfest, Dart, Twyfest, Wokingham, Music Barn, Exeter Respect, the Cornish festivals, Sunshine, Dot to Dot, Camper Calling and Together Again. Most summer festivals finish booking between January and March, so apply before Christmas. Still to open: Tramlines Apply to Play (last year's closed 28 January), Victorious Apply to Play (ran November to March), Wychwood, Truck's Band App, End of the Road, and Deer Shed (closed 2 April last year). Glastonbury's Emerging Talent Competition is expected in spring 2027, and Y Not? says its applications open nearer the festival.
        </p>
      </div>
    </section>
  );
}
