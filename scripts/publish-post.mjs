// Publish a draft in one command:
//   npm run publish -- src/content/blog/2026-07-06-draft-1.md "My Real Title"
//
// It sets the real title, flips draft to false, updates pubDate to today,
// and renames the file so the URL slug matches the title.

import { readFile, writeFile, rename } from 'fs/promises';
import { dirname, join } from 'path';

const [file, title] = process.argv.slice(2);

if (!file || !title) {
  console.error('Usage: npm run publish -- <draft-file> "Post Title"');
  process.exit(1);
}

const today = new Date();
const dateStr = [
  today.getFullYear(),
  String(today.getMonth() + 1).padStart(2, '0'),
  String(today.getDate()).padStart(2, '0'),
].join('-');

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .trim()
  .replace(/\s+/g, '-');

let content = await readFile(file, 'utf8');
content = content
  .replace(/^title:.*$/m, `title: "${title.replace(/"/g, '\\"')}"`)
  .replace(/^pubDate:.*$/m, `pubDate: ${dateStr}`)
  .replace(/^draft:\s*true\s*$/m, 'draft: false');

// Drop the scaffold helper comments
content = content.replace(/^<!-- (Suggested category|When done).*-->\n/gm, '');

const newPath = join(dirname(file), `${dateStr}-${slug}.md`);
await writeFile(file, content);
await rename(file, newPath);

console.log(`Published: ${newPath}`);
console.log('Now run: git add -A && git commit -m "post: ' + title + '" && git push');
