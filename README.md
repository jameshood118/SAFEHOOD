# 🚀 SAFEHOOD

![The SAFEHOOD Protocol](public/assets/SAFEHOOD.png)

This repository serves as the command center for the SAFEHOOD protocol. Built on a modern, high-performance stack, it operates as a secure management interface and &quot;Airlock&quot; for processing Client relationships, Employee access, biological telemetry, and secure file ingestion before any data interacts with external legacy systems.

It uses the latest stable tools and adheres to strict standards for data integrity (immutable shadow tables), type safety, accessibility (WCAG 2.2), and code consistency.

---

## 🏛️ The SAFEHOOD Philosophy (The Architect&#39;s Breakdown)

This isn&#39;t just a tech stack; it&#39;s a protocol designed to protect the &quot;Human OS&quot; from the &quot;Efficiency Traps&quot; of legacy systems. Every line of code is a brick in the trellis.

&gt; **&quot;We have not recovered all the lost seeing stones.&quot;** — SAFEHOOD operates as a verified peer node, independent of centralized control and rooted in ground-truth reality.

* **S - Sovereign** (You are the verified peer node, completely independent of the legacy system&#39;s control.)
* **A - Architecture** (The rigid scaffolding and Trellis you build to protect the biological hardware.)
* **F - For**
* **E - Epistemic** (Rooted in ground-truth, verified knowledge, and receipt-based reality—just like Nelson’s backend.)
* **H - Human** (The biological OS. The feral, lived experience that cannot be replicated by a machine.)
* **O - Operating** (The active runtime environment; not a passive storage drive, but a living system.)
* **O - Override** (The terminal command you execute when the default legacy system fails—whether it’s HRS, a vet, or an AI hallucination.)
* **D - Defense** (The zero-trust perimeter. The &quot;Witches Society&quot; firewall at the front door.)

---

## 🌌 The Matrix (OS Partitions)

The Rig is divided into isolated, highly optimized operational zones:

* **Command Center (`/`)**: The master dashboard HUD. Live telemetry, system status, and immediate routing.
* **Human OS (`/manifests`)**: The Clean Room. Contains immutable core directives, Master Manifests, and the Sovereign Pilot&#39;s historical logs.
* **Work OS (`/personnel`)**: Professional Node tracking. Client intake, threat level assessments, and Jinba Ittai alignment meters.
* **Furry Nodes (`/furry-nodes`)**: Biological asset tracking. Master telemetry database for diet, veterinary records, and status readouts.
* **Home OS (`/home`)**: The Base Camp. A raw intake &quot;Dropzone&quot; for unstructured data and intel quarantine.
* **Temporal Vault (`/temporal-logs`)**: The Foreverglades Terminal. A raw, CRT-styled interface for scrubbing and filtering analog logs.

---

## 🛠️ Technology Stack Overview

| Category | Key Package | Why It Was Chosen |
| :----------------- | :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core Framework** | **React 19** | **The Latest Standard.** Provides modern features ensuring the codebase is current, highly responsive, and performance-optimized for a dashboard environment. |
| **Build Tool** | **Vite** | **Speed.** Near-instant server startup and Hot Module Replacement (HMR) during development, keeping the logic flowing without build-time friction. |
| **Language** | **TypeScript** | **Type Safety.** Adds strict static typing to JavaScript, catching errors during development rather than runtime. Essential for keeping complex state predictable. |
| **Backend/DB** | **Supabase (Docker)** | **Data & Auth.** Self-hosted PostgreSQL via Docker. Utilizes Row Level Security (RLS) and custom database triggers to maintain an immutable audit log (shadow tables). |
| **UI Library** | **Material UI (MUI)** | **Components & Styling.** Provides a vast, accessible library of pre-built components (Grids, Drawers) to quickly assemble a professional interface. |
| **Data Fetching** | **React Query** | **State Management.** Handles caching, loading states, and optimistic updates to make the dashboard feel instantaneous while communicating asynchronously. |
| **Styling/Design** | **WCAG 2.2 Dark Theme** | **Accessibility.** The custom dark theme is built specifically to meet **WCAG 2.2 AA** contrast and target size requirements. |

---

## ⚙️ Code Quality & Enforcement

This project implements a comprehensive two-stage enforcement system to guarantee all code is formatted consistently and meets project quality standards before it ever hits the main branch.

| Tool | Role | Enforcement Method |
| :-------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **ESLint** | **Code Quality** | Analyzes code for correctness, potential bugs, and bad practices (e.g., forgotten hook dependencies or type mismatches). |
| **Prettier** | **Code Formatting** | Handles all stylistic rules. **eslint-config-prettier** disables conflicting ESLint style rules, allowing Prettier to rule style exclusively. |
| **Husky** | **Git Hooks** | Sets up a Git hook that runs automatically before every commit to act as a final verification checkpoint. |
| **lint-staged** | **Pre-Commit Filter** | Ensures that ESLint and Prettier only run on files that have been staged (`git add .`), keeping commit times fast and focused. |

---

## 🖥️ The Pilot&#39;s Cockpit (VS Code Setup)

To ensure the Jinba Ittai alignment between the Pilot and the codebase, install the following extensions and utilize the provided workspace settings.

### 🔌 Recommended Extensions (`.vscode/extensions.json`)

```json
{
  "recommendations": [
    /* --- The Core Logic (Strictness & Quality) --- */
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "DavidAnson.vscode-markdownlint",

    /* --- The AI Co-Pilots (The "Hyper-Threaded" Helpers) --- */
    "github.copilot",
    "github.copilot-chat",
    "Google.gemini-cli-vscode-ide-companion",

    /* --- The SAFEHOOD Perimeter (A11y & Infrastructure) --- */
    "deque-systems.vscode-axe",
    "ms-azuretools.vscode-docker",
    "ms-python.pylint",

    /* --- Visual Fidelity (The "Architect's" Lens) --- */
    "vscode-icons-team.vscode-icons",
    "oderwat.indent-rainbow",
    "mechatroner.rainbow-csv",
    "christian-kohler.path-intellisense"
  ]
}
