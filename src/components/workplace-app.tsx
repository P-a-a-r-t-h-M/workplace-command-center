"use client";

import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { generateEmail, planTasks, transformEmail, type EmailDraft, type EmailInput, type PlannerTask, type ScheduleItem } from "@/lib/productivity-ai";
import { cn } from "@/lib/utils";
import heroLandscape from "@/assets/dayflow-pastel-landscape.jpg";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Bell, Bot, CalendarDays, Check, ChevronRight, CircleUserRound, ClipboardCheck, Clock3, Copy, FilePenLine, Gauge, Inbox, LayoutDashboard, ListChecks, Mail, Menu, MessageSquareText, PanelLeftClose, PanelLeftOpen, Pencil, Plus, RefreshCw, RotateCcw, Save, Search, Send, Settings, Sparkle, Target, Timer, Trash2, Wand2, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type View = "dashboard" | "email" | "planner" | "assistant" | "settings";
type Activity = { id: string; title: string; detail: string; time: string; icon: "email" | "task" | "chat" };

const navItems = [
  { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
  { id: "email" as const, label: "Email Studio", icon: FilePenLine },
  { id: "planner" as const, label: "Task Planner", icon: ClipboardCheck },
  { id: "assistant" as const, label: "AI Assistant", icon: MessageSquareText },
  { id: "settings" as const, label: "Settings", icon: Settings },
];

const defaultTasks: PlannerTask[] = [
  { id: "1", title: "Finalize Q4 strategy deck", deadline: "2026-09-23", duration: 90, importance: "High", urgency: "High" },
  { id: "2", title: "Review campaign performance", deadline: "2026-09-24", duration: 45, importance: "High", urgency: "Medium" },
  { id: "3", title: "Respond to partner feedback", deadline: "2026-09-25", duration: 30, importance: "Medium", urgency: "Medium" },
];

const initialMessages: UIMessage[] = [{ id: "welcome", role: "assistant", parts: [{ type: "text", text: "Hi Paarth — I’m ready to help you write, plan, summarize, or make a clear workplace decision. What are you working through?" }] }];

const starterActivity: Activity[] = [
  { id: "a1", title: "Daily plan organized", detail: "3 focus blocks created", time: "9:04 AM", icon: "task" },
  { id: "a2", title: "Project update drafted", detail: "Friendly tone · 142 words", time: "Yesterday", icon: "email" },
  { id: "a3", title: "Meeting notes summarized", detail: "5 action items identified", time: "Monday", icon: "chat" },
];

function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setValue(JSON.parse(stored) as T);
    } catch { /* use defaults */ }
    setReady(true);
  }, [key]);
  useEffect(() => {
    if (ready) window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, ready, value]);
  return [value, setValue] as const;
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-3"><div className="brand-mark" aria-hidden="true"><span /><span /><span /></div>{!compact && <div><div className="font-display text-lg font-bold text-sidebar-foreground">Dayflow</div><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-sidebar-muted">AI productivity</div></div>}</div>;
}

