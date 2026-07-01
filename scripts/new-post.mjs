import { readdir, readFile, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const BLOG_DIR = 'src/content/blog';
const MAX_PENDING_DRAFTS = 4;

if (!existsSync(BLOG_DIR)) {
  mkdirSync(BLOG_DIR, { recursive: true });
}

const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
const dateStr = `${yyyy}-${mm}-${dd}`;

const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const friendlyDate = `${monthNames[today.getMonth()]} ${today.getDate()}, ${yyyy}`;

const existing = await readdir(BLOG_DIR).catch(() => []);

// Guard: if too many unwritten drafts have piled up, don't add another one.
// Writing the backlog beats scaffolding guilt.
let pending = 0;
for (const f of existing.filter(f => f.endsWith('.md'))) {
  const body = await readFile(join(BLOG_DIR, f), 'utf8');
  if (/^draft:\s*true/m.test(body)) pending++;
}
if (pending >= MAX_PENDING_DRAFTS) {
  process.stdout.write(`SKIP:${pending}\n`);
  process.exit(0);
}

// Rotate the suggested category so every topic gets covered every 2 weeks:
// Mon week A: tech, Thu week A: books, Mon week B: personal, Thu week B: business
const categories = ['tech', 'books', 'personal', 'business'];
const weekNumber = Math.floor(today.getTime() / (7 * 24 * 60 * 60 * 1000));
const isSecondPostOfWeek = today.getDay() >= 4 || today.getDay() === 0;
const category = categories[((weekNumber % 2) * 2 + (isSecondPostOfWeek ? 1 : 0)) % 4];

const todayDrafts = existing.filter(f => f.startsWith(`${dateStr}-draft-`));
const nextNum = todayDrafts.length + 1;

const filename = `${dateStr}-draft-${nextNum}.md`;
const filepath = join(BLOG_DIR, filename);

const content = `---
title: "Draft Post — ${friendlyDate}"
description: ""
pubDate: ${dateStr}
draft: true
tags: []
category: "${category}"
---

<!-- Suggested category this cycle: ${category} — change it if inspiration strikes elsewhere. -->
<!-- When done: npm run publish -- ${filepath} "Your Real Title" -->

Write your post here...
`;

await writeFile(filepath, content);
process.stdout.write(filepath + '\n');
