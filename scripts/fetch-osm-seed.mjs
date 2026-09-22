#!/usr/bin/env node
/**
 * Fetch OpenStreetMap places tagged kosher / jewish via Overpass.
 * Writes scripts/osm-seed.json for review before merging into seed data.
 *
 * Usage: node scripts/fetch-osm-seed.mjs
 */
const OVERPASS = "https://overpass-api.de/api/interpreter";

const query = `
[out:json][timeout:90];
(
  node["diet:kosher"];
  node["kosher"];
  node["amenity"="place_of_worship"]["religion"="jewish"];
  way["diet:kosher"];
  way["amenity"="place_of_worship"]["religion"="jewish"];
);
out center 80;
`;

async function main() {
  const res = await fetch(OVERPASS, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) {
    console.error("Overpass error", res.status, await res.text());
    process.exit(1);
  }
  const data = await res.json();
  const places = (data.elements || [])
    .map((el) => {
      const lat = el.lat ?? el.center?.lat;
      const lng = el.lon ?? el.center?.lon;
      if (lat == null || lng == null) return null;
      const tags = el.tags || {};
      const isSynagogue =
        tags.amenity === "place_of_worship" && tags.religion === "jewish";
      return {
        id: `osm-${el.type}-${el.id}`,
        name: tags.name || tags["name:en"] || "Unnamed",
        nameLocal: tags["name:he"] || tags["name:yi"] || undefined,
        type: isSynagogue
          ? "synagogue"
          : tags.shop === "butcher"
            ? "butcher"
            : tags.shop === "bakery"
              ? "bakery"
              : tags.amenity === "restaurant" || tags.amenity === "cafe"
                ? "restaurant"
                : "community",
        lat,
        lng,
        address: [tags["addr:street"], tags["addr:housenumber"]]
          .filter(Boolean)
          .join(" "),
        city: tags["addr:city"] || "",
        country: tags["addr:country"] || "",
        countryCode: (tags["addr:country"] || "XX").slice(0, 2).toUpperCase(),
        kashrutStatus: tags["diet:kosher"] || tags.kosher ? "community_report" : "unknown",
        source: "osm",
        notes: "Imported from OpenStreetMap — verify before treating as certified.",
      };
    })
    .filter(Boolean);

  const fs = await import("node:fs");
  fs.writeFileSync(
    new URL("./osm-seed.json", import.meta.url),
    JSON.stringify(places, null, 2),
  );
  console.log(`Wrote ${places.length} OSM places to scripts/osm-seed.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
