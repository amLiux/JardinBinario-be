---
description: JardinBinario-be → Hortus Clavis auth migration workflow with DevCadence protocol
agent: build
---

skill({ name: "devcadence" })

Activate DevCadence protocol + Hortus Clavis migration context for jardinbinario-be.

## Usage

/hortus-migrate <mode>

Modes:
- standup — define today's migration tasks, create ticket
- pair — implement HC integration, answer questions, caveman Full
- review — check migration code against ticket, approve or request changes
- checkout — wrap up, update progress, estimate remaining

## Project Context

### JardinBinario-be
- Project: jardinbinario-be
- Framework: TypeScript + Apollo GraphQL + MongoDB (Mongoose)
- Log dir: ~/docs/opencode-jb-be/
- Progress file: ~/docs/opencode-jb-be/progress.json
- Plan file: ~/docs/opencode-jb-be/plan.md
- Ticket format: HC-XX

### Hortus Clavis (auth provider)
- API: https://hortusclavis-production.up.railway.app
- Service: `jardinbinario` (already registered)
- Actions: blog:read, blog:write, ticket:read, ticket:write, newsletter:read, metrics:read, metrics:write, user:read, user:write, user:admin
- Roles: admin (all actions), user (non-admin actions)

### Integration Points
- `src/controllers/Auth.controller.ts` — replace `generateJWT` with `HortusProvider.login`
- `src/helpers/getCustomContext.ts` — replace `verifyJWT` with `HortusProvider.verify`
- `src/services/HortusProvider.ts` — HC HTTP client class
- `.env` — add `HORTUS_CLAVIS_URL`
- Keep local MongoDB + local JWT as fallback for existing users not yet registered in HC

## On Activation
1. Read ~/docs/opencode-jb-be/progress.json
2. Find current phase + first pending ticket
3. Read last checkout log (or most recent log if first run)
4. Scan global logs (global: true) for critical decisions

## On Review Approval
- Update progress.json: mark ticket completed, advance to next
- Append to humanLog with timestamp, phase, ticketId
- Write log entry to ~/docs/opencode-jb-be/logs/YYYY-MM-DD-<mode>.json
- Update phase status if all tasks in phase are done

## Rules
- Follow devcadence mode chain: checkout → standup → pair → review → checkout
- Pair/review: caveman Full mode
- Standup/checkout: normal tone
- Keep local auth as fallback — don't break existing users
