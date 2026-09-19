import { describe, expect, it } from "vitest";

import { err, ok } from "@/domain/shared/result";

describe("AppResult", () => {
  it("wraps a success value", () => {
    const result = ok(42);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBe(42);
    }
  });

  it("wraps a typed error", () => {
    const result = err("NOT_FOUND", "missing");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NOT_FOUND");
      expect(result.error.message).toBe("missing");
    }
  });
});
