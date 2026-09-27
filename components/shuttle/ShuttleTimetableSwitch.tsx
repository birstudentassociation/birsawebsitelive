"use client";

/**
 * Shows the previous timetables until `from` and the new ones from that
 * Bangkok date, so a statically built page changes over on the day without
 * a rebuild. The first render follows the server so hydration matches.
 */
import { useEffect, useState, type ReactNode } from "react";
import { getBangkokParts } from "@/lib/shuttle";

export type ShuttleTimetableSwitchProps = {
  from: string;
  initiallyNew: boolean;
  previous: ReactNode;
  current: ReactNode;
};

export default function ShuttleTimetableSwitch({
  from,
  initiallyNew,
  previous,
  current,
}: ShuttleTimetableSwitchProps) {
  const [isNew, setIsNew] = useState(initiallyNew);

  useEffect(() => {
    const check = () => setIsNew(getBangkokParts().date >= from);
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [from]);

  return <>{isNew ? current : previous}</>;
}
