import { createFileRoute } from "@tanstack/react-router";
import { WorkplaceApp } from "@/components/workplace-app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dayflow — AI Workplace Productivity Assistant" },
      { name: "description", content: "Plan focused work, draft professional emails, and solve workplace challenges with one intelligent productivity workspace." },
      { property: "og:title", content: "Dayflow — AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Your intelligent command center for focused work, polished communication, and better decisions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <WorkplaceApp />;
}
