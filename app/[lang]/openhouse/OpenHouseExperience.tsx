"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import { localeHref, formatDate, type Locale } from "@/lib/i18n";
import type { CuratedCourse } from "@/lib/openhouse";
import { COPY, OPEN_HOUSE, t } from "@/content/openhouse/copy";
import RiverTrace from "./RiverTrace";
import FieldNote, { FIELDNOTE_SVG_ID } from "./FieldNote";

type Props = {
  locale: Locale;
  courses: CuratedCourse[];
  initialCourse?: string;
  isEventDay: boolean;
};

const folioStops = [
  { id: "oh-arrival", label: COPY.folioArrival },
  { id: "oh-class", label: COPY.classTime },
  { id: "oh-day", label: COPY.folioDay },
];

export default function OpenHouseExperience({ locale, courses, initialCourse, isEventDay }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [course, setCourse] = useState<string | undefined>(initialCourse);
  const [name, setName] = useState("");
  const [active, setActive] = useState("oh-arrival");
  const [toast, setToast] = useState("");

  const selected = courses.find((c) => c.code === course) ?? null;
  const activeStop = folioStops.find((s) => s.id === active) ?? folioStops[0];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animate) root.classList.add("oh-animate");

    const revealObserver = animate
      ? new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) {
                e.target.classList.add("is-in");
                revealObserver!.unobserve(e.target);
              }
            }
          },
          { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
        )
      : null;
    if (revealObserver) {
      root.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));
    }

    const sceneObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    root.querySelectorAll("[data-scene]").forEach((el) => sceneObserver.observe(el));

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        root.style.setProperty("--oh-progress", String(p));
        root.style.setProperty("--oh-day", String(p));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      revealObserver?.disconnect();
      sceneObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (course) url.searchParams.set("course", course);
    else url.searchParams.delete("course");
    window.history.replaceState(null, "", url);
  }, [course]);

  const chooseCourse = (code: string) => setCourse((prev) => (prev === code ? undefined : code));

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2400);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t(COPY.copied, locale));
    } catch {
      showToast(window.location.href);
    }
  }, [locale, showToast]);

  const share = useCallback(async () => {
    const data = { title: "BIR Open House", url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    void copyLink();
  }, [copyLink]);

  const saveCard = useCallback(() => {
    const svg = document.getElementById(FIELDNOTE_SVG_ID) as SVGSVGElement | null;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = 480 * scale;
      canvas.height = 600 * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "bir-open-house.png";
        a.click();
        URL.revokeObjectURL(a.href);
      }, "image/png");
    };
    img.src = url;
  }, []);

  return (
    <div className="oh" ref={rootRef}>
      <nav className="oh-folio" aria-label={t(COPY.dayKicker, locale)}>
        <p className="oh-folio-now oh-time" aria-hidden="true">
          {active === "oh-class" && course ? course : activeStop ? t(activeStop.label, locale) : ""}
        </p>
        <ol>
          {folioStops.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} aria-current={active === s.id}>
                <span className="oh-time">{t(s.label, locale)}</span>
                {s.id === "oh-class" && course ? (
                  <span className="oh-folio-carry">{course}</span>
                ) : null}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Arrival */}
      <section id="oh-arrival" data-scene className="oh-scene oh-arrival">
        <span className="oh-anchor" aria-hidden="true">
          {locale === "th" ? "ท่าพระจันทร์" : "Tha Prachan"}
        </span>
        <div className="oh-measure oh-arrival-body">
          <p className="oh-kicker oh-reveal" data-reveal>
            {t(COPY.eyebrow, locale)}
          </p>
          <p
            className="oh-kicker oh-reveal"
            data-reveal
            data-delay="1"
            style={{ marginTop: "0.4rem" }}
          >
            {t(COPY.event, locale)}
          </p>
          <h1
            className="oh-display oh-reveal"
            data-reveal
            data-delay="1"
            style={{ marginTop: "1.5rem" }}
          >
            {t(COPY.headline, locale)}
          </h1>
          <p className="oh-arrival-sub oh-reveal" data-reveal data-delay="2">
            {t(COPY.sub, locale)}
          </p>
          <RiverTrace className="oh-trace oh-arrival-river oh-reveal" data-reveal data-delay="2" />
          <div className="oh-arrival-actions oh-reveal" data-reveal data-delay="3">
            <Button href="#oh-class" variant="primary">
              {t(COPY.walk, locale)}
            </Button>
            {isEventDay ? (
              <Button href="#oh-invite" variant="secondary">
                {t(COPY.hereToday, locale)}
              </Button>
            ) : null}
          </div>
          <p className="oh-scroll-hint oh-reveal" data-reveal data-delay="3">
            {t(COPY.scroll, locale)}
          </p>
        </div>
      </section>

      {/* 09:15 First class */}
      <section id="oh-class" data-scene className="oh-scene">
        <div className="oh-measure">
          <p className="oh-kicker oh-reveal" data-reveal>
            <span className="oh-time">{t(COPY.classTime, locale)}</span> ·{" "}
            {t(COPY.classKicker, locale)}
          </p>
          <h2 className="oh-heading oh-reveal" data-reveal data-delay="1">
            {t(COPY.classPrompt, locale)}
          </h2>
          <p className="oh-lede oh-reveal" data-reveal data-delay="1">
            {t(COPY.classNote, locale)}
          </p>

          <div className="oh-slips" role="group" aria-label={t(COPY.classHint, locale)}>
            {courses.map((c, i) => {
              const isSel = c.code === course;
              return (
                <button
                  key={c.code}
                  type="button"
                  className="oh-slip oh-reveal"
                  data-reveal
                  data-delay={String((i % 3) + 1)}
                  aria-pressed={isSel}
                  aria-expanded={isSel}
                  onClick={() => chooseCourse(c.code)}
                >
                  <span className="oh-slip-code">{c.code}</span>
                  <span className="oh-slip-title">{t(c.title, locale)}</span>
                  <span className="oh-slip-field">{t(c.field, locale)}</span>
                </button>
              );
            })}
          </div>

          <div className="oh-teaser-slot" aria-live="polite">
            {selected ? (
              <article
                key={selected.code}
                className="oh-teaser"
                aria-label={`${selected.code} ${t(selected.title, locale)}`}
              >
                <p className="oh-teaser-eyebrow oh-time">
                  {t(COPY.cardChoiceCourse, locale)} · {selected.code}
                </p>
                <h3 className="oh-teaser-hook">{t(selected.teaser.hook, locale)}</h3>
                <p className="oh-teaser-opens">{t(selected.teaser.opens, locale)}</p>
                <p className="oh-teaser-label">{t(COPY.keyIdeas, locale)}</p>
                <ul className="oh-tags">
                  {selected.teaser.thinkers.map((th_, k) => (
                    <li key={k} className="oh-tag">
                      {t(th_, locale)}
                    </li>
                  ))}
                </ul>
                <p className="oh-teaser-takeaway">{t(selected.teaser.takeaway, locale)}</p>
                <p className="oh-teaser-link">
                  <Link href={localeHref(locale, "/services/study-plan/curriculum")}>
                    {t(COPY.curriculumLink, locale)} ↗
                  </Link>
                </p>
              </article>
            ) : (
              <p className="oh-teaser-empty">{t(COPY.classHint, locale)}</p>
            )}
          </div>
        </div>
      </section>

      {/* Your day */}
      <section id="oh-day" data-scene className="oh-scene">
        <div className="oh-measure oh-fieldnote-wrap">
          <div style={{ textAlign: "center" }}>
            <p className="oh-kicker oh-reveal" data-reveal>
              {t(COPY.dayKicker, locale)}
            </p>
            <h2 className="oh-heading oh-reveal" data-reveal data-delay="1">
              {t(COPY.daySubtitle, locale)}
            </h2>
          </div>

          <div className="oh-namefield oh-reveal" data-reveal data-delay="1">
            <label htmlFor="oh-name">{t(COPY.nameLabel, locale)}</label>
            <input
              id="oh-name"
              type="text"
              value={name}
              maxLength={40}
              autoComplete="off"
              placeholder={t(COPY.namePlaceholder, locale)}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="oh-card oh-reveal" data-reveal data-delay="2">
            <FieldNote locale={locale} name={name} course={selected} />
          </div>

          <div className="oh-actions oh-reveal" data-reveal data-delay="2">
            <Button onClick={saveCard} variant="primary">
              {t(COPY.save, locale)}
            </Button>
            <Button onClick={copyLink} variant="secondary">
              {t(COPY.copy, locale)}
            </Button>
            <Button onClick={share} variant="secondary">
              {t(COPY.share, locale)}
            </Button>
          </div>
          <p className="oh-toast" role="status" aria-live="polite">
            {toast}
          </p>
          {course ? (
            <button
              type="button"
              className="oh-restart oh-reveal"
              data-reveal
              onClick={() => {
                setCourse(undefined);
                setName("");
              }}
            >
              {t(COPY.restart, locale)}
            </button>
          ) : null}
        </div>
      </section>

      {/* Invitation */}
      <section id="oh-invite" data-scene className="oh-scene oh-invite">
        <div className="oh-measure">
          <p className="oh-kicker oh-reveal" data-reveal>
            {t(COPY.inviteKicker, locale)}
          </p>
          <h2 className="oh-heading oh-reveal" data-reveal data-delay="1">
            {t(COPY.inviteHeadline, locale)}
          </h2>
          <dl className="oh-facts oh-reveal" data-reveal data-delay="1">
            <div className="oh-fact">
              <dt>{t(COPY.whenLabel, locale)}</dt>
              <dd>
                {formatDate(locale, OPEN_HOUSE.dateISO)}
                <br />
                08:00–16:00
              </dd>
            </div>
            <div className="oh-fact">
              <dt>{t(COPY.whereLabel, locale)}</dt>
              <dd>{t(OPEN_HOUSE.venue, locale)}</dd>
            </div>
          </dl>
          <div className="oh-invite-actions oh-reveal" data-reveal data-delay="2">
            <Button
              href={OPEN_HOUSE.mapsUrl}
              variant="secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(COPY.directions, locale)} ↗
            </Button>
            <Button
              href={OPEN_HOUSE.programmeUrl}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(COPY.programme, locale)} ↗
            </Button>
          </div>
          <p className="oh-invite-note">{t(COPY.programmeNote, locale)}</p>
        </div>
      </section>
    </div>
  );
}
