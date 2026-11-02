# Interactive Client Acquisition (XPLR Systems)

Two folders, two Netlify sites, no database to set up (leads live in Netlify Blobs).

- `ica-engine/`  the public assessment site. One deployment per coach. Read `ica-engine/MANUAL.md`.
- `ica-admin/`   the private leads portal. One deployment for all coaches. Read `ica-admin/MANUAL.md`.

Order of operations for launch:
1. Push `ica-engine` as a repo, deploy on Netlify with `COACH_SLUG=lbyd`. Copy its Site ID.
2. Make a Netlify personal access token.
3. Push `ica-admin` as a repo, deploy on Netlify with `NETLIFY_API_TOKEN` and `COACHES` (see its `.env.example`).
4. Run an assessment end to end, confirm the lead shows in the admin.
5. Brett reviews the Scorecard wording, then launch. Offers (Skool, Talk to Noah, Book a call with Brett) are live in `config.js`.

Logo and the five PDFs are in `ica-engine/public/assets/` for the demo. Move PDFs to Drive later (engine manual, "PDFs on Drive").

First coach: Live Before You Die (slug `lbyd`). Assessments: Are You Winning Everywhere? The 5-Minute Founder Scorecard (default) and Heart Over Head.
