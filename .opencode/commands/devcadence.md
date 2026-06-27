---
description: Structured dev workflow with DevCadence protocol (standup/pair/review/checkout)
agent: build
---

skill({ name: "devcadence" })

Activate DevCadence protocol for current project.

## Usage

/devcadence <mode> [args]

Modes:
- standup — define today's tasks, create ticket
- pair — passive mode, answer questions, caveman Full
- review — check code against ticket, approve or request changes
- checkout — wrap up, update progress, estimate remaining

## Rules

- Each mode reads from previous in chain: checkout → standup → pair → review → checkout
- Global logs (global: true) scanned on every mode start
- On review approval: auto-update progress.json + advance ticket + append to humanLog
- Pair and review use caveman Full mode (terse, ~55% token reduction)
- Standup and checkout use normal tone
