import { NextResponse } from "next/server";

type ErrorPayload = {
  error: string;
  fields?: Record<string, string>;
  retryAfter?: number;
};

export function apiError(
  payload: ErrorPayload,
  status: 400 | 403 | 429 | 500 | 503,
  headers?: HeadersInit,
) {
  return NextResponse.json(payload, { status, headers });
}
