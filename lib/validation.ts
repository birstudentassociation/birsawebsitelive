/**
 * Shared zod schemas for the site's forms — used both client-side (for
 * inline validation) and server-side (in `app/api/*` route handlers, which
 * must never trust client validation alone).
 *
 * `nickname` is a honeypot: a real visitor never sees or fills this field,
 * so any non-empty value means a bot filled every field it could find. The
 * route handler should silently accept-and-discard in that case rather than
 * reveal that a honeypot exists.
 */
import { z } from "zod";

const honeypot = z.string().max(0, "Leave this field empty").optional().or(z.literal(""));

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  category: z.enum(["question", "suggestion", "problem", "other"]),
  subject: z.string().min(1).max(150),
  message: z.string().min(15).max(5000),
  nickname: honeypot,
});

export const startClubSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(200),
  clubName: z.string().min(1).max(100),
  description: z.string().min(15).max(2000),
  members: z.string().max(200).optional(),
  nickname: honeypot,
});

export type ContactInput = z.infer<typeof contactSchema>;
export type StartClubInput = z.infer<typeof startClubSchema>;
