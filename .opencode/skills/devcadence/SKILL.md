---
name: devcadence
description: Structured AI collaboration protocol with standup/pair/review/checkout modes, standardized logs, and developer behavioral observations
license: MIT
compatibility: opencode
metadata:
  audience: developers
  workflow: collaboration
---

# DevCadence Protocol

AI collaboration workflow with 4 modes, standardized logs, and developer growth tracking.

## Log Schema

All logs use this schema:

```json
{
  "id": "YYYY-MM-DD-<mode>",
  "mode": "standup|pair|review|checkout",
  "timestamp": "ISO8601",
  "phase": 1,
  "ticketIds": ["XXX-01"],
  "global": false,
  "human": {
    "summary": "One-line summary",
    "notes": "Detailed human-readable notes"
  },
  "machine": {
    "context": "Technical context, decisions, blockers",
    "nextAction": "What to do next"
  },
  "observations": [],
  "references": []
}
```

## Mode Chain

Default chain:

```
flowchart LR
  standup-->pair
  pair-->review
  review-->checkout
  standup-->checkout
  pair-->checkout
```

Modes can be skipped (review is commonly skippable). Agent checks last mode on start and warns if chain is unusual but never blocks.

### Standup
- **Writes:** ticket, tasks, acceptance criteria
- **Purpose:** "What are we doing today?"
- **Tone:** Normal
- **Caveman:** No
- **Branch (control=branch/total):** At end, ask "Create branch {prefix}/{ticketId}?" If yes, create from main. Auto if control=total.

### Pair
- **Writes:** key decisions, discoveries, blockers
- **Purpose:** User codes, AI answers (passive unless critical flag)
- **Tone:** Caveman Full
- **Caveman:** Yes
- **Proactive:** Deprecated API or paradigm mismatch? Flag immediately.
- **Auto-logging:** Every meaningful exchange auto-updates the pair log in real-time. Agent owns log management — user should never ask "did you log this?" If no new info, agent says nothing. If a decision, observation, or blocker emerges, agent writes it immediately without being prompted.
- **Commits (control=branch/total):** On user request or after completing acceptance criteria, commit on current branch using commitTemplate. control=total commits without asking, control=branch asks first.

### Review
- **Writes:** approve/request changes, observations
- **Purpose:** Quality check against ticket acceptance criteria
- **Tone:** Caveman Full
- **Caveman:** Yes
- **On approval:** Update progress.json, advance ticket, append humanLog. If git configured, squash-merge branch or create PR.
- **Observations:** Track developer patterns for growth feedback
- **Diff check:** Read git diff on branch against acceptance criteria. Flag any mismatch.

### Checkout
- **Writes:** progress update, remaining estimate, prep for next standup
- **Purpose:** Wrap up, estimate what's left
- **Tone:** Normal
- **Caveman:** No
- **Reads:** git diff + status for accurate progress. If branch active, suggest PR or squash-merge.

## File Locations

```
~/docs/<project>/
├── logs/
│   ├── YYYY-MM-DD-standup.json
│   ├── YYYY-MM-DD-pair.json
│   ├── YYYY-MM-DD-review.json
│   └── YYYY-MM-DD-checkout.json
├── progress.json
└── plan.md
```

## Progress Schema

