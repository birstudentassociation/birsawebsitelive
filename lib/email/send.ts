type SendResult =
  | ({ error: ({ message?: string } & Record<string, unknown>) | null } & Record<string, unknown>)
  | null
  | undefined;

export function throwIfEmailFailed(result: SendResult): void {
  if (result?.error) {
    throw new Error(result.error.message ?? "Email send failed");
  }
}
