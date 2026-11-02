// Admin portal API. Checks the coach's PIN, then reads that coach's leads from their engine site's Blobs store.
// Env vars:
//   NETLIFY_API_TOKEN  a personal access token (Netlify > User settings > Applications > Personal access tokens)
//   COACHES            JSON: {"lbyd":{"name":"Live Before You Die","pin":"change-me","siteId":"<engine site ID>"}}
const { getStore } = require("@netlify/blobs");
const json = (status, body) => ({ statusCode: status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }, body: JSON.stringify(body) });

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  const { NETLIFY_API_TOKEN, COACHES } = process.env;
  if (!NETLIFY_API_TOKEN || !COACHES) return json(500, { error: "Admin is not configured. Set NETLIFY_API_TOKEN and COACHES." });
  let coaches; try { coaches = JSON.parse(COACHES); } catch (e) { return json(500, { error: "COACHES is not valid JSON" }); }

  let p; try { p = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad JSON" }); }
  const slug = String(p.coach || "").trim().toLowerCase(), pin = String(p.pin || "").trim();
  if (!slug || !pin) return json(400, { error: "Coach and PIN are required" });
  const c = coaches[slug];
  if (!c || String(c.pin) !== pin) {
    await new Promise(r => setTimeout(r, 600)); // slow down guessing
    return json(401, { error: "That coach and PIN don\u2019t match." });
  }
  if (!c.siteId) return json(500, { error: `No siteId set for ${slug} in COACHES` });

  try {
    const store = getStore({ name: "leads", siteID: c.siteId, token: NETLIFY_API_TOKEN, consistency: "strong" });
    const { blobs } = await store.list();
    const keys = blobs.map(b => b.key).sort().reverse().slice(0, 2000);   // newest first (keys start with the timestamp)
    const leads = (await Promise.all(keys.map(k => store.get(k, { type: "json" }).catch(() => null)))).filter(Boolean);
    return json(200, { coach: { slug, name: c.name || slug }, leads });
  } catch (e) { return json(502, { error: "Could not read the leads store", detail: String(e.message || e) }); }
};