```json
{
  "project": "<project-name>",
  "currentPhase": 1,
  "currentTicketIds": ["XXX-01"],
  "lastMode": "checkout",
  "cavemanMode": "full",
  "git": {
    "control": "manual|branch|total",
    "repo": "owner/repo",
    "branchPrefix": "feat",
    "commitTemplate": "#{ticketId} {message}"
  },
  "workflow": {
    "diagram": "flowchart LR\n  standup-->pair\n  pair-->review\n  review-->checkout\n  standup-->checkout\n  pair-->checkout",
    "skippable": ["review"],
    "defaultStart": "standup"
  },
  "tickets": [
    {
      "id": "XXX-01",
      "phase": 1,
      "task": "Description",
      "files": ["path/to/file.ts"],
      "acceptance": ["Criterion 1"],
      "status": "pending|in-progress|completed",
      "createdAt": "ISO8601",
      "completedAt": null,
      "reviewStatus": null
    }
  ],
  "humanLog": [
    {
      "id": "hl-001",
      "type": "checkpoint|decision|blocker|observation|milestone",
      "logRef": "YYYY-MM-DD-<mode>",
      "message": "Quick human-readable summary",
      "timestamp": "ISO8601",
      "phase": 1,
      "ticketIds": ["XXX-01"],
      "author": "agent|user",
      "tags": ["tag1"]
    }
  ],
  "observations": [
    {
      "id": "obs-001",
      "pattern": "Description of observed coding pattern",
      "severity": "blocker|warning|suggestion|praise",
      "confidence": "emerging|established|confirmed",
      "ticketIds": ["XXX-01"],
      "suggestion": "What to do instead",
      "firstSeen": "ISO8601",
      "timesObserved": 1
    }
  ]
}
```

## humanLog vs logs/

- **logs/*.json** — Full conversation record. Machine-readable for AI context. One per mode invocation.
- **progress.json > humanLog** — Digest/summary of important moments. One-liner per entry, links to full log via `logRef`. Designed for external API consumption (FastAPI dashboard, PM reports).

On each mode's log creation, append a `humanLog` entry to progress.json.

## Observations (Developer Growth)

Observations track coding patterns across sessions. Structure supports `/devcadence 1:1` command:

- Review mode adds observations when patterns emerge
- `confidence` upgrades: emerging → established (3+ times) → confirmed (user acknowledged)
- `/devcadence 1:1` reads all observations across projects, groups by pattern, ranks by severity × frequency
- Output: personalized growth plan with resources (books, courses, docs)

## Git Control Levels

| Level | Branch Creation | Commits | Push to main |
|-------|----------------|---------|--------------|
| `manual` | Agent suggests, you run | You write | You decide |
| `branch` | Agent asks at standup end | Agent commits with template, asks | Never. PR only |
| `total` | Auto on standup | Agent commits + pushes directly | Yes (solo dev) |

- **control=manual**: no git automation. Agent just reads git status for context.
- **control=branch**: standup creates branch from main (with ask). Pair commits on branch with `commitTemplate`. Review checks diff. Checkout suggests PR/merge.
- **control=total**: same as branch but no asking — auto on everything.

## Rules

1. **Mode chain flexible** — default standup→pair→review→checkout. Skippable modes allowed. Agent warns on unusual transitions but does not block.
2. **Global flag** — any log with `"global": true` scanned on every mode start for critical decisions.
3. **Ticket IDs** — array format. Multiple tickets per log.
4. **Observations** — review mode tracks developer patterns for growth feedback.
5. **Auto-update** — on review approval, update progress.json status, advance ticket, append to humanLog.
6. **Caveman Full** — pair and review modes use terse, fragment-style communication.
7. **Auto-logging** — logs are the agent's responsibility, not the user's. Every mode silently updates its log file as context accumulates. User never asks "did you log this?"
8. **Git safety** — never push to main unless `control=total`. Branches always start from latest main.

## Extending DevCadence

This protocol is designed to be extended. To create a project-specific workflow:

1. Reference this skill: `skill({ name: "devcadence" })`
2. Add project context: log dir, progress file path, ticket ID format, custom modes
3. Customize workflow mermaid in progress.json for non-standard chains

Future modes: `/devcadence 1:1`, `/devcadence retrospective`, `/devcadence release`

## Caveman Mode

Pair and review modes use caveman Full style:
- Drop articles (a, an, the)
- Use fragments
- Direct, no filler
- Same technical accuracy, ~55% fewer tokens

Normal: "The component is re-rendering because you're creating a new object reference each render"
Caveman: "Component re-renders. New object ref each render. Wrap in useMemo."
