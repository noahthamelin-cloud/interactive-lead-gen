# Interactive Client Acquisition: Admin Portal

The private half of XPLR's Interactive Client Acquisition system. The engine (in the `ica-engine` folder) is what the public sees. This is the back door where the coach sees who took the assessments and what they answered.

## What it is

One Netlify site, separate from every coach's assessment site, that any coach can sign into with their coach ID and PIN. They only ever see their own leads. It reads each coach's leads straight out of that coach's engine site (Netlify Blobs) using a Netlify access token.

One admin deployment serves every coach. You do not deploy a new admin per coach.

## What a coach sees

- Sign in: coach ID (the slug, for example `lbyd`) and PIN.
- Three counts: total leads, last 7 days, new since their last visit.
- Search by name, number, email or handle. Filter by assessment and by pattern.
- Tap a lead: contact details with a one-tap WhatsApp link (pre-filled opener), their scores as bars, the three actions they were shown, and every question with the answer they gave.
- Export CSV of whatever is currently filtered. Columns: date, assessment, contact details, pattern, lowest dimension, every score, every answer. This is also the coach's backup and their "I own my data" answer.
- Refresh and sign out.

The PIN is held in the browser session only. Close the tab, sign in again.

## Files

```
ica-admin/
  public/index.html            the whole portal
  netlify/functions/leads.js   checks the PIN, reads that coach's leads from their engine site's Blobs store
  netlify.toml                 build settings, no-index and no-cache headers
  package.json                 one dependency, @netlify/blobs
  .env.example                 the two environment variables Netlify needs
```

## Deploy

1. Push this folder as its own GitHub repo.
2. Make a Netlify personal access token: Netlify > User settings > Applications > Personal access tokens > New. Copy it once.
3. Netlify > Add new site > Import from GitHub. Add two environment variables:
   - `NETLIFY_API_TOKEN` = the token from step 2
   - `COACHES` = JSON, one entry per coach. For LBYD:
     `{"lbyd":{"name":"Live Before You Die","pin":"choose-a-pin","siteId":"<the engine site's Site ID>"}}`
4. Deploy. Sign in with `lbyd` and the PIN you chose.

Give the admin a domain nobody would guess, or leave it on the Netlify address. It is set to no-index.

## Adding a coach

Add an entry to `COACHES`: slug, name, PIN, and their engine site's Site ID. Redeploy the admin (Netlify > Deploys > Trigger deploy) so the new variable is read.

## Changing a PIN

Edit the PIN in `COACHES` and trigger a deploy.

## Security notes

- The access token and PINs live only in Netlify's environment variables, never in the HTML. The token can read any of your Netlify sites, so treat it like a password.
- A wrong PIN is slowed by 600ms to make guessing slow. Use PINs with letters and numbers for real coaches, not four digits.
- The portal is read-only. Nothing here can delete or change a lead. Do that in Netlify > engine site > Blobs if ever needed.

## Not here yet

- Lead status (contacted, booked, joined) and notes per lead. Easy next step: add `status` and `notes` columns and a second function action.
- Pushing leads into a coach's CRM. The LBYD CRM can read the same Blobs store, or the move to Supabase happens first.
- Email alerts when a new lead lands.

## Built

Nov 1, 2026 by Noah (XPLR Systems) with Claude.
