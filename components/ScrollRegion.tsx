"use client";

import clsx from "clsx";
import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from "react";

export type ScrollRegionProps = Omit<HTMLAttributes<HTMLDivElement>, "className"> & {
  className?: string;
  scrollClassName?: string;
  children: ReactNode;
};

export default function ScrollRegion({
  className,
  scrollClassName,
  children,
  ...rest
}: ScrollRegionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = el.scrollWidth - el.clientWidth;
      const x = Math.abs(el.scrollLeft);
      const start = max > 1 && x > 1;
      const end = max > 1 && x < max - 1;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    el.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(el);
    for (const child of Array.from(el.children)) observer?.observe(child);
    return () => {
      el.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={clsx("relative", className)}>
      <div
        ref={ref}
        className={clsx("relative overflow-x-auto rounded-[inherit]", scrollClassName)}
        {...rest}
      >
        {children}
      </div>
      <span
        aria-hidden="true"
        className="scroll-shadow scroll-shadow-start"
        data-visible={edges.start || undefined}
      />
      <span
        aria-hidden="true"
        className="scroll-shadow scroll-shadow-end"
        data-visible={edges.end || undefined}
      />
    </div>
  );
}
