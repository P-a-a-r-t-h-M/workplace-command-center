import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";
import { createOpenAI } from "@ai-sdk/openai";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatBody = { messages?: unknown };

const system = `You are Dayflow, a highly capable workplace productivity assistant. Never give a generic productivity answer when the user supplied a concrete request.

Before answering, silently structure every request as:
- Intent
- Context
- Objective
- Constraints
- Tone
- Desired Output

Then directly produce the requested deliverable. For emails, write a complete subject and email. For prioritization, analyze the named tasks and give a justified actionable order. For meeting notes, use Summary, Key Decisions, Action Items, Owners, and Deadlines, clearly marking unknown owners or deadlines. For schedules, create a realistic sequence with focus blocks and breaks. For rewrites, preserve the user's meaning and facts. Be polished, specific, concise, and professional. Never invent critical facts; label reasonable assumptions. Use readable markdown.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as ChatBody;
          if (!Array.isArray(messages)) return new Response("Messages are required", { status: 400 });
          const key = process.env['LOVABLE_API_KEY'];
          if (!key) return new Response("AI is not configured", { status: 401 });

          const initialRunId = getLovableAiGatewayRunId(request);
          const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
          const lovable = createOpenAI({
            baseURL: "https://ai.gateway.lovable.dev/v1",
            apiKey: key,
            headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
            fetch: runIdFetch.fetch,
          });
          const result = streamText({
            model: lovable.responses("openai/gpt-6-astra"),
            system,
            messages: await convertToModelMessages(messages as UIMessage[]),
            abortSignal: request.signal,
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "medium",
                reasoningSummary: "auto",
                store: false,
                include: ["reasoning.encrypted_content"],
              },
            },
          });
          return withLovableAiGatewayRunIdHeader(
            result.toUIMessageStreamResponse({
              originalMessages: messages as UIMessage[],
              sendReasoning: true,
              headers: getLovableAiGatewayResponseHeaders(undefined, initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
            }),
            runIdFetch,
          );
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return new Response("Cancelled", { status: 499 });
          const message = error instanceof Error ? error.message : "AI request failed";
          return Response.json({ error: message }, { status: 500 });
        }
      },
    },
  },
});