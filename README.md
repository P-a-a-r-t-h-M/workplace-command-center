# AI Workplace Productivity Assistant

## Project Overview

**AI Workplace Productivity Assistant** is a modern, responsive web application designed to help professionals complete common workplace tasks using Artificial Intelligence.

The application provides AI-powered tools for generating professional emails, researching and summarising information, planning workplace tasks, and interacting with an AI workplace assistant. It features a clean SaaS-style interface that makes everyday workplace tasks faster, smarter, and more efficient.

This project is built as a **frontend-focused application** without a traditional backend or database, making it lightweight, responsive, and easy to use.

---

## Features Implemented

### Smart Email Generator

- Generate professional workplace emails using AI.
- Rephrase email subjects and messages into polished, professional communication.
- Improve grammar, spelling, clarity, and tone.
- Editable AI-generated email output.
- Copy, regenerate, and clear email functionality.

### AI Research Assistant

- Enter a research topic or question.
- Paste article or website content for analysis.
- Summarise long content using AI.
- Generate key insights and important points.
- Produce practical recommendations.
- Edit and copy AI-generated summaries.

### AI Task Planner

- Create daily and weekly workplace schedules.
- Organise and prioritise tasks.
- Categorise tasks by urgency and importance.
- Smart focus schedule with productivity recommendations.
- Replan and reorganise tasks when priorities change.

### AI Workplace Chatbot

- Interactive AI workplace assistant.
- Responds to workplace-related prompts.
- Helps draft emails, meeting agendas, summaries, and action items.
- Provides brainstorming and productivity assistance.
- Conversation-style interface with editable AI responses.

### Dashboard

- Modern SaaS-style dashboard interface.
- Responsive sidebar navigation.
- Productivity overview cards.
- Quick access to AI tools.
- Today's focus and upcoming deadlines.
- Recent activity section.
- AI Command Center for quick prompts.

### Responsible AI

- Includes a responsible AI disclaimer.
- Encourages users to review AI-generated content before professional use.
- Designed to support productivity rather than replace human judgement.

---

## Technologies and Tools Used

- **React** — Frontend application framework.
- **TypeScript** — Type-safe application development.
- **Vite** — Development server and build tool.
- **Tailwind CSS** — Responsive styling and modern UI design.
- **Lucide React** — Icons and interface components.
- **AI API** — AI-generated workplace responses and content generation.
- **Lovable AI** — Frontend application development and prototyping.
- **Git & GitHub** — Version control and project hosting.
- **Local Storage** — Client-side data persistence.

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-workplace-productivity-assistant.git
```

### 2. Navigate to the Project Folder

```bash
cd ai-workplace-productivity-assistant
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

If your application requires an AI API key, create a `.env` file in the project root.

```env
VITE_AI_API_KEY=your_api_key_here
```

> **Note:** Never commit API keys or sensitive credentials to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

The application will run locally at:

```text
http://localhost:5173
```

### 6. Build for Production

```bash
npm run build
```

The production-ready files will be generated inside the `dist` folder.

---

## Project Structure

```text
ai-workplace-productivity-assistant/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## Usage

After running the application, users can:

1. Open the **Command Center Dashboard**.
2. Use **Smart Email Generator** to create or rephrase professional emails.
3. Use **AI Research Assistant** to analyse and summarise research content.
4. Use **AI Task Planner** to organise daily and weekly tasks.
5. Chat with the **AI Workplace Assistant** for workplace support, brainstorming, summaries, and productivity guidance.
6. Edit, regenerate, copy, and review AI-generated outputs before using them professionally.

---

## Responsible AI Notice

AI-generated content may contain mistakes, incomplete information, or inappropriate recommendations. Users should always review and verify AI-generated emails, summaries, schedules, and workplace recommendations before using them for important professional, business, legal, or financial decisions.

---

## Author

**Paarth Maisuria**

Portfolio Project — AI Workplace Productivity Assistant

Live Application: `https://smart-work-flow-90.lovable.app/`

---

## License

This project is intended for **educational, demonstration, and portfolio purposes**. It showcases the use of AI-powered productivity tools within a modern frontend web application built with React, TypeScript, Tailwind CSS, and Lovable AI.
