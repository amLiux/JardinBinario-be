## DevCadence + Hortus Migration

This project uses DevCadence protocol for structured development workflow.

## Commands

- `/devcadence <mode>` — generic dev workflow
- `/hortus-migrate <mode>` — Hortus Clavis auth migration workflow

## Mode Chain

standup → pair → review → checkout (review skippable)

## Quick Reference

- Logs: `~/docs/opencode-jb-be/logs/`
- Progress: `~/docs/opencode-jb-be/progress.json`
- Plan: `~/docs/opencode-jb-be/plan.md`
- Tickets: HC-XX

## Hortus Clavis

- API: `https://hortusclavis-production.up.railway.app`
- Service: `jardinbinario` (already registered)
- Actions: blog:read, blog:write, ticket:read, ticket:write, newsletter:read, metrics:read, metrics:write, user:read, user:write, user:admin
- Roles: admin (all), user (non-admin)
- Credentials in `.env` (add `HORTUS_CLAVIS_URL`)
