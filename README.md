# Workplace Command Center

Build a modern, responsive SaaS-style web application called AI Workplace Productivity Assistant.

Create a polished frontend-only application with no backend, database, authentication, server functions, or unnecessary integrations. Use local browser state/localStorage only for saving user preferences and generated items.

Core experience

The app should feel like an intelligent workplace command center rather than a basic form generator.

1. Dashboard
Create a visually impressive dashboard with:

Sidebar navigation: Dashboard, Email Studio, Task Planner, AI Assistant, Settings

Top bar with greeting, current date, notification icon, and compact profile area

Productivity overview cards such as Tasks Planned, Emails Created, Focus Time, and AI Sessions

“Quick Actions” for Generate Email, Plan My Day, and Ask AI

Recent activity panel

Clean responsive layout that works beautifully on desktop, tablet, and mobile

2. Smart Email Generator
Create an Email Studio where users provide:

Recipient/context

Purpose

Key points

Desired action

Optional deadline

Tone selector: Formal, Friendly, Persuasive

Generate a professional, context-aware email based on the actual information entered.

Include:

Structured AI prompt area showing what the assistant is using

Editable generated email

Regenerate button

Improve button

Make shorter / more concise

Make more persuasive

Copy button

Clear subject line and email body

Character/word count

The generated writing must feel specific to the user's inputs, not like generic placeholder text.

3. AI Task Planner
Create a daily/weekly planning workspace.

Users can enter:

Tasks

Deadlines

Estimated duration

Importance

Urgency

Meetings or fixed commitments

Let the assistant organize tasks into a practical schedule and prioritize them using factors such as urgency, importance, deadline, and effort.

Display:

Daily and Weekly toggle

Timeline-style schedule

Priority labels

Focus blocks

Break suggestions

Overdue/high-priority indicators

“Replan My Day” action

Make the generated schedule realistic and explain briefly why important tasks were prioritized.

4. AI Workplace Assistant
Create an interactive chatbot interface for workplace-related prompts.

Examples of useful capabilities:

Draft a difficult professional message

Summarize meeting notes

Turn notes into action items

Prepare a meeting agenda

Brainstorm ideas

Rewrite text professionally

Create follow-up messages

Help prioritize competing requests

Include suggested prompt chips above the chat and allow free-form user messages.

The assistant should maintain the current conversation visually and provide useful, context-specific responses rather than repetitive generic answers.

AI behavior

Use structured prompts internally so outputs are based on:
Context → Objective → Constraints → Tone → Desired output format.

AI responses should be varied, professional, concise when appropriate, and directly reflect the information entered by the user.

Use a frontend-compatible AI approach supported by Lovable where possible. Do not add a traditional backend. Keep the AI integration isolated so it can easily be connected/configured later. Do not hard-code secret API keys into the application.

Design

Use a distinctive modern visual identity inspired by premium productivity SaaS products.

Primary visual palette:

Turquoise #40E0D0

Lime/light green #ADFF2F

Mint/green #00FA9A

Deep charcoal/navy for contrast

Soft white/light neutral backgrounds

Use bright accent gradients sparingly for a sophisticated look.

Design characteristics:

Glassmorphism-inspired cards

Soft shadows

Rounded corners

Subtle gradients

Clean typography

Smooth hover/focus transitions

Minimal but impressive animations

Strong visual hierarchy

Plenty of whitespace

Accessible contrast

Professional icons

Make the sidebar collapsible on smaller screens and convert navigation into a mobile-friendly layout.

Editable outputs

All generated content must be editable before the user copies or uses it. Use polished editor-style panels rather than plain text boxes.

Add toast confirmations for actions such as copied, regenerated, saved, and updated.

Responsible AI

Add a small, clearly visible disclaimer in the interface:

“AI-generated content may contain mistakes or omissions. Review important workplace communications, schedules, and decisions before using them.”

Important implementation constraints

Keep the project lightweight and frontend-only. Avoid adding features that require a backend.

Use reusable components and consistent styling across all screens.

Prioritize visual polish, usability, responsive behavior, contextual AI output, and a memorable SaaS experience over excessive features.

The final product should look like a real premium workplace productivity product that a professional could immediately understand and use.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6e9d4d57-48d5-4dd2-8055-b392833694d8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
