# AgentFend - Changelog

Security research, threat intelligence, and AI skill auditing — by the AgentFend team.

This is the official blog and changelog for AgentFend, a platform dedicated to auditing AI agents and identifying security risks in automated workflows.

## 🚀 Features

- **🛡️ Security Focused**: Deep dives into threat intelligence and AI skill auditing.
- **⚡ Modern Stack**: Built with [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), and [Tailwind CSS 4](https://tailwindcss.com/).
- **📝 Content Engine**: Powerful MDX-driven posts powered by [Fumadocs](https://fumadocs.vercel.app/).
- **🔐 Secure Auth**: Robust authentication system using [Better Auth](https://www.better-auth.com/).
- **💾 Data Layer**: [Drizzle ORM](https://orm.drizzle.team/) with [Neon PostgreSQL](https://neon.tech/) for high-performance data management.
- **🔔 Integration**: Discord Webhook notifications and [Resend](https://resend.com/) newsletter support.
- **📱 Responsive Design**: Premium, dark-themed UI with smooth animations and shadcn/ui components.

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js 20+
- A Neon PostgreSQL database
- Resend API key for emails

### Installation

```bash
bun install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in the required credentials:

```bash
cp .env.example .env
```

Key variables to configure:
- `DATABASE_URL`: Your Neon PostgreSQL connection string.
- `BETTER_AUTH_SECRET`: Generate using `openssl rand -base64 32`.
- `NEXT_PUBLIC_BASE_URL`: Your deployment URL (defaults to `http://localhost:3000`).
- `DISCORD_WEBHOOK_URL`: For build and post notifications.

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the development site.

## 📁 Project Structure

```
├── content/             # Blog posts in MDX
├── src/
│   ├── app/            # Next.js App Router
│   ├── components/     # UI components & Design System
│   ├── constants/      # Site configuration & Navigation
│   ├── lib/            # Shared utilities & Metadata logic
│   ├── server/         # Auth, DB, and Server Actions
│   └── styles/         # Global CSS & Tailwind config
├── drizzle.config.ts    # Database schema configuration
└── source.config.ts     # Fumadocs content configuration
```

## 📖 Writing Content

New posts should be added to `content/blog/`. Each post requires valid frontmatter:

```mdx
---
title: "Analyzing Prompt Injection in AI Agents"
description: "A summary of recent vulnerabilities found in autonomous agents."
date: 2026-03-24
author: "AgentFend Team"
tags: [security, ai, auditing]
---
```

## 📜 Commands

| Command | Action |
|---------|--------|
| `bun dev` | Starts the development server |
| `bun build` | Builds the project for production |
| `bun start` | Runs the production build |
| `bun db:push` | Pushes schema changes to Neon |
| `bun db:studio` | Opens the Drizzle Studio database viewer |
| `bun check` | Lints and formats the codebase with Biome |

## ⚖️ License

Built with ❤️ by the AgentFend Team. Licensed under the [MIT License](LICENSE).
