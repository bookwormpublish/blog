# Blog

An Astro blog with a built-in cadence system: **2 posts a week, every week.**

## ⚠️ One-time setup (do these or the automation won't run)

1. **Merge this branch to `main`.** GitHub's cron scheduler only runs workflows
   on the default branch — until then, nothing is automated.
2. **Enable GitHub Pages**: repo Settings → Pages → Source → "GitHub Actions".
3. Optionally trigger the scaffold once manually: Actions → "Weekly Draft
   Scaffold" → Run workflow, to confirm it works end to end.

## How the cadence works

- **Monday and Thursday at 9am UTC**, a GitHub Action creates a blank draft in
  `src/content/blog/` and opens an Issue assigned to you as the reminder.
- Each draft comes with a **suggested category** that rotates (tech → books →
  personal → business over 2 weeks) so you never start from a blank "what do I
  write about?".
- If **4+ drafts pile up unwritten**, the Action stops scaffolding and instead
  opens a backlog warning — write before you accumulate.

## Writing ritual (aim for ~45 min per post)

```bash
git pull                       # grab today's scaffolded draft
npm run dev                    # live preview at localhost:4321
# ... write in src/content/blog/YYYY-MM-DD-draft-1.md ...
npm run publish -- src/content/blog/YYYY-MM-DD-draft-1.md "Your Real Title"
git add -A && git commit -m "post: Your Real Title" && git push
```

`npm run publish` sets the real title, updates `pubDate` to today, flips
`draft: false`, and renames the file so the URL slug matches the title.
Pushing to `main` deploys automatically via GitHub Pages.

Need an extra draft outside the schedule? `npm run new-post`.

## Structure

- `src/content/blog/` — posts (Markdown with frontmatter)
- `src/content/config.ts` — frontmatter schema
- `scripts/new-post.mjs` — draft scaffolder (used by the cron workflow)
- `scripts/publish-post.mjs` — one-command publisher
- `.github/workflows/weekly-drafts.yml` — Mon/Thu draft + reminder issue
- `.github/workflows/deploy.yml` — build & deploy to GitHub Pages on push to main
