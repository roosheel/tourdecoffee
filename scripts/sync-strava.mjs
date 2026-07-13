#!/usr/bin/env node

/**
 * Strava → Tour de Coffee sync script
 *
 * Fetches Strava run activities titled "Tour de Coffee …", decodes their route
 * polylines, and rewrites src/data.js so the map stays up to date.
 *
 * src/data.js is regenerated from scratch on every run — Strava is the source
 * of truth for the run list. Shop details you write by hand live in
 * src/annotations.json (keyed by Strava activity id) and are merged back in.
 *
 * Usage:
 *   npm run sync              # uses summary polylines (fast, one API call)
 *   npm run sync -- --detailed # fetches full polylines per activity (slower, prettier routes)
 *
 * Credentials come from a .env file at the project root. The refresh token must
 * carry the `activity:read_all` scope — plain `read` cannot list activities.
 * Coffee-shop metadata (name, hood, stars, note) lives in src/annotations.json
 * and is merged in automatically — edit that file, not data.js.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_PATH = join(ROOT, "src", "data.js");
const ANNOTATIONS_PATH = join(ROOT, "src", "annotations.json");
const ENV_PATH = join(ROOT, ".env");

const DETAILED = process.argv.includes("--detailed");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Tiny .env loader — no dependencies needed. */
function loadEnv() {
  if (!existsSync(ENV_PATH)) {
    console.error(
      "Missing .env file. Copy .env.example and fill in your Strava credentials:\n" +
        "  cp .env.example .env"
    );
    process.exit(1);
  }
  for (const line of readFileSync(ENV_PATH, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] = val;
  }
}

/** Decode a Google-encoded polyline string into [[lat, lng], …]. */
function decodePolyline(encoded) {
  const coords = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    let b;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coords.push([
      Math.round((lat / 1e5) * 1e6) / 1e6,
      Math.round((lng / 1e5) * 1e6) / 1e6,
    ]);
  }
  return coords;
}

