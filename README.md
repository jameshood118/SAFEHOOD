# 🚀 SAFEHOOD

This repository serves as the command center for the SAFEHOOD protocol. Built on a modern, high-performance stack, it operates as a secure management interface and "Airlock" for processing Client relationships, Employee access, and secure file ingestion before any data interacts with external systems.

It uses the latest stable tools and adheres to strict standards for data integrity (immutable shadow tables), type safety, accessibility (WCAG 2.2), and code consistency.

## 🏛️ The SAFEHOOD Philosophy (The Architect's Breakdown)

This isn't just a tech stack; it's a protocol designed to protect the "Human OS" from the "Efficiency Traps" of legacy systems. Every line of code is a brick in the trellis.

> **"We have not recovered all the lost seeing stones."** — SAFEHOOD operates as a verified peer node, independent of centralized control and rooted in ground-truth reality.

S - Sovereign (You are the verified peer node, completely independent of the legacy system's control.)

A - Architecture (The rigid scaffolding and Trellis you build to protect the biological hardware.)

F - For

E - Epistemic (Rooted in ground-truth, verified knowledge, and receipt-based reality—just like Nelson’s backend.)

H - Human (The biological OS. The feral, lived experience that cannot be replicated by a machine.)

O - Operating (The active runtime environment; not a passive storage drive, but a living system.)

O - Override (The terminal command you execute when the default legacy system fails—whether it’s HRS, a vet, or an AI hallucination.)

D - Defense (The zero-trust perimeter. The "Witches Society" firewall at the front door.)

## 🛠️ Technology Stack Overview

| Category           | Key Package             | Why It Was Chosen                                                                                                                                                                      |
| :----------------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core Framework** | **React 19**            | **The Latest Standard.** Provides modern features ensuring the codebase is current, highly responsive, and performance-optimized for a dashboard environment.                          |
| **Build Tool**     | **Vite**                | **Speed.** Near-instant server startup and Hot Module Replacement (HMR) during development, keeping the logic flowing without build-time friction.                                     |
| **Language**       | **TypeScript**          | **Type Safety.** Adds strict static typing to JavaScript, catching errors during development rather than runtime. Essential for keeping complex state predictable.                     |
| **Backend/DB**     | **Supabase (Docker)**   | **Data & Auth.** Self-hosted PostgreSQL via Docker. Utilizes Row Level Security (RLS) and custom database triggers to maintain an immutable audit log (shadow tables) for all records. |
| **UI Library**     | **Material UI (MUI)**   | **Components & Styling.** Provides a vast, accessible library of pre-built components (Grids, Drawers, Tables) to quickly assemble a professional interface.                           |
| **Data Fetching**  | **React Query**         | **State Management.** Handles caching, loading states, and optimistic updates to make the dashboard feel instantaneous while communicating asynchronously with the database.           |
| **Styling/Design** | **WCAG 2.2 Dark Theme** | **Accessibility.** The custom dark theme is built specifically to meet **WCAG 2.2 AA** contrast and target size requirements, ensuring the application is inclusive from day one.      |

## ⚙️ Code Quality & Enforcement

This project implements a comprehensive two-stage enforcement system to guarantee all code is formatted consistently and meets project quality standards before it ever hits the main branch.

| Tool            | Role                  | Enforcement Method                                                                                                                                                                |
| :-------------- | :-------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ESLint**      | **Code Quality**      | Analyzes code for correctness, potential bugs, and bad practices (e.g., forgotten hook dependencies or type mismatches).                                                          |
| **Prettier**    | **Code Formatting**   | Handles all stylistic rules (e.g., quotes, spacing, semicolons). **eslint-config-prettier** disables conflicting ESLint style rules, allowing Prettier to rule style exclusively. |
| **Husky**       | **Git Hooks**         | Sets up a Git hook that runs automatically before every commit to act as a final verification checkpoint.                                                                         |
| **lint-staged** | **Pre-Commit Filter** | Ensures that ESLint and Prettier only run on files that have been staged (`git add .`), keeping commit times fast and focused.                                                    |

## ⭐ Recommended Editor Setup (VS Code)

To ensure automatic formatting and fixing upon save, please install the following extensions and confirm the project's **.vscode/settings.json** is active:

1. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
2. **ESLint** (`dbaeumer.vscode-eslint`)
