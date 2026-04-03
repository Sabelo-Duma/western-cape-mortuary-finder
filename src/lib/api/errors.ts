import { NextResponse } from "next/server";

export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const errorCodes = {
  MORTUARY_NOT_FOUND: { status: 404, message: "Mortuary not found" },
  CITY_NOT_FOUND: { status: 404, message: "City not found" },
  UNAUTHORIZED: { status: 401, message: "Authentication required" },
  FORBIDDEN: { status: 403, message: "Access denied" },
  VALIDATION_ERROR: { status: 400, message: "Invalid input" },
  RATE_LIMITED: { status: 429, message: "Too many requests" },
  INTERNAL_ERROR: { status: 500, message: "Something went wrong" },
} as const;

export function createErrorResponse(
  code: keyof typeof errorCodes,
  details?: Record<string, unknown>
) {
  const error = errorCodes[code];
  return NextResponse.json(
    {
      error: {
        code,
        message: error.message,
        timestamp: new Date().toISOString(),
        details: details ?? {},
      },
    },
    { status: error.status }
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
          details: error.details ?? {},
        },
      },
      { status: error.statusCode }
    );
  }

  return createErrorResponse("INTERNAL_ERROR");
}
