// Generates src/ukmap.json: UK + Ireland outline paths and the projection used to place festivals.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { feature } from "topojson-client";
import { geoMercator, geoPath } from "d3-geo";

const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve("world-atlas/countries-50m.json"), "utf8"));
const countries = feature(topo, topo.objects.countries).features;
const uk = countries.find(f => f.id === "826");
const ie = countries.find(f => f.id === "372");

const W = 500, H = 640;
// Frame England, Wales and southern Scotland, where every pinned festival is. The rest is clipped.
const frame = { type: "MultiPoint", coordinates: [[-5.9, 49.85], [1.85, 55.75]] };
const projection = geoMercator().fitExtent([[16, 16], [W - 16, H - 16]], frame);
const path = geoPath(projection);
const round = d => d.replace(/(\d+\.\d{1})\d+/g, "$1");

writeFileSync("src/ukmap.json", JSON.stringify({
  width: W, height: H,
  scale: projection.scale(), translate: projection.translate(),
  uk: round(path(uk)), ie: round(path(ie)),
}));
console.log("ok", Math.round(projection.scale()));
