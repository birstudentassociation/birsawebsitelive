import { describe, expect, it } from "vitest";
import { throwIfEmailFailed } from "@/lib/email/send";

describe("throwIfEmailFailed", () => {
  it("returns normally when Resend reports no error", () => {
    expect(() => throwIfEmailFailed({ data: { id: "abc" }, error: null })).not.toThrow();
  });

  it("throws when Resend resolves with an error", () => {
    expect(() =>
      throwIfEmailFailed({ data: null, error: { name: "validation_error", message: "Bad from" } })
    ).toThrow("Bad from");
  });
});
