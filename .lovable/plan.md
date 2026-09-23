# Bright Pastel Dayflow Redesign

## Goal
Refresh the existing Dayflow workplace assistant without rebuilding it: preserve its sidebar, spacious workspace, rounded cards, and Email Studio/Planner/Assistant views while making the visual system brighter and the assistant genuinely prompt-specific.

## What will change
- Replace the dark navigation and turquoise-heavy styling with a light lavender-white shell and strategic purple, pink, cyan, mint, green, lime, and yellow accents.
- Keep the current navigation and page structure, then expand the dashboard into a stable three-column workspace with the requested focus, AI Command Center, planner, deadlines, activity, schedule, metrics, and distinct quick-action cards.
- Add the Paarth greeting, search, date, notifications, profile, and a subtle generated pastel landscape inside the dashboard welcome area.
- Upgrade the AI Assistant with real streamed Lovable AI responses, reasoning/loading feedback, suggestions, and response actions: copy, regenerate, shorten, professional rewrite, email conversion, task conversion, and action-item extraction.
- Expand Email Studio inputs and editing actions while preserving its split-screen layout; keep generated email text grounded in entered details.
- Expand planner controls and priority levels while preserving the current planner layout and browser-saved tasks.
- Keep the responsible-AI notice visible and retain all existing local browser persistence.

## Technical details
- Continue using the installed AI Elements primitives for chat messages, conversation scrolling, markdown, composer, and loading states.
- Add one stateless streaming `/api/chat` route for secure Lovable AI access; it will store nothing and expose no secret. All user data, conversations, tasks, and settings remain in localStorage, with no database or authentication.
- Send the complete current conversation on each AI request and internally frame each request as Intent, Context, Objective, Constraints, Tone, and Desired Output.
- Fix the existing time-based hydration mismatch by calculating the greeting after browser hydration.
- Extend semantic color tokens and component styles rather than hardcoding colors in page markup.
- Verify the finished app at desktop and mobile sizes, including dashboard spacing, chat streaming, email editing, planner controls, and current build/runtime logs.
