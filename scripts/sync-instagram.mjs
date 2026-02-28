#!/usr/bin/env node

/**
 * Instagram → Tour de Coffee sync script
 *
 * Fetches recent posts from the Instagram Graph API, downloads images
 * to public/instagram/, and writes src/instagram-data.js so the feed
 * renders without any third-party widget.
 *
 * Usage:
 *   npm run sync:instagram
 *
 * Credentials come from a .env file at the project root.
 * Requires INSTAGRAM_ACCESS_TOKEN (a long-lived token).
 *
 * To get a token:
 *   1. Create a Meta app at https://developers.facebook.com
 *   2. Add "Instagram" product, connect your Instagram Business/Creator account
 *   3. Generate a long-lived token from the Graph API Explorer
 *   4. Paste it in .env as INSTAGRAM_ACCESS_TOKEN
 *
 * Tokens last 60 days — this script auto-refreshes and updates .env.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const ENV_PATH = join(ROOT, ".env");
const DATA_PATH = join(ROOT, "src", "instagram-data.js");
const IMG_DIR = join(ROOT, "public", "instagram");

const POST_COUNT = 9; // number of posts to display

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadEnv() {
  if (!existsSync(ENV_PATH)) {
    console.error(
      "Missing .env file. Copy .env.example and fill in your credentials:\n" +
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

function curlJson(url) {
  const out = execSync(`curl -s '${url}'`, {
    encoding: "utf-8",
    maxBuffer: 50 * 1024 * 1024,
  });
  return JSON.parse(out);
}

function curlBinary(url, outPath) {
  execSync(`curl -s -L -o '${outPath}' '${url}'`, {
    maxBuffer: 50 * 1024 * 1024,
  });
}

// ---------------------------------------------------------------------------
// Instagram API
// ---------------------------------------------------------------------------

function refreshToken(token) {
  const url =
    `https://graph.instagram.com/refresh_access_token` +
    `?grant_type=ig_refresh_token&access_token=${token}`;
  const data = curlJson(url);
  if (data.error) {
    throw new Error(`Token refresh failed: ${JSON.stringify(data.error)}`);
  }
  return data.access_token;
}

function fetchMedia(token) {
  const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
  const url =
    `https://graph.instagram.com/me/media` +
    `?fields=${fields}&limit=${POST_COUNT}&access_token=${token}`;
  return curlJson(url);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  loadEnv();

  let token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    console.error(
      "Missing INSTAGRAM_ACCESS_TOKEN in .env.\n" +
        "See the comment in .env.example for setup instructions."
    );
    process.exit(1);
  }

  // 1. Refresh token (extends expiry to 60 days from now)
  console.log("Refreshing Instagram access token…");
  try {
    const newToken = refreshToken(token);
    if (newToken && newToken !== token) {
      const envContent = readFileSync(ENV_PATH, "utf-8").replace(
        /INSTAGRAM_ACCESS_TOKEN=.*/,
        `INSTAGRAM_ACCESS_TOKEN=${newToken}`
      );
      writeFileSync(ENV_PATH, envContent);
      token = newToken;
      console.log("  ↳ Token refreshed — .env updated.");
    }
  } catch (err) {
    console.warn(`  ↳ Token refresh failed (${err.message}), continuing with existing token…`);
  }

  // 2. Fetch media
  console.log("Fetching Instagram posts…");
  const response = fetchMedia(token);

  if (response.error) {
    console.error(`Instagram API error: ${JSON.stringify(response.error)}`);
    process.exit(1);
  }

  const posts = (response.data || []).filter(
    (p) => p.media_type === "IMAGE" || p.media_type === "CAROUSEL_ALBUM"
  );

  if (posts.length === 0) {
    console.log("No image posts found. Exiting.");
    return;
  }

  console.log(`Found ${posts.length} image posts.`);

  // 3. Download images
  mkdirSync(IMG_DIR, { recursive: true });

  const items = [];
  for (const post of posts) {
    const imgUrl = post.media_url || post.thumbnail_url;
    if (!imgUrl) continue;

    const ext = imgUrl.includes(".png") ? "png" : "jpg";
    const filename = `${post.id}.${ext}`;
    const outPath = join(IMG_DIR, filename);

    if (!existsSync(outPath)) {
      console.log(`  Downloading ${filename}…`);
      curlBinary(imgUrl, outPath);
    } else {
      console.log(`  ${filename} already exists, skipping.`);
    }

    items.push({
      id: post.id,
      src: `instagram/${filename}`,
      permalink: post.permalink,
      caption: (post.caption || "").slice(0, 120),
      timestamp: post.timestamp,
    });
  }

  // 4. Write data file
  const dataJs = `// Auto-synced from Instagram — last updated ${new Date().toISOString()}
// Re-run: npm run sync:instagram

const instagramPosts = ${JSON.stringify(items, null, 2)};

export default instagramPosts;
`;

  writeFileSync(DATA_PATH, dataJs);
  console.log(`\nWrote ${items.length} posts to src/instagram-data.js`);
  console.log("Done! Run \`npm run dev\` to preview.");
}

main().catch((err) => {
  console.error("Sync failed:", err.message);
  process.exit(1);
});