export function WorkplaceApp() {
  const [view, setView] = useState<View>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activities, setActivities] = useStoredState<Activity[]>("dayflow-activity", starterActivity);
  const [emailCount, setEmailCount] = useStoredState("dayflow-email-count", 8);
  const [sessionCount, setSessionCount] = useStoredState("dayflow-session-count", 12);
  const date = useMemo(() => new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date()), []);
  const go = (next: View) => { setView(next); setMobileOpen(false); };
  const addActivity = (activity: Omit<Activity, "id" | "time">) => setActivities((current) => [{ ...activity, id: crypto.randomUUID(), time: "Just now" }, ...current].slice(0, 8));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster position="top-right" richColors />
      {mobileOpen && <button aria-label="Close navigation" className="fixed inset-0 z-40 bg-overlay lg:hidden" onClick={() => setMobileOpen(false)} />}
      <aside className={cn("sidebar fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300", collapsed ? "w-[88px]" : "w-[252px]", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="flex h-24 items-center justify-between px-6">
          <BrandMark compact={collapsed} />
          <Button variant="ghost" size="icon-sm" className="hidden text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground lg:inline-flex" onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}</Button>
          <Button variant="ghost" size="icon-sm" className="text-sidebar-muted lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X /></Button>
        </div>
        <nav className="space-y-1.5 px-3" aria-label="Main navigation">
          {navItems.map((item) => <Button key={item.id} variant="ghost" onClick={() => go(item.id)} className={cn("h-11 w-full justify-start rounded-lg px-3 text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground", view === item.id && "bg-sidebar-accent text-sidebar-foreground shadow-sm", collapsed && "justify-center px-0")} title={collapsed ? item.label : undefined}><item.icon />{!collapsed && <span>{item.label}</span>}{!collapsed && view === item.id && <span className="ml-auto size-1.5 rounded-full bg-sidebar-active" />}</Button>)}
        </nav>
        <div className="mt-auto p-4">
          {!collapsed && <div className="rounded-lg border border-sidebar-border bg-sidebar-panel p-4"><div className="mb-2 flex items-center gap-2 text-xs font-semibold text-sidebar-foreground"><Sparkle className="text-sidebar-active" /> Daily momentum</div><div className="h-1.5 overflow-hidden rounded-full bg-sidebar-accent"><div className="h-full w-[72%] rounded-full bg-sidebar-active" /></div><p className="mt-2 text-xs leading-5 text-sidebar-muted">You’ve completed 72% of today’s focus plan.</p></div>}
          <div className={cn("mt-4 flex items-center gap-3 border-t border-sidebar-border pt-4", collapsed && "justify-center")}><div className="flex size-9 items-center justify-center rounded-full bg-avatar text-sm font-bold text-avatar-foreground">AM</div>{!collapsed && <div className="min-w-0"><p className="truncate text-sm font-semibold text-sidebar-foreground">Alex Morgan</p><p className="truncate text-xs text-sidebar-muted">Product Lead</p></div>}</div>
        </div>
      </aside>
      <div className={cn("transition-[padding] duration-300", collapsed ? "lg:pl-[88px]" : "lg:pl-[252px]")}>
        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-7 lg:px-10">
          <Button variant="ghost" size="icon" className="mr-3 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></Button>
          <div className="min-w-0"><h1 className="truncate font-display text-xl font-bold sm:text-2xl">{navItems.find((item) => item.id === view)?.label}</h1><p className="hidden text-xs text-muted-foreground sm:block">{date}</p></div>
          <div className="ml-auto flex items-center gap-2 sm:gap-3"><div className="header-search hidden lg:flex"><Search /><input aria-label="Search workspace" placeholder="Search your workspace" /></div><div className="hidden items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground md:flex"><CalendarDays className="size-4 text-primary" />{date}</div><Button variant="ghost" size="icon" className="relative" aria-label="Notifications"><Bell /><span className="absolute right-2 top-2 size-2 rounded-full border-2 border-background bg-notification" /></Button><div className="hidden h-8 w-px bg-border sm:block" /><div className="hidden items-center gap-2 sm:flex"><CircleUserRound className="text-primary" /><span className="text-sm font-semibold">Paarth</span></div></div>
        </header>
        <main className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-10">
          {view === "dashboard" && <Dashboard onGo={go} activities={activities} emailCount={emailCount} sessionCount={sessionCount} />}
          {view === "email" && <EmailStudio onGenerated={() => { setEmailCount((count) => count + 1); addActivity({ title: "Professional email created", detail: "Draft saved to Email Studio", icon: "email" }); }} />}
          {view === "planner" && <TaskPlanner onPlanned={(count) => addActivity({ title: "Schedule replanned", detail: `${count} tasks prioritized`, icon: "task" })} />}
          {view === "assistant" && <WorkplaceAssistant onMessage={() => { setSessionCount((count) => count + 1); addActivity({ title: "AI Assistant session", detail: "Workplace request completed", icon: "chat" }); }} />}
          {view === "settings" && <SettingsView />}
          <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-5 text-muted-foreground">AI-generated content may contain mistakes or omissions. Review important workplace communications, schedules, and decisions before using them.</p>
        </main>
      </div>
    </div>
  );
}

