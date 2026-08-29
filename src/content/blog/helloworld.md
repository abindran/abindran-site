---
title: "Hello World"
description: "Why this blog exists, what it runs on, and what I plan to write here."
date: 2026-08-29
tags: ["meta"]
---

This is the first post. It exists mostly to prove the pipeline works end to end — Markdown in git, validated at build time, rendered to static HTML, served from the edge.

## Why build it this way

There is no CMS here, and no database. Content is Markdown files committed alongside the code. That has a few consequences worth stating out loud:

- **Nothing can go down.** There is no API to fail at build time and no service to pay for.
- **Content is portable.** These are plain text files. Moving them somewhere else is a `git clone`, not a migration project.
- **History is real.** Every edit to every article is a commit.

The tradeoff is that publishing requires a push, and there is no web editor. For a personal blog written by one person, that is an easy trade.

## What I plan to write

Mostly long-form technical writing — the kind that takes a few thousand words to do properly. Some of it will be in series, because some topics genuinely need ten parts rather than one.

If that sounds useful, there is an [RSS feed](/rss.xml).
