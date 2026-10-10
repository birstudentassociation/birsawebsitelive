type SendResult =
  | ({ error: ({ message?: string } & Record<string, unknown>) | null } & Record<string, unknown>)
  | null
  | undefined;

/**
 * Resend's `emails.send()` resolves `{ data, error }` rather than throwing on
 * API errors. Pass its result through here so a rejected send follows the same
 * path as a thrown one.
 */
export function throwIfEmailFailed(result: SendResult): void {
  if (result?.error) {
    throw new Error(result.error.message ?? "Email send failed");
  }
}
