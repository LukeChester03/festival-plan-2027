import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const sources = [
  ["https://crockpotcartel.notion.site/Music-Festivals-3e271f9659ed8074ba36d0aaedeeaf8f", "Crock Pot Cartel: Festivals that actually book independent artists"],
  ["https://www.icmp.ac.uk/blog/apply-play-a-music-festival", "ICMP: Apply to play a music festival in 2027"],
  ["https://theplayground.co.uk/10-festivals-accepting-artist-submissions-for-2027/", "The Playground: 10 festivals accepting submissions for 2027"],
  ["https://routenote.com/radar/music-festivals-accepting-artist-applications-for-2027/", "RouteNote: Festivals accepting applications for 2027"],
  ["https://neonmusic.co.uk/open-calls", "Neon Music: Open calls"],
  ["https://donnyfest.co.uk/apply-to-play/", "DonnyFest: Apply to play"],
  ["https://homefarmfest.co.uk/get-involved", "Home Farm Festival: Get involved"],
  ["https://teddyrocks.co.uk/play", "Teddy Rocks: Play"],
  ["https://neonmusic.co.uk/loopfest-2027-artist-applications", "Neon Music: Loopfest 2027"],
  ["https://neonmusic.co.uk/dart-music-festival-2027-artist-applications", "Neon Music: Dart Music Festival 2027"],
  ["https://twyfest.uk/", "Twyfest"],
  ["https://www.wokinghamfestival.co.uk/artist-enquiry", "Wokingham Festival: Artist enquiry"],
  ["https://www.uptonfestival.co.uk/artist-act-submission/", "Sunshine Festival: Artist submission"],
  ["https://greatescapefestival.com/apply-to-play/", "The Great Escape: Apply to play"],
  ["https://focuswales.com/music/", "FOCUS Wales: Music"],
  ["https://tewkesburylive.co.uk/", "Tewkesbury Live"],
  ["https://ynotfestival.com/contact/", "Y Not? Festival: Contact"],
  ["https://routenote.com/blog/glastonbury-2027-tickets-price-sale-dates-and-what-artists-need-to-know/", "RouteNote: Glastonbury 2027 for artists"],
  ["https://livemusicexchange.org/blog/hidden-revenues-in-playing-unsigned-stages-on-the-festival-circuit-repost-matt-brennan/", "Live Music Exchange: Unsigned stages on the festival circuit"],
];

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-30%", "0%"]);
  const backgroundSize = useTransform(scrollYProgress, [0.3, 1], ["0% 100%", "100% 100%"]);

  return (
    <footer className="footer" ref={ref}>
      <div className="wrap">
        <h2>Sources</h2>
        <ul className="sources">
          {sources.map(([href, label]) => <li key={href}><a href={href} target="_blank" rel="noopener">{label}</a></li>)}
        </ul>
      </div>
      <div className="footer-mark" aria-hidden="true">
        <motion.span style={{ x, backgroundSize }}>Summer '27 Summer '27</motion.span>
      </div>
    </footer>
  );
}
