import fs from "node:fs";
import path from "node:path";

// Place URLs share the city map's HTML. Keep the requested URL so map.js can
// select the marker, matching the production server's map routing.
export function mapPlaceResponse(
  { city, pid },
  { documents, locations, outputDirectory },
) {
  const map = documents.find(
    (document) =>
      document.file.startsWith("content/_maps/") && document.location === city,
  );
  if (!map || !locations[city]?.some((place) => place.pid === pid)) return;

  return {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
    body: fs.readFileSync(path.join(outputDirectory, map.output), "utf8"),
  };
}
