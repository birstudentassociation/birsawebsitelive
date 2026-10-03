import { readFileSync } from "node:fs";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  aboveWarning,
  BMA_CANAL_URL,
  classify,
  countByStatus,
  fetchCanalSnapshot,
  nearestStations,
  parseCanalStations,
} from "@/lib/conditions/sources/canals";

const fixture = JSON.parse(
  readFileSync(join(__dirname, "fixtures", "conditions", "canals-bma.json"), "utf8")
) as unknown;

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("classify", () => {
  it("checks low before critical and warning", () => {
    expect(classify(0.1, 0.6, 0.7, 0.2)).toBe("low");
    expect(classify(0.7, 0.6, 0.7, 0.2)).toBe("critical");
    expect(classify(0.6, 0.6, 0.7, 0.2)).toBe("warning");
    expect(classify(0.5, 0.6, 0.7, null)).toBe("normal");
    expect(classify(5, null, null, null)).toBe("normal");
  });
});

describe("parseCanalStations", () => {
  const snapshot = parseCanalStations(fixture)!;
  const byId = new Map(snapshot.stations.map((station) => [station.id, station]));

  it("keeps level stations once each and drops other systems", () => {
    expect([...byId.keys()].sort((a, b) => a - b)).toEqual([10, 100, 102, 106, 125, 135]);
  });

  it("reports the newest reading time in Bangkok time", () => {
    expect(snapshot.observedAt).toBe("2026-10-03T12:35:00+07:00");
  });

  it("reads names, canal and position", () => {
    const station = byId.get(106)!;
    expect(station.name.th).toBe("สถานีสูบน้ำ คลองพระยาราชมนตรี");
    expect(station.name.en).toBe("Khlong Phraya Ratchamontri Pumping Station");
    expect(station.canal).toBe("คลองพระยาราชมนตรี");
    expect(station.code).toBe("WL.RMT.01");
    expect(station.distanceKm).toBeGreaterThan(10);
  });

  it("classifies each station against its own thresholds", () => {
    expect(byId.get(10)!.status).toBe("warning");
    expect(byId.get(100)!.status).toBe("normal");
    expect(byId.get(102)!.status).toBe("low");
    expect(byId.get(125)!.status).toBe("critical");
  });

  it("reads the river side and treats -99 as missing", () => {
    expect(byId.get(106)!.outside).toEqual({
      level: 0.93,
      warning: 1,
      critical: 1.2,
      status: "normal",
    });
    expect(byId.get(10)!.outside).toBeNull();
  });

  it("marks a station with no reading in the last 30 minutes as having no data", () => {
    const stale = byId.get(135)!;
    expect(stale.status).toBe("noData");
    expect(stale.inside).toBeNull();
    expect(stale.at).not.toBeNull();
  });

  it("returns null for anything that is not the BMA payload", () => {
    expect(parseCanalStations(null)).toBeNull();
    expect(parseCanalStations("<html>Just a moment...</html>")).toBeNull();
    expect(parseCanalStations({ waterStation: [] })).toBeNull();
  });
});

describe("summaries", () => {
  const { stations } = parseCanalStations(fixture)!;

  it("counts stations by status", () => {
    expect(countByStatus(stations)).toEqual({
      critical: 1,
      warning: 1,
      normal: 2,
      low: 1,
      noData: 1,
    });
  });

  it("lists critical stations before warning ones", () => {
    expect(aboveWarning(stations).map((station) => station.id)).toEqual([125, 10]);
  });

  it("sorts nearest stations by distance", () => {
    const nearest = nearestStations(stations, 3);
    expect(nearest).toHaveLength(3);
    expect(nearest[0]!.distanceKm).toBeLessThanOrEqual(nearest[1]!.distanceKm);
  });
});

describe("fetchCanalSnapshot", () => {
  it("fetches the BMA endpoint and parses it", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(fixture)));
    vi.stubGlobal("fetch", fetchMock);
    const snapshot = await fetchCanalSnapshot();
    expect(fetchMock).toHaveBeenCalledWith(BMA_CANAL_URL, expect.anything());
    expect(snapshot?.stations).toHaveLength(6);
  });

  it("returns null when BMA serves a challenge page", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("<html>Just a moment...</html>", { status: 403 }))
    );
    expect(await fetchCanalSnapshot()).toBeNull();
  });
});
