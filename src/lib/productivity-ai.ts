export type EmailInput = {
  recipient: string;
  context: string;
  situation: string;
  objective: string;
  purpose: string;
  keyPoints: string;
  action: string;
  deadline: string;
  tone: "Formal" | "Friendly" | "Persuasive";
};

export type EmailDraft = { subject: string; body: string };

const points = (value: string) =>
  value
    .split(/\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);

export function generateEmail(input: EmailInput, variant = 0): EmailDraft {
  const recipient = input.recipient.trim() || "there";
  const purpose = input.purpose.trim() || "our next steps";
  const keyPoints = points(input.keyPoints);
  const action = input.action.trim() || "share your thoughts";
  const deadline = input.deadline
    ? ` by ${new Date(`${input.deadline}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric" })}`
    : "";
  const openings = {
    Formal: ["I hope this message finds you well.", "I’m writing to follow up with you."],
    Friendly: ["I hope your week is going well.", "Great to connect with you."],
    Persuasive: ["I’m reaching out with a timely opportunity.", "I believe this is a strong next step for us."],
  };
  const close = {
    Formal: "Thank you for your consideration. I look forward to your response.",
    Friendly: "Thanks so much — I’m looking forward to hearing what you think.",
    Persuasive: "Moving forward now will help us maintain momentum and achieve the strongest outcome.",
  };
  const pointSection = keyPoints.length
    ? `\n\nThe key points are:\n${keyPoints.map((point) => `• ${point}`).join("\n")}`
    : "";
  const name = recipient.includes(" ") ? recipient.split(" ")[0] : recipient;
  return {
    subject: `${variant % 2 ? "Next steps" : "Regarding"}: ${purpose}`,
    body: `Hi ${name},\n\n${openings[input.tone][variant % 2]} I’d like to discuss ${purpose}.${pointSection}\n\nCould you please ${action}${deadline}? ${close[input.tone]}\n\nBest,\nAlex`,
  };
}

export function transformEmail(draft: EmailDraft, mode: "improve" | "shorter" | "persuasive" | "expand" | "professional"): EmailDraft {
  if (mode === "shorter") {
    const paragraphs = draft.body.split("\n\n");
    return { ...draft, body: paragraphs.filter((_, index) => index !== 1 || paragraphs.length < 5).slice(0, 5).join("\n\n") };
  }
  if (mode === "persuasive") {
    return {
      subject: `Action requested: ${draft.subject.replace(/^Regarding: |^Next steps: /, "")}`,
      body: draft.body.replace("Could you please", "To keep momentum, could you please").replace("Best,", "I’m confident this will move us forward.\n\nBest,"),
    };
  }
  if (mode === "expand") {
    return { ...draft, body: draft.body.replace("Could you please", `To make the next step clear and keep everyone aligned, could you please`) };
  }
  if (mode === "professional") {
    return { subject: draft.subject.replace(/^Regarding:/, "Next steps:"), body: draft.body.replace("Hi ", "Hello ").replace("Thanks so much", "Thank you") };
  }
  return {
    subject: draft.subject.replace("Regarding:", "Next steps for"),
    body: draft.body.replace(/I’d like to discuss/g, "I’d like to align on").replace(/The key points are:/g, "For clarity, here are the key points:"),
  };
}

export type PlannerTask = {
  id: string;
  title: string;
  deadline: string;
  duration: number;
  importance: "Low" | "Medium" | "High";
  urgency: "Low" | "Medium" | "High";
};

export type ScheduleItem = PlannerTask & { start: string; end: string; priority: "Critical" | "High" | "Medium" | "Low" };

export function planTasks(tasks: PlannerTask[]): ScheduleItem[] {
  const rank = { Low: 1, Medium: 2, High: 3 };
  const sorted = [...tasks].sort((a, b) => {
    const aScore = rank[a.importance] * 2 + rank[a.urgency] + (a.deadline ? 2 : 0) - a.duration / 240;
    const bScore = rank[b.importance] * 2 + rank[b.urgency] + (b.deadline ? 2 : 0) - b.duration / 240;
    return bScore - aScore;
  });
  let minute = 9 * 60;
  return sorted.map((task, index) => {
    if (index > 0 && minute % 120 < 30) minute += 15;
    const startMinute = minute;
    minute += task.duration;
    const format = (value: number) => {
      const hour = Math.floor(value / 60);
      return `${hour > 12 ? hour - 12 : hour}:${String(value % 60).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
    };
    return {
      ...task,
      start: format(startMinute),
      end: format(minute),
      priority: task.importance === "High" && task.urgency === "High" ? "Critical" : task.importance === "High" || task.urgency === "High" ? "High" : task.importance === "Medium" || task.urgency === "Medium" ? "Medium" : "Low",
    };
  });
}

export function answerWorkplacePrompt(prompt: string): string {
  const text = prompt.trim();
  const lower = text.toLowerCase();
  const quoted = text.includes(":") ? text.split(":").slice(1).join(":").trim() : "";
  if (lower.includes("agenda")) return `## Focused meeting agenda\n\n**Objective:** Align the team on ${quoted || "the key decision and next steps"}.\n\n1. **Context and desired outcome** — 5 min\n2. **Key updates and constraints** — 10 min\n3. **Decision or discussion** — 15 min\n4. **Owners, actions, and dates** — 10 min\n\n**Close with:** What was decided, who owns each action, and when the team will check progress.`;
  if (lower.includes("action item") || lower.includes("meeting notes") || lower.includes("summar")) return `## Clear summary\n\n**Main point:** ${quoted || "The discussion needs a concise record of decisions and follow-through."}\n\n**Action items**\n- Confirm the final decision and accountable owner.\n- Share the agreed deliverable with stakeholders.\n- Schedule a progress check before the next deadline.\n\n**Open question:** Which dependency could delay completion?`;
  if (lower.includes("priorit")) return `## Recommended order\n\n1. **Do first:** Work with the nearest deadline or highest downstream impact.\n2. **Protect focus time:** Complete the most demanding task in one uninterrupted block.\n3. **Delegate or clarify:** Requests without a clear owner or outcome.\n4. **Defer:** Low-impact work that does not unblock anyone.\n\nUse this test: *What creates the largest cost if it slips today?*`;
  if (lower.includes("message") || lower.includes("rewrite") || lower.includes("follow-up")) return `**Subject: Following up on next steps**\n\nHi there,\n\nI wanted to follow up regarding ${quoted || "our recent discussion"}. To keep things moving, could you confirm the next step and expected timing?\n\nIf there’s a blocker or additional context I should consider, please let me know.\n\nBest,\nAlex`;
  if (lower.includes("brainstorm") || lower.includes("idea")) return `Here are five practical directions for **${quoted || "your workplace challenge"}**:\n\n- Simplify the handoff with one accountable owner.\n- Replace status meetings with a concise written update.\n- Pilot the idea with one team before scaling.\n- Define a measurable success signal upfront.\n- Remove one recurring step that adds no decision value.\n\nStart with the option that is both reversible and testable this week.`;
  return `Here’s a practical way to move forward with **${text}**:\n\n1. Define the outcome in one sentence.\n2. Identify the decision-maker and the people affected.\n3. Separate must-have constraints from preferences.\n4. Choose the smallest useful next action and assign a date.\n\nIf you share the audience, deadline, and desired outcome, I can turn this into a polished message, agenda, or action plan.`;
}