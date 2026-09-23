const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function getLovableAiGatewayRunId(request: Request) {
  return request.headers.get(RUN_ID_HEADER) ?? undefined;
}

export function createLovableAiGatewayRunIdFetch(initialRunId?: string) {
  let runId = initialRunId;
  const wrappedFetch: typeof fetch = async (input, init) => {
    const headers = new Headers(init?.headers);
    if (runId) headers.set(RUN_ID_HEADER, runId);
    const response = await fetch(input, { ...init, headers });
    runId = response.headers.get(RUN_ID_HEADER) ?? runId;
    return response;
  };
  return { fetch: wrappedFetch, getRunId: () => runId };
}

export function getLovableAiGatewayResponseHeaders(
  contentType?: string,
  headers: Record<string, string> = {},
) {
  return { ...(contentType ? { "Content-Type": contentType } : {}), ...headers };
}

export function withLovableAiGatewayRunIdHeader(
  response: Response,
  runIdFetch: ReturnType<typeof createLovableAiGatewayRunIdFetch>,
) {
  const runId = runIdFetch.getRunId();
  if (runId) response.headers.set(RUN_ID_HEADER, runId);
  return response;
}