import { request } from "node:https";
import { rootCertificates } from "node:tls";

export const USER_AGENT =
  "BIRSA-Portal-Conditions/1.0 (student information service, Thammasat Tha Prachan)";

type Options = { timeoutMs?: number; revalidate?: number; headers?: Record<string, string> };

async function attempt(url: string, opts: Options): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": USER_AGENT, accept: "*/*", ...opts.headers },
      signal: AbortSignal.timeout(opts.timeoutMs ?? 8000),
      next: { revalidate: opts.revalidate ?? 300 },
    } as RequestInit);
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

export async function getText(url: string, opts: Options = {}): Promise<string | null> {
  for (let i = 0; i < 2; i++) {
    const res = await attempt(url, opts);
    if (res) {
      try {
        return await res.text();
      } catch {
        return null;
      }
    }
  }
  return null;
}

export async function getJson(url: string, opts: Options = {}): Promise<unknown> {
  const text = await getText(url, {
    ...opts,
    headers: { accept: "application/json", ...opts.headers },
  });
  if (text === null) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

export function getTextWithExtraCa(
  url: string,
  extraCa: string[],
  opts: { timeoutMs?: number } = {}
): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const req = request(
        url,
        {
          ca: [...rootCertificates, ...extraCa],
          headers: { "user-agent": USER_AGENT, accept: "*/*" },
          timeout: opts.timeoutMs ?? 8000,
        },
        (res) => {
          if (!res.statusCode || res.statusCode >= 400) {
            res.resume();
            resolve(null);
            return;
          }
          const chunks: Buffer[] = [];
          res.on("data", (c: Buffer) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
          res.on("error", () => resolve(null));
        }
      );
      req.on("timeout", () => req.destroy());
      req.on("error", () => resolve(null));
      req.end();
    } catch {
      resolve(null);
    }
  });
}
