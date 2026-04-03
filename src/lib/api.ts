import type { Warning } from "@/lib/types";

type AddWarningInput = {
  latitude: number;
  longitude: number;
  message: string;
};

async function parseResponse<T>(response: Response) {
  const body = (await response.json()) as T & { error?: string };

  if (!response.ok) {
    throw new Error(body.error ?? "Request failed.");
  }

  return body;
}

export async function getWarnings() {
  const response = await fetch("/api/warnings", {
    method: "GET",
    cache: "no-store",
  });

  const body = await parseResponse<{ warnings: Warning[] }>(response);
  return body.warnings;
}

export async function addWarning(input: AddWarningInput) {
  const response = await fetch("/api/warnings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const body = await parseResponse<{ warning: Warning }>(response);
  return body.warning;
}
