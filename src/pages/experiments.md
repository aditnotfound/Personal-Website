---
layout: ../layouts/BaseLayout.astro
title: Experiments
description: Things Adit is building (or about to).
---

# Experiments

three things i actually built and one i keep evangelising. written out properly, because "i made an app" tells you nothing.

## Orbit

your network already knows the person you need. the problem is that knowledge is spread across a linkedin export you never opened, a follow list you scroll at 2am, and a memory of someone who mentioned they used to work at stripe. orbit takes all of that and turns it into something you can ask questions to.

you point it at your connections, linkedin and X, and it pulls in who you know. from there it enriches each person into a real profile instead of a name and a job title: headline, current role and company, full job history, location and country, skills, education, certifications, languages, follower count, bio. the enrichment runs through a scraping pipeline so a bare csv row becomes a person with a history.

then you search in english. not filters, not boolean operators. "founders with AI experience", "people who worked at google", "engineers in san francisco", "anyone in fintech who knows someone in mumbai". the query goes to gemini along with a compressed representation of your entire graph, and it comes back with ranked people plus the reason each one matched, so you can see whether it hit on the job history, the skills, the bio, or something in an old position nobody would have filtered for.

what's in it:

- ingest from linkedin and X, plus raw csv and json if you'd rather bring your own dump
- enrichment that fills in job history, skills, schools, certs, languages, location
- natural language search over your own graph, with a stated reason per match
- warm path view: who you'd go through to reach someone instead of cold messaging them
- a globe built on d3 and topojson that plots where your network physically is, which is how i found out mine is embarrassingly concentrated in three cities
- dashboards on industry, seniority, geography, and skill frequency
- collision handling for when the same person shows up twice with two different jobs, so you resolve conflicts instead of holding duplicates
- roast mode, which reads your aggregate stats and tells you exactly how boring your network is. mine got called a linkedin comment section with extra steps

architecture is deliberately client-heavy. react 19 with typescript on vite, zustand with a persist layer so your graph lives in your browser and not on my server, papaparse for imports, gemini for search and roast, d3 plus topojson for the globe, recharts for the dashboard, framer motion for the parts that move, react router tying the pages together. no backend holding your contacts. that was the point.

this lands in the same category as happenstance. it does the parts i wanted: multi source ingest, semantic search over people, transparent match reasoning, warm intros. i built it because paying for access to my own address book felt insane.

## Veil

an ai overlay that sits invisibly on top of whatever you're doing. summon it with a keystroke, ask about what's on your screen, get an answer, dismiss it. no window management, no tab switching, no copy pasting a screenshot into a chat box.

it runs in three modes. ask takes a screenshot and streams an answer about it. listen captures system audio, runs speech to text, and can auto answer as it goes, which is useful for calls and lectures where you don't want to type. knowledge is the part i care about most: you drop in your notes and documents, they get embedded locally, and the relevant chunks get injected into the prompt so answers come back in your context instead of generic ones.

the stack is tauri, so a rust core with a react frontend and a native webview, which keeps the binary small and the overlay fast enough that it feels like part of the os. state lives in a local sqlite database. api keys are yours and stay on disk. global shortcuts for show and hide, dashboard, screenshot, push to talk, and audio listen.

it started as a fork of pluely at 0.1.9, gpl 3.0. upstream gated a chunk of the ui behind a license server. i kept bring your own keys and local data, unlocked the rest, and moved on. this is the genre everyone is racing to build right now and most of them want your keys on their servers.

## PicoGPT

not mine. this is [kuber's](https://github.com/kuberwastaken), and i bring it up constantly because it is the funniest possible answer to "how small can a language model get."

karpathy posted microgpt. kuber noticed it wasn't minified, minified it, then kept going until an entire gpt fit inside a qr code. you scan the code with your phone and a model trains in your browser.

thirty nine lines of dependency free javascript. inside those lines: a hand rolled autograd engine, multi head attention with four heads, a feed forward mlp with a gelu approximation, adamw with a cosine learning rate schedule, both training and inference loops, and a seeded xoshiro128 prng so runs reproduce. one layer, embedding dimension 16, context length 8, mlp width 64. 4,064 parameters total.

the delivery is the good part. the html payload is gzipped, base64 encoded, and stuffed into a version 40-L qr code, all 2,953 bytes of it. the browser's native DecompressionStream unpacks it on scan, renders the page, and starts training. no install, no server, no dependencies. a python version lives in legacy at 64 lines.

it's a dare more than a product, and i think work like this matters more than another wrapper. it tells you where the actual floor is.

---

more as they go from idea to repo to slightly less embarrassing. some of these will age badly and i'll leave them up anyway.
