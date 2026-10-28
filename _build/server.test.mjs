import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { mapPlaceResponse } from "./server.mjs";

test("place deep links serve their city map without redirecting; unknown places remain 404s", () => {
  const outputDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "map-routing-"),
  );
  try {
    fs.mkdirSync(path.join(outputDirectory, "maps"));
    const html = '<html><body><div id="map">Barcelona</div></body></html>';
    fs.writeFileSync(path.join(outputDirectory, "maps/barcelona.html"), html);
    const context = {
      outputDirectory,
      documents: [
        {
          file: "content/_maps/barcelona.md",
          location: "barcelona",
          output: "/maps/barcelona.html",
        },
      ],
      locations: {
        barcelona: [{ pid: "finestres" }],
        unknown: [{ pid: "somewhere" }],
      },
    };
    const response = mapPlaceResponse(
      { city: "barcelona", pid: "finestres" },
      context,
    );
    assert.equal(response.status, 200);
    assert.equal(response.body, html);
    assert.equal(response.headers["Content-Type"], "text/html; charset=utf-8");
    assert.equal(response.headers.Location, undefined);
    assert.equal(
      mapPlaceResponse({ city: "barcelona", pid: "missing" }, context),
      undefined,
    );
    assert.equal(
      mapPlaceResponse({ city: "unknown", pid: "somewhere" }, context),
      undefined,
    );
  } finally {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
});
