import { readdir, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const BLOG_DIR = 'src/content/blog';

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

// Find next available draft number for today
const existing = await readdir(BLOG_DIR).catch(() => []);
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
category: "tech"
---

# TODO: Add your title here

Write your post here...

## Introduction

## Main Content

## Conclusion
`;

await writeFile(filepath, content);
process.stdout.write(filepath + '\n');