function Dashboard({ onGo, activities, emailCount, sessionCount }: { onGo: (v: View) => void; activities: Activity[]; emailCount: number; sessionCount: number }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const metrics = [
    { label: "Tasks planned", value: "14", change: "+3 this week", icon: ClipboardCheck, tone: "turquoise" },
    { label: "Emails created", value: String(emailCount), change: "+2 this week", icon: Send, tone: "lime" },
    { label: "Focus time", value: "6.5h", change: "82% of goal", icon: Timer, tone: "mint" },
    { label: "AI sessions", value: String(sessionCount), change: "+18% vs last week", icon: Bot, tone: "charcoal" },
  ];
  const actions = [
    { title: "Generate Email", body: "Create a clear, polished message in seconds.", icon: FilePenLine, view: "email" as const, tone: "turquoise" },
    { title: "Plan My Day", body: "Turn priorities into a realistic schedule.", icon: CalendarDays, view: "planner" as const, tone: "lime" },
    { title: "Ask AI", body: "Think through any workplace challenge.", icon: MessageSquareText, view: "assistant" as const, tone: "mint" },
  ];
  return <div className="animate-enter space-y-8">
    <section className="welcome-panel overflow-hidden rounded-lg p-6 sm:p-8"><div className="relative z-10 max-w-2xl"><Badge className="mb-5 border-0 bg-badge-soft text-badge-soft-foreground">Wednesday · 3 priorities left</Badge><h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">{greeting}, Alex.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-hero-muted sm:text-base">Your day is in good shape. Protect your morning focus block, then use the afternoon to close two open loops.</p><Button className="mt-6 h-11 rounded-lg bg-action text-action-foreground shadow-none hover:bg-action/90" onClick={() => onGo("planner")}>Review today’s plan <ChevronRight /></Button></div><div className="focus-orbit" aria-hidden="true"><div /><div /><span>72%</span></div></section>
    <section><div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">Today at a glance</p><h2 className="section-title">Productivity overview</h2></div><p className="hidden text-sm text-muted-foreground sm:block">Updated moments ago</p></div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <div className="glass-card metric-card" key={metric.label}><div className={cn("metric-icon", `metric-${metric.tone}`)}><metric.icon /></div><div className="mt-6 flex items-end justify-between gap-3"><div><p className="text-sm text-muted-foreground">{metric.label}</p><p className="mt-1 font-display text-3xl font-bold">{metric.value}</p></div><span className="mb-1 text-xs font-semibold text-positive">{metric.change}</span></div></div>)}</div></section>
    <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
      <section><div className="mb-4"><p className="eyebrow">Start something</p><h2 className="section-title">Quick actions</h2></div><div className="grid gap-4 md:grid-cols-3">{actions.map((action) => <button key={action.title} onClick={() => onGo(action.view)} className="action-card group text-left"><div className={cn("action-icon", `metric-${action.tone}`)}><action.icon /></div><h3 className="mt-5 font-display text-lg font-bold">{action.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{action.body}</p><span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-primary">Open tool <ChevronRight className="size-3 transition-transform group-hover:translate-x-1" /></span></button>)}</div></section>
      <section><div className="mb-4 flex items-end justify-between"><div><p className="eyebrow">Your work</p><h2 className="section-title">Recent activity</h2></div><Button variant="ghost" size="sm">View all</Button></div><div className="glass-card divide-y divide-border/70 p-2">{activities.slice(0, 4).map((activity) => { const Icon = activity.icon === "email" ? Inbox : activity.icon === "task" ? Check : Bot; return <div key={activity.id} className="flex items-center gap-3 p-3"><div className="activity-icon"><Icon /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{activity.title}</p><p className="truncate text-xs text-muted-foreground">{activity.detail}</p></div><span className="text-[11px] text-muted-foreground">{activity.time}</span></div>; })}</div></section>
    </div>
  </div>;
}

function EmailStudio({ onGenerated }: { onGenerated: () => void }) {
  const [input, setInput] = useStoredState<EmailInput>("dayflow-email-input", { recipient: "Jordan Lee, Head of Operations", purpose: "Confirm the timeline for the Q4 launch", keyPoints: "Design handoff is complete\nLegal review is still pending\nThe team needs three business days for QA", action: "confirm whether Friday, October 2 remains achievable", deadline: "2026-09-25", tone: "Friendly" });
  const [draft, setDraft] = useStoredState<EmailDraft>("dayflow-email-draft", generateEmail(input));
  const [variant, setVariant] = useState(0);
  const update = (field: keyof EmailInput, value: string) => setInput((current) => ({ ...current, [field]: value }));
  const generate = () => { const next = variant + 1; setVariant(next); setDraft(generateEmail(input, next)); onGenerated(); toast.success("Email generated from your brief"); };
  const apply = (mode: "improve" | "shorter" | "persuasive") => { setDraft((current) => transformEmail(current, mode)); toast.success(mode === "shorter" ? "Email made more concise" : mode === "persuasive" ? "Persuasive framing added" : "Draft improved"); };
  const words = draft.body.trim() ? draft.body.trim().split(/\s+/).length : 0;
  return <div className="animate-enter"><PageIntro eyebrow="Write with confidence" title="Smart Email Studio" description="Give the assistant the facts. Get a specific, polished draft you can shape before sending." />
    <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
      <div className="space-y-5"><section className="glass-card p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><h2 className="panel-title">Email brief</h2><Badge variant="outline" className="font-medium text-muted-foreground">5 fields</Badge></div><div className="space-y-4"><Field label="Recipient or context"><Input value={input.recipient} onChange={(e) => update("recipient", e.target.value)} placeholder="Who is this for?" /></Field><Field label="Purpose"><Input value={input.purpose} onChange={(e) => update("purpose", e.target.value)} placeholder="What should this email accomplish?" /></Field><Field label="Key points"><Textarea className="min-h-28" value={input.keyPoints} onChange={(e) => update("keyPoints", e.target.value)} placeholder="One point per line" /></Field><Field label="Desired action"><Input value={input.action} onChange={(e) => update("action", e.target.value)} placeholder="What should they do next?" /></Field><div className="grid gap-4 sm:grid-cols-2"><Field label="Deadline (optional)"><Input type="date" value={input.deadline} onChange={(e) => update("deadline", e.target.value)} /></Field><Field label="Tone"><Select value={input.tone} onValueChange={(value) => update("tone", value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Formal">Formal</SelectItem><SelectItem value="Friendly">Friendly</SelectItem><SelectItem value="Persuasive">Persuasive</SelectItem></SelectContent></Select></Field></div><Button className="h-11 w-full rounded-lg" onClick={generate}><Wand2 /> Generate email</Button></div></section>
        <section className="prompt-structure"><div className="mb-3 flex items-center gap-2 text-sm font-bold"><Target className="size-4 text-primary" />Assistant context</div>{[["Context", input.recipient], ["Objective", input.purpose], ["Constraints", input.keyPoints], ["Tone", input.tone], ["Output", "Professional subject and editable email body"]].map(([label, value]) => <div key={label} className="flex gap-3 border-t border-border/70 py-2.5 text-xs"><span className="w-20 shrink-0 font-bold text-muted-foreground">{label}</span><span className="line-clamp-2">{value || "Not provided"}</span></div>)}</section>
      </div>
      <section className="editor-shell"><div className="editor-toolbar"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Editable draft</p><p className="mt-1 text-xs text-muted-foreground">{words} words · {draft.body.length} characters</p></div><div className="flex flex-wrap justify-end gap-1"><Button variant="ghost" size="sm" onClick={() => apply("improve")}><Sparkle /> Improve</Button><Button variant="ghost" size="sm" onClick={() => apply("shorter")}><FilePenLine /> Shorter</Button><Button variant="ghost" size="sm" onClick={() => apply("persuasive")}><Target /> Persuasive</Button></div></div><div className="p-5 sm:p-7"><Label htmlFor="subject" className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Subject</Label><Input id="subject" className="mt-2 h-auto border-0 bg-transparent px-0 py-2 font-display text-xl font-bold shadow-none focus-visible:ring-0" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} /><div className="my-4 h-px bg-border" /><Textarea aria-label="Email body" className="min-h-[430px] resize-none border-0 bg-transparent p-0 text-[15px] leading-7 shadow-none focus-visible:ring-0" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} /></div><div className="editor-footer"><Button variant="outline" onClick={generate}><RefreshCw /> Regenerate</Button><Button onClick={() => { navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`); toast.success("Email copied to clipboard"); }}><Copy /> Copy email</Button></div></section>
    </div>
  </div>;
}

function TaskPlanner({ onPlanned }: { onPlanned: (count: number) => void }) {
  const [tasks, setTasks] = useStoredState<PlannerTask[]>("dayflow-tasks", defaultTasks);
  const [schedule, setSchedule] = useStoredState<ScheduleItem[]>("dayflow-schedule", planTasks(tasks));
  const [mode, setMode] = useState<"daily" | "weekly">("daily");
  const [newTask, setNewTask] = useState<Omit<PlannerTask, "id">>({ title: "", deadline: "", duration: 45, importance: "Medium", urgency: "Medium" });
  const addTask = () => { if (!newTask.title.trim()) return toast.error("Add a task name first"); const task = { ...newTask, id: crypto.randomUUID() }; setTasks([...tasks, task]); setNewTask({ ...newTask, title: "" }); toast.success("Task added"); };
  const replan = () => { setSchedule(planTasks(tasks)); onPlanned(tasks.length); toast.success("Your day has been replanned"); };
  const total = schedule.reduce((sum, task) => sum + task.duration, 0);
  return <div className="animate-enter"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><PageIntro eyebrow="Protect your attention" title="AI Task Planner" description="Balance urgency, impact, and effort into a schedule you can actually finish." /><div className="segmented"><button className={mode === "daily" ? "active" : ""} onClick={() => setMode("daily")}>Daily</button><button className={mode === "weekly" ? "active" : ""} onClick={() => setMode("weekly")}>Weekly</button></div></div>
    <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]"><div className="space-y-5"><section className="glass-card p-5 sm:p-6"><div className="mb-5 flex items-center justify-between"><h2 className="panel-title">Add priorities</h2><span className="text-xs text-muted-foreground">{tasks.length} tasks</span></div><div className="space-y-4"><Field label="Task"><Input value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Prepare client proposal" /></Field><div className="grid grid-cols-2 gap-3"><Field label="Deadline"><Input type="date" value={newTask.deadline} onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} /></Field><Field label="Duration"><Select value={String(newTask.duration)} onValueChange={(value) => setNewTask({ ...newTask, duration: Number(value) })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{[30,45,60,90,120].map((duration) => <SelectItem key={duration} value={String(duration)}>{duration} min</SelectItem>)}</SelectContent></Select></Field></div><div className="grid grid-cols-2 gap-3"><Field label="Importance"><Select value={newTask.importance} onValueChange={(value) => setNewTask({ ...newTask, importance: value as PlannerTask["importance"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Low","Medium","High"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></Field><Field label="Urgency"><Select value={newTask.urgency} onValueChange={(value) => setNewTask({ ...newTask, urgency: value as PlannerTask["urgency"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Low","Medium","High"].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></Field></div><Button variant="outline" className="w-full" onClick={addTask}><Plus /> Add task</Button></div><div className="mt-5 space-y-2 border-t border-border pt-4">{tasks.map((task) => <div key={task.id} className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"><div className={cn("size-2 rounded-full", task.urgency === "High" ? "bg-destructive" : "bg-primary")} /><p className="min-w-0 flex-1 truncate text-sm font-medium">{task.title}</p><Button variant="ghost" size="icon-sm" aria-label={`Delete ${task.title}`} onClick={() => setTasks(tasks.filter((item) => item.id !== task.id))}><Trash2 /></Button></div>)}</div></section><Button className="h-12 w-full rounded-lg" onClick={replan}><RefreshCw /> Replan my day</Button></div>
      <section className="schedule-shell"><div className="schedule-head"><div><p className="eyebrow">{mode === "daily" ? "Wednesday, September 23" : "September 21–25"}</p><h2 className="panel-title mt-1">Your optimized {mode === "daily" ? "day" : "week"}</h2></div><div className="flex gap-4 text-right"><div><p className="text-lg font-bold">{Math.floor(total / 60)}h {total % 60}m</p><p className="text-[11px] text-muted-foreground">Focus planned</p></div><div><p className="text-lg font-bold">{schedule.length}</p><p className="text-[11px] text-muted-foreground">Priority blocks</p></div></div></div><div className="p-4 sm:p-6">{mode === "daily" ? <Timeline schedule={schedule} /> : <Weekly schedule={schedule} />}</div><div className="priority-note"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Gauge /></div><p className="text-sm leading-6"><strong>Why this order?</strong> High-impact work with the nearest deadline is protected first, while shorter coordination tasks are grouped later to reduce context switching.</p></div></section>
    </div>
  </div>;
}

function Timeline({ schedule }: { schedule: ScheduleItem[] }) { return <div className="relative space-y-3 before:absolute before:bottom-3 before:left-[78px] before:top-3 before:w-px before:bg-border">{schedule.map((item, index) => <div key={item.id} className="relative grid grid-cols-[64px_1fr] gap-5"><div className="pt-4 text-right text-xs font-semibold text-muted-foreground">{item.start}</div><div className={cn("timeline-item", item.priority === "Critical" && "timeline-critical")}><div className="flex flex-wrap items-start justify-between gap-2"><div><div className="mb-1 flex items-center gap-2"><Badge variant={item.priority === "Critical" ? "destructive" : "secondary"}>{item.priority}</Badge>{index < 2 && <Badge variant="outline" className="border-primary/30 text-primary">Focus block</Badge>}</div><h3 className="font-semibold">{item.title}</h3></div><span className="text-xs font-medium text-muted-foreground">{item.duration} min</span></div><p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="size-3" /> {item.start}–{item.end}</p></div>{index === 1 && <div className="col-start-2 rounded-lg border border-dashed border-positive/40 bg-positive/5 px-4 py-2 text-xs font-medium text-positive">10:45 AM · Take a 15-minute reset break</div>}</div>)}</div>; }
function Weekly({ schedule }: { schedule: ScheduleItem[] }) { const days = ["Mon","Tue","Wed","Thu","Fri"]; return <div className="grid min-w-[620px] grid-cols-5 gap-3 overflow-x-auto">{days.map((day, i) => <div key={day}><p className="mb-3 text-center text-xs font-bold text-muted-foreground">{day}</p>{schedule.filter((_, index) => index % 5 === i).map((item) => <div key={item.id} className="timeline-item mb-3 p-3"><p className="text-xs font-bold text-primary">{item.start}</p><p className="mt-1 text-sm font-semibold leading-5">{item.title}</p><p className="mt-2 text-[11px] text-muted-foreground">{item.duration} min</p></div>)}</div>)}</div>; }

function WorkplaceAssistant({ onMessage }: { onMessage: () => void }) {
  const [messages, setMessages] = useStoredState<ChatMessage[]>("dayflow-chat", initialMessages);
  const [thinking, setThinking] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const suggestions = ["Draft a difficult message", "Summarize meeting notes", "Create a meeting agenda", "Help me prioritize"];
  const send = async (text: string) => { const prompt = text.trim(); if (!prompt || thinking) return; setMessages((current) => [...current, { id: crypto.randomUUID(), role: "user", content: prompt }]); setThinking(true); window.setTimeout(() => { setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: answerWorkplacePrompt(prompt) }]); setThinking(false); onMessage(); window.setTimeout(() => inputRef.current?.focus(), 0); }, 650); };
  return <div className="animate-enter"><div className="flex items-end justify-between"><PageIntro eyebrow="Your thinking partner" title="AI Workplace Assistant" description="Turn messy workplace inputs into clear messages, plans, and decisions." /><Button variant="ghost" size="sm" onClick={() => { setMessages(initialMessages); toast.success("Conversation cleared"); }}><RotateCcw /> New conversation</Button></div><div className="assistant-shell"><div className="assistant-context"><div className="flex items-center gap-3"><div className="brand-mark brand-mark-small"><span /><span /><span /></div><div><h2 className="font-display font-bold">Dayflow Assistant</h2><p className="text-xs text-muted-foreground">Ready to help · saved in this browser</p></div></div><div className="mt-6"><p className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">Try asking</p><div className="flex flex-wrap gap-2 xl:flex-col">{suggestions.map((suggestion) => <Button key={suggestion} variant="outline" className="h-auto justify-start whitespace-normal py-2.5 text-left text-xs" onClick={() => send(suggestion)}>{suggestion}<ChevronRight className="ml-auto" /></Button>)}</div></div><div className="mt-auto hidden rounded-lg bg-muted p-4 text-xs leading-5 text-muted-foreground xl:block"><strong className="text-foreground">Tip:</strong> Include the audience, outcome, constraints, and tone for a sharper response.</div></div><div className="flex min-h-[650px] min-w-0 flex-col"><Conversation className="min-h-0"><ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-8 sm:px-8">{messages.map((message) => <Message key={message.id} from={message.role}><MessageContent className={message.role === "user" ? "bg-chat-user text-chat-user-foreground" : ""}><MessageResponse>{message.content}</MessageResponse></MessageContent></Message>)}{thinking && <Message from="assistant"><MessageContent><Shimmer>Thinking through your request...</Shimmer></MessageContent></Message>}</ConversationContent><ConversationScrollButton /></Conversation><div className="border-t border-border bg-background/70 p-4 sm:p-6"><div className="mx-auto max-w-3xl"><PromptInput onSubmit={(message) => send(message.text || "")} className="rounded-lg border-border bg-card shadow-editor"><PromptInputTextarea ref={inputRef} autoFocus placeholder="Ask for a message, summary, agenda, ideas, or prioritization help…" className="min-h-24" /><PromptInputFooter className="justify-between"><span className="pl-2 text-[11px] text-muted-foreground">Enter to send · Shift+Enter for new line</span><PromptInputSubmit status={thinking ? "submitted" : "ready"} disabled={thinking} /></PromptInputFooter></PromptInput></div></div></div></div></div>;
}

function SettingsView() { const [prefs, setPrefs] = useStoredState("dayflow-preferences", { compact: false, reducedMotion: false, reminders: true }); const toggle = (key: keyof typeof prefs) => { setPrefs({ ...prefs, [key]: !prefs[key] }); toast.success("Preference updated"); }; return <div className="animate-enter max-w-3xl"><PageIntro eyebrow="Make it yours" title="Settings" description="Preferences are saved only in this browser." /><section className="glass-card divide-y divide-border p-2">{[["compact","Compact workspace","Fit more information on screen"],["reducedMotion","Reduce motion","Limit interface animations"],["reminders","Productivity reminders","Show gentle focus reminders"]].map(([key,title,description]) => <div key={key} className="flex items-center gap-4 p-4"><div className="flex-1"><p className="font-semibold">{title}</p><p className="text-sm text-muted-foreground">{description}</p></div><button role="switch" aria-checked={prefs[key as keyof typeof prefs]} onClick={() => toggle(key as keyof typeof prefs)} className={cn("toggle", prefs[key as keyof typeof prefs] && "toggle-on")}><span /></button></div>)}</section><Button className="mt-5" onClick={() => toast.success("Settings saved")}><Save /> Save preferences</Button></div>; }

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div>; }
function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) { return <div className="mb-7"><p className="eyebrow">{eyebrow}</p><h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{description}</p></div>; }