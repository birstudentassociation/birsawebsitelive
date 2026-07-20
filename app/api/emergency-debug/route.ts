import { NextResponse } from "next/server";
import { get, getAll } from "@vercel/edge-config";

// TEMPORARY diagnostic for the emergency banner. Reports what the deployed
// environment can actually read from Edge Config, without leaking the
// connection string. DELETE this file once the banner is confirmed working.
export const dynamic = "force-dynamic";

export async function GET() {
  const hasEnv = Boolean(process.env.EDGE_CONFIG);

  let emergency: unknown = null;
  let allKeys: string[] = [];
  let error: string | null = null;

  try {
    emergency = await get("emergency");
    const all = await getAll();
    allKeys = all ? Object.keys(all) : [];
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  return NextResponse.json({
    edgeConfigEnvPresent: hasEnv,
    emergencyItem: emergency,
    emergencyItemType: typeof emergency,
    activeType: emergency && typeof emergency === "object" ? typeof (emergency as Record<string, unknown>).active : null,
    allKeysInStore: allKeys,
    readError: error,
  });
}
