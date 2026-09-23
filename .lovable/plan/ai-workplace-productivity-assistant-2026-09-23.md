# AI Workplace Productivity Assistant

## Goal
Build a polished, frontend-only productivity command center at `/` with local browser persistence and contextual simulated AI outputs.

## Experience
- Create a responsive app shell with desktop sidebar, compact mobile navigation, greeting, date, notifications, and profile.
- Add Dashboard, Email Studio, Task Planner, AI Assistant, and Settings views in one fast workspace.
- Build dashboard metrics, quick actions, and recent activity that update from user actions.
- Build an Email Studio with structured inputs, tone controls, contextual editable subject/body output, transformations, counts, copying, and regeneration.
- Build a planner with task and commitment entry, daily/weekly schedules, priorities, focus blocks, break suggestions, rationale, and replanning.
- Build a workplace chat with suggested prompts, editable conversation, contextual local responses, and conversation history.
- Add local preferences, persistence, toasts, empty/loading states, and the responsible-AI notice.

## Visual Direction
Use the specified turquoise, lime, mint, charcoal, and soft-neutral palette with restrained gradients, translucent surfaces, soft shadows, rounded geometry, clean typography, and subtle motion. Maintain accessible contrast and excellent desktop, tablet, and mobile layouts.

## Technical Details
- Keep all behavior in React browser state and localStorage; no backend, authentication, database, or secret keys.
- Isolate contextual generation functions so a real AI service can replace them later.
- Compose the chat from AI Elements conversation, message, prompt-input, and shimmer primitives.
- Use semantic design tokens in the global Tailwind v4 stylesheet and existing UI components.
- Add route-specific metadata and verify the final experience in the browser at desktop and mobile sizes.
