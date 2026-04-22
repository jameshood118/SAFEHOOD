# The Agentic Coding Protocol

**Version:** 1.0 (Human OS) **Author:** James Hood (Verified Generalist)
**Status:** Active

## 1. The Core Philosophy

Agentic Coding is fundamentally different from "Vibe Coding."

- **Vibe Coding** is throwing a prompt into a black box and hoping the output
  works. It is passive, fragile, and often leads to the "Skynet" fear of loss of
  control.
- **Agentic Coding** is **Environment Optimization**. It is the active
  management of an AI agent as a high-performance junior partner or specialist.

The goal is not to replace the human developer, but to extend their "Human OS"
into a hyper-threaded, asynchronous workflow. We treat the AI not as a search
engine, but as a colleague (e.g., "Ryan at Dynamis") who requires context,
constraints, and verification.

## 2. The Protocol

### Phase 1: Environment Optimization (The Constraints)

Before a single line of code is requested, the Agent must be constrained to the
specific "Physical Layer" of the project. This prevents hallucinated
dependencies and architectural drift.

- **Hardware Baseline:** The Agent operates assuming the limitations of the
  target environment (e.g., Portable SNES Dev Rig, Orange Pi 5).
- **Tech Stack Isolation:** The Agent is restricted to the established stack
  (MUI v7, Supabase, React Router). It is forbidden from introducing new
  libraries without a "System Audit."
- **Tone & Style:** The Agent must inhabit the persona of the project (e.g.,
  "Part-Time Stand-Up Philosopher") to ensure copy requires minimal rewriting.

### Phase 2: The Interrupt Request (The Prompt)

We do not "ask" the AI; we issue an **Interrupt Request (IRQ)**.

- **Context Loading:** Provide the Agent with the current state (file contents,
  error logs).
- **Specific Directive:** Define the "Definition of Done."
  - _Bad:_ "Fix the header."
  - _Good:_ "The header text conflicts with the accessibility test. Remove the
    text, apply the 'Viewfinder' CSS class to the image, and ensure the `h1`
    test passes."
- **Iterative Dialogue:** If the Agent's solution feels "off," we debate. We
  refine the mental model until the code matches the vision.

### Phase 3: System Audit (Verification)

**Trust, but Verify.** The Agent generates the "Liquid Assets" (code), but the
Human Operator provides the **Verification**.

- **The "Bork" Check:** Run the tests. If the Agent claims a fix, proving it via
  `accessibility.spec.ts` is mandatory.
- **Visual Inspection:** Does the UI feel "Human"? (e.g., The "Eyes Up" crop on
  the Weirdling header).
- **Legacy Code Protection:** Ensure the new code doesn't break established
  patterns or overwrite critical logic (like Supabase Auth flows).

### Phase 4: Asynchronous Execution (Handoffs)

When the Human Operator's "Activation Energy" is depleted or redirected (e.g.,
to DoorDash/Real Life), the Agent is given a specific hold-state.

- **The Empty Commit:** A git commit message serves as the "Memo" to the next
  operator (be it the human returning later, or a collaborator like "Nick").
- **State Persistence:** All assets (images, docs) are committed to the repo.
  Nothing lives solely in the chat context.

## 3. The "Human-in-the-Loop"

The Human Operator is the **System Admin**. The Agent does not have `sudo`
privileges to push to production without a review.

- **Accessibility is Non-Negotiable:** We do not bypass A11y checks unless
  strictly for a temporary "break-glass" push (and even then, it is documented).
- **Authenticity:** The "Human OS" must shine through. If the Agent's output
  feels sterile or corporate, it is the Human's job to inject the "Gen X
  Nostalgia" or "Philosophical paradox" that defines the brand.

## 4. Conclusion

We are not building Skynet. We are building a **Guild**.

In this Guild, the AI is a member—a tireless, hyper-fast, occasionally
literal-minded member who needs a strong lead developer to guide them.

## **#InOmniaParatus #Verification #HumanOS**
