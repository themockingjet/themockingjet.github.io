---
name: themockingjet.
title: Associate Software Engineer
location: Philippines
github: https://github.com/themockingjet
tagline: Backend engineer building automation systems for teams that ship fast.
---

## About

personas: backend engineer, fullstack developer, automation engineer, hobbyist

[origin]
I'm Jet — a {backend engineer|fullstack developer|automation engineer|hobbyist developer} from the Philippines. It started when I kept noticing processes that could be replaced with code, and eventually the code won. My first project was {a Python script replacing a manual workflow nobody wanted to touch|a web app connecting tools my team was copy-pasting between|an AutoHotkey bot that farmed an MMO while I slept|a script I wrote because I refused to do the same thing twice} — it ran, it worked, and I never looked back.

[work]
I'm on an R&D team right now, mostly building {backend services and APIs that other teams rely on|full-stack apps from schema to deploy|automation that eliminates whatever someone's been doing manually|AI solutions — agents, pipelines, the stuff that's actually useful}. I use {Python, .NET, and MSSQL|React, TypeScript, and Node.js|Python, TypeScript, and whatever glue holds it together|agent-framework, copilot and Azure AI}. I'm allergic to repetition — if I catch myself doing the same thing twice, I'll automate it before the third time. My friends would say I {work too much and ship too fast|overthink the architecture but ship anyway|spend more time automating the task than doing it|build tools for problems nobody asked me to solve}.

[direction]
Right now I'm focused on {building services that hold up without me babysitting them|shipping things end-to-end, fast|AI agents that actually do useful work instead of burning tokens on fake loops|making tools people reach for daily}. Working with {.NET, PostgreSQL, and Azure|React, TypeScript, and MSSQL|agent-framework, copilot and Azure AI|whatever gets the result fastest}. If it's repetitive, it shouldn't need a human. That's the hill I'll die on.

## Projects

### Binance Trading Bot
status: beta
stack: Bun, TypeScript, Binance API, Binance Websocket, TA-Lib, Svelte, Tailwind CSS

Real-time market signals arrive and expire in milliseconds — reacting to them manually isn't viable. Built a bot that subscribes to Binance Websocket streams, evaluates TA-Lib indicators in real time, and executes positions automatically.

[Context]
Binance is the world's largest cryptocurrency exchange by trading volume. Traders monitor price movements across hundreds of pairs simultaneously — a task impossible to do manually at the speed the market moves.

[What It Does]
Subscribes to real-time websocket streams, runs technical analysis (RSI, MACD, Bollinger Bands) on incoming candles, and executes buy/sell orders when signal conditions are met — all without human input.

[Key Decisions]
Used Bun for fast startup and native TypeScript execution. TA-Lib handles indicator math reliably. Svelte dashboard provides real-time position monitoring without polling.

[Impact]
Processes 50+ trading pairs simultaneously with sub-100ms signal-to-execution latency. Eliminated manual chart monitoring entirely.

### themockingjet.github.io
status: beta
url: https://github.com/themockingjet/themockingjet.github.io
stack: React, TypeScript, Vite, GitHub Pages

This site. Built from scratch — no templates, no themes. Markdown-driven content, CSS Modules, motion animations.

[Context]
Most developer portfolios look the same — template-driven, static pages that say nothing about how the person thinks. Needed something that felt like a system, not a brochure.

[What It Does]
Renders all content from markdown at build time. Dashboard-style navigation with motion transitions. Each section is a navigable module, not a scroll target.

[Key Decisions]
Stayed on React + Vite for simplicity — no SSR needed for a static portfolio. CSS Modules over Tailwind for precise scoping. Framer Motion for cinematic micro-interactions.

[Impact]
Lighthouse performance score 90+ on mobile. Full accessibility compliance (axe-clean). Sub-2s load time on 3G.

### Discord Axie Infinity Marketplace
status: deprecated
stack: Discord.js, MongoDB, JavaScript, Node.js

Axie NFT prices moved by the minute and buyers couldn't coordinate fast enough manually. Built a Discord bot that handled the full transaction loop.

[Context]
Axie Infinity is a blockchain game where players trade NFT creatures. During peak activity, prices shifted faster than Discord communities could organize buyers and sellers.

[What It Does]
Monitored Axie marketplace listings, matched buyers with sellers based on criteria, and processed transactions through Discord commands — removing coordination friction.

[Key Decisions]
MongoDB for flexible NFT metadata schemas. Discord.js for real-time event handling. Deployed as a persistent process with crash recovery.

[Impact]
Handled 200+ daily transactions at peak. Reduced buyer-seller coordination time from minutes to seconds.

### SecondLife AFK Bot
status: deprecated
stack: AutoHotkey

SecondLife disconnects idle accounts automatically, breaking long sessions. Built an AHK script that kept sessions alive.

[Context]
SecondLife is a virtual world where users earn currency through in-world activities that require being online. Disconnections meant lost income during idle periods.

[What It Does]
Sends periodic input to prevent idle detection, monitors connection state, and fires a desktop notification on disconnect so the user can reconnect immediately.

[Key Decisions]
AutoHotkey chosen for direct Windows input simulation without dependencies. Minimal footprint — runs as a background script with no UI.

[Impact]
Maintained 24/7 uptime for earning sessions. Zero manual reconnections needed during active use.

### Ragnarok Private Server Auto-Quest
status: deprecated
stack: AutoHotkey

Ticket questing in Ragnarok required the same NPC sequence, dozens of times per session. Automated the full loop.

[Context]
Ragnarok Online private servers often feature repetitive quest NPCs that require navigating the same dialogue tree repeatedly to earn event tickets or rewards.

[What It Does]
Automates pathing to the NPC, navigates dialogue options, selects rewards, and loops the sequence — hands-free farming of quest rewards.

[Key Decisions]
Pixel-based detection for NPC proximity. Configurable delays to avoid detection by anti-bot measures. Single-file script for portability.

[Impact]
Automated 8+ hours of daily grinding into a single script execution. Freed play time for actual gameplay.

## Skills

### Stack
Python, JavaScript, TypeScript, Svelte, Tailwind CSS, Bun, PostgreSQL, AutoHotkey

### Others
Copilot, Azure, .NET, ASP.NET, semantic-kernel, agent-framework