/** Format an ISO date string like "Feb 14, 2026". */
function formatDate(iso) {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Short date without year, e.g. "Feb 14". */
function shortDate(iso) {
  const d = new Date(iso);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

// ---------------------------------------------------------------------------
// Strava API (uses curl for environments where Node fetch is restricted)
// ---------------------------------------------------------------------------

function curlJson(url, { method = "GET", headers = {}, body } = {}) {
  const args = ["curl", "-s", "-X", method];
  for (const [k, v] of Object.entries(headers)) {
    args.push("-H", `${k}: ${v}`);
  }
  if (body) {
    args.push("-H", "Content-Type: application/json", "-d", JSON.stringify(body));
  }
  args.push(url);
  const out = execSync(args.map((a) => `'${a.replace(/'/g, "'\\''")}'`).join(" "), {
    encoding: "utf-8",
    maxBuffer: 50 * 1024 * 1024,
  });
  return JSON.parse(out);
}

async function refreshAccessToken() {
  const { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN } =
    process.env;
  if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
    console.error(
      "Missing one or more env vars: STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN"
    );
    process.exit(1);
  }

  const data = curlJson("https://www.strava.com/oauth/token", {
    method: "POST",
    body: {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      refresh_token: STRAVA_REFRESH_TOKEN,
      grant_type: "refresh_token",
    },
  });

  if (data.errors) {
    throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  }

  // Strava may rotate the refresh token — persist it back to .env
  if (data.refresh_token && data.refresh_token !== STRAVA_REFRESH_TOKEN) {
    const envContent = readFileSync(ENV_PATH, "utf-8").replace(
      /STRAVA_REFRESH_TOKEN=.*/,
      `STRAVA_REFRESH_TOKEN=${data.refresh_token}`
    );
    writeFileSync(ENV_PATH, envContent);
    console.log("  ↳ Strava rotated your refresh token — .env updated.");
  }

  return data.access_token;
}

/** Fetch the activities list (runs with polylines). */
function fetchActivities(token, page = 1, perPage = 50) {
  const url = `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`;
  return curlJson(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Fetch a single activity's detailed polyline. */
function fetchDetailedPolyline(token, activityId) {
  try {
    const data = curlJson(
      `https://www.strava.com/api/v3/activities/${activityId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data.map?.polyline || null;
  } catch {
    return null; // fall back to summary
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  loadEnv();

  // 1. Auth
  console.log("Refreshing Strava access token…");
  const token = await refreshAccessToken();

  // 2. Fetch activities (paginate to get all)
  console.log("Fetching activities…");
  let allActivities = [];
  let page = 1;
  while (true) {
    const batch = await fetchActivities(token, page, 100);
    if (!Array.isArray(batch)) {
      // Strava answers with an object, not a list, when the token lacks scope.
      const missingScope = JSON.stringify(batch).includes("activity:read_permission");
      throw new Error(
        missingScope
          ? "Strava rejected the activity list: the refresh token only has `read` scope.\n" +
            "  Re-authorize with `activity:read_all` and swap the new refresh token into .env:\n" +
            "  https://www.strava.com/oauth/authorize?client_id=" +
            process.env.STRAVA_CLIENT_ID +
            "&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=activity:read_all"
          : `Unexpected response from Strava: ${JSON.stringify(batch)}`
      );
    }
    if (batch.length === 0) break;
    allActivities = allActivities.concat(batch);
    if (batch.length < 100) break;
    page++;
  }

  // Only runs explicitly titled "Tour de Coffee …" — a looser keyword match
  // pulls in unrelated activities that merely mention coffee or a tour.
  const TDC_TITLE = /tour de coffee/i;
  const named = allActivities.filter((a) => TDC_TITLE.test(a.name));
  const runActivities = named.filter(
    (a) => a.type === "Run" && a.map?.summary_polyline
  );

  console.log(
    `Scanned ${allActivities.length} activities → ${named.length} titled "Tour de Coffee" → ` +
      `${runActivities.length} runs with route data`
  );
  const skipped = named.length - runActivities.length;
  if (skipped > 0) {
    console.log(`  ↳ skipped ${skipped} (not a Run, or no GPS route recorded)`);
  }

  if (runActivities.length === 0) {
    console.error(
      "No matching runs found — refusing to overwrite src/data.js with an empty set."
    );
    process.exit(1);
  }

  // 3. Optionally fetch detailed polylines
  if (DETAILED) {
    console.log("Fetching detailed polylines (this may take a moment)…");
    for (const activity of runActivities) {
      const detailed = await fetchDetailedPolyline(token, activity.id);
      if (detailed) {
        activity._detailedPolyline = detailed;
      }
    }
  }

  // 4. Load existing annotations
  let annotations = {};
  if (existsSync(ANNOTATIONS_PATH)) {
    annotations = JSON.parse(readFileSync(ANNOTATIONS_PATH, "utf-8"));
  }

  // 5. Build run objects (newest first)
  runActivities.sort(
    (a, b) => new Date(b.start_date_local) - new Date(a.start_date_local)
  );

  const runs = runActivities.map((activity, idx) => {
    const polyline = activity._detailedPolyline || activity.map.summary_polyline;
    const route = decodePolyline(polyline);
    const shopCoords = route[route.length - 1]; // end of route = the coffee shop
    const distanceMiles = +(activity.distance / 1609.344).toFixed(1);
    const ann = annotations[String(activity.id)] || {};

    return {
      id: idx + 1,
      stravaId: activity.id,
      date: formatDate(activity.start_date_local),
      name: ann.name || activity.name,
      hood: ann.hood || "",
      distance: distanceMiles,
      stars: ann.stars || 0,
      note: ann.note || "",
      shopCoords,
      route,
      photos: ann.photos || 0,
      ig: ann.ig || "",
      website: ann.website || "",
    };
  });

  // 6. Derive coffeeLog
  const coffeeLog = runs.map((r) => ({
    n: r.name,
    h: r.hood,
    d: r.distance,
    s: r.stars,
    t: r.note,
    dt: shortDate(
      runActivities.find((a) => a.id === r.stravaId).start_date_local
    ),
  }));

  // 7. Write src/data.js
  const dataJs = `// Auto-synced from Strava — last updated ${new Date().toISOString()}
// Manual annotations: edit src/annotations.json and re-run \`npm run sync\`

// Starting point: Apple Store, 5th Ave
export const START_COORDS = [40.7638, -73.9722];

// Run data synced from Strava
export const runs = ${JSON.stringify(runs, null, 2)};

// Coffee log (derived from runs)
export const coffeeLog = ${JSON.stringify(coffeeLog, null, 2)};

// Schedule data
export const schedule = [
  { day: "MON", full: "Monday", time: "6:30am", type: "regular" },
  { day: "WED", full: "Wednesday", time: "6:30am", type: "regular" },
  { day: "FRI", full: "Friday", time: "6:30am", type: "regular" },
  { day: "SUN", full: "Select Sundays", time: "varies", type: "theme" },
];

// About stats
export const stats = [
  { num: "3x", label: "per week" },
  { num: "50+", label: "shops hit" },
  { num: "5-20", label: "runners" },
  { num: "6:30", label: "am sharp" },
];

// Marquee text
export const MARQUEE_TOP = "RUN \\u00b7 COFFEE \\u00b7 REPEAT \\u00b7 NYC \\u00b7 5TH AVE \\u00b7 6:30AM \\u00b7 ALL PACES \\u00b7 ALL PEOPLE \\u00b7 ";
export const MARQUEE_BOTTOM = "COFFEE SHOPS OF NYC \\u00b7 EVERY RUN A NEW SPOT \\u00b7 LATTE LOVERS WELCOME \\u00b7 NO PACE TOO SLOW \\u00b7 SUNRISE MILES \\u00b7 CROISSANTS MANDATORY \\u00b7 ";

// Map circle radius
export const MAP_RADIUS = 50;
`;

  writeFileSync(DATA_PATH, dataJs);
  console.log(`Wrote ${runs.length} runs to src/data.js`);

  // 8. Scaffold annotations for new runs
  let newCount = 0;
  for (const r of runs) {
    const key = String(r.stravaId);
    if (!annotations[key]) {
      annotations[key] = {
        name: r.name,
        hood: "",
        stars: 0,
        note: "",
        photos: 0,
        ig: "",
        website: "",
      };
      newCount++;
    }
  }
  if (newCount > 0) {
    writeFileSync(ANNOTATIONS_PATH, JSON.stringify(annotations, null, 2) + "\n");
    console.log(
      `Added ${newCount} new entries to src/annotations.json — fill in shop details there.`
    );
  }

  console.log("\nDone! Run `npm run dev` to preview.");
}

main().catch((err) => {
  console.error("Sync failed:", err.message);
  process.exit(1);
});
