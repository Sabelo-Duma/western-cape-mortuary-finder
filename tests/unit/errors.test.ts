import { describe, it, expect } from "vitest";
import { AppError, errorCodes } from "@/lib/api/errors";

describe("AppError", () => {
  it("should create error with code and message", () => {
    const error = new AppError("TEST_ERROR", "Test message", 400);
    expect(error.code).toBe("TEST_ERROR");
    expect(error.message).toBe("Test message");
    expect(error.statusCode).toBe(400);
    expect(error.name).toBe("AppError");
  });

  it("should default to 500 status code", () => {
    const error = new AppError("TEST", "msg");
    expect(error.statusCode).toBe(500);
  });

  it("should include details when provided", () => {
    const error = new AppError("TEST", "msg", 400, { field: "email" });
    expect(error.details).toEqual({ field: "email" });
  });
});

describe("errorCodes", () => {
  it("should have correct status codes", () => {
    expect(errorCodes.MORTUARY_NOT_FOUND.status).toBe(404);
    expect(errorCodes.UNAUTHORIZED.status).toBe(401);
    expect(errorCodes.VALIDATION_ERROR.status).toBe(400);
    expect(errorCodes.RATE_LIMITED.status).toBe(429);
    expect(errorCodes.INTERNAL_ERROR.status).toBe(500);
  });
});
