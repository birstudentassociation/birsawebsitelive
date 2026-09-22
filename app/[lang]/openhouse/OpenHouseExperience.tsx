"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import { localeHref, formatDate, type Locale } from "@/lib/i18n";
import { mapsHref, type CuratedCourse, type LunchDirection } from "@/lib/openhouse";
import { ARRIVE_MODES, COPY, OPEN_HOUSE, t } from "@/content/openhouse/copy";
import { CLUBS, TEXTURE_LABELS } from "@/content/openhouse/clubs";
import RiverTrace from "./RiverTrace";
import ArrivalMap from "./ArrivalMap";
import HomeBoard from "./HomeBoard";
import FieldNote, { FIELDNOTE_SVG_ID, type FieldNoteEntry } from "./FieldNote";

type Props = {
  locale: Locale;
  courses: CuratedCourse[];
  lunchDirections: LunchDirection[];
  initial: { arrive?: string; course?: string; lunch?: string; club?: string };
  phase: "pre" | "event" | "post";
};

const folioStops = [
  { id: "oh-arrival", label: COPY.folioArrival, name: null, key: null },
  { id: "oh-arrive", label: COPY.arriveTime, name: COPY.arriveKicker, key: "arrive" as const },
  { id: "oh-class", label: COPY.classTime, name: COPY.classKicker, key: "course" as const },
  { id: "oh-between", label: COPY.betweenTime, name: COPY.betweenKicker, key: null },
  { id: "oh-lunch", label: COPY.lunchTime, name: COPY.lunchKicker, key: "lunch" as const },
  { id: "oh-back", label: COPY.backTime, name: COPY.backKicker, key: null },
  { id: "oh-clubs", label: COPY.clubsTime, name: COPY.clubsKicker, key: "club" as const },
  { id: "oh-dusk", label: COPY.duskTime, name: COPY.duskKicker, key: null },
  { id: "oh-home", label: COPY.homeTime, name: COPY.homeKicker, key: null },
  { id: "oh-day", label: COPY.folioDay, name: null, key: null },
];

export default function OpenHouseExperience({
  locale,
  courses,
  lunchDirections,
  initial,
  phase,
}: Props) {
  const isEventDay = phase === "event";
  const rootRef = useRef<HTMLDivElement>(null);
  const [arrive, setArrive] = useState<string | undefined>(initial.arrive);
  const [course, setCourse] = useState<string | undefined>(initial.course);
  const [lunch, setLunch] = useState<string | undefined>(initial.lunch);
  const [club, setClub] = useState<string | undefined>(initial.club);
  const [name, setName] = useState("");
  const [active, setActive] = useState("oh-arrival");
  const [toast, setToast] = useState("");

  const selectedCourse = courses.find((c) => c.code === course) ?? null;
  const selectedArrive = ARRIVE_MODES.find((m) => m.key === arrive) ?? null;
  const selectedLunch = lunchDirections.find((d) => d.key === lunch) ?? null;
  const selectedClub = CLUBS.find((c) => c.slug === club) ?? null;
  const activeStop = folioStops.find((s) => s.id === active) ?? folioStops[0];
  const chosen: Record<string, boolean> = {
    arrive: !!arrive,
    course: !!course,
    lunch: !!lunch,
    club: !!club,
  };

  const entries = useMemo<FieldNoteEntry[]>(() => {
    const out: FieldNoteEntry[] = [];
    if (selectedArrive)
      out.push({
        time: "08:42",
        label: t(COPY.fnArrive, locale),
        value: t(selectedArrive.card, locale),
      });
    if (selectedCourse)
      out.push({
        time: "09:15",
        label: t(COPY.cardChoiceCourse, locale),
        value: `${selectedCourse.code} · ${t(selectedCourse.field, locale)}`,
      });
    if (selectedLunch)
      out.push({
        time: "12:07",
        label: t(COPY.fnLunch, locale),
        value: t(selectedLunch.label, locale),
      });
    if (selectedClub)
      out.push({
        time: "16:34",
        label: t(COPY.fnClub, locale),
        value: t(selectedClub.name, locale),
      });
    return out;
  }, [selectedArrive, selectedCourse, selectedLunch, selectedClub, locale]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animate) root.classList.add("oh-animate");

    const revealObserver = animate
      ? new IntersectionObserver(
          (entriesIO) => {
            for (const e of entriesIO) {
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
      (entriesIO) => {
        for (const e of entriesIO) {
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
        // The whole-page warm shift is motion; leave it static for reduced motion.
        if (animate) root.style.setProperty("--oh-day", String(p));
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

  // Carry the choices into a shareable URL without a reload. Only the day's
  // closed-set choices go in; the name never leaves the browser.
  useEffect(() => {
    const url = new URL(window.location.href);
    const set = (k: string, v: string | undefined) =>
      v ? url.searchParams.set(k, v) : url.searchParams.delete(k);
    set("arrive", arrive);
    set("course", course);
    set("lunch", lunch);
    set("club", club);
    window.history.replaceState(null, "", url);
  }, [arrive, course, lunch, club]);

  const toggle =
    (setter: (fn: (prev: string | undefined) => string | undefined) => void) => (value: string) =>
      setter((prev) => (prev === value ? undefined : value));

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
      canvas.height = 640 * scale;
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

  const anyChoice = !!(arrive || course || lunch || club);

  return (
    <div className="oh" ref={rootRef}>
      <nav className="oh-folio" aria-label={t(COPY.dayKicker, locale)}>
        <p className="oh-folio-now oh-time" aria-hidden="true">
          {activeStop ? t(activeStop.label, locale) : ""}
        </p>
        <ol>
          {folioStops.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={active === s.id}
                aria-label={
                  s.name ? `${t(s.label, locale)} — ${t(s.name, locale)}` : t(s.label, locale)
                }
                data-chosen={s.key ? chosen[s.key] : undefined}
              >
                <span className="oh-time">{t(s.label, locale)}</span>
                {s.id === "oh-class" && course ? (
                  <span className="oh-folio-carry">{course}</span>
                ) : null}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {phase === "event" ? (
        <aside className="oh-event-banner on-brand" role="note">
          <div className="oh-measure">
            <p className="oh-event-welcome">{t(COPY.evtWelcome, locale)}</p>
            <p className="oh-event-lead">{t(COPY.evtLead, locale)}</p>
            <div className="oh-event-actions">
              <a className="oh-event-btn" href="#oh-invite">
                {t(COPY.evtProgramme, locale)}
              </a>
              <a
                className="oh-event-btn"
                href={OPEN_HOUSE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t(COPY.evtFindRoom, locale)} ↗
              </a>
              <a className="oh-event-btn" href="#oh-clubs">
                {t(COPY.evtExplore, locale)}
              </a>
            </div>
          </div>
        </aside>
      ) : null}
      {phase === "post" ? (
        <aside className="oh-arc-banner" role="note">
          <div className="oh-measure">
            <p className="oh-arc-headline">{t(COPY.arcHeadline, locale)}</p>
            <p className="oh-arc-lead">{t(COPY.arcLead, locale)}</p>
          </div>
        </aside>
      ) : null}

      {/* Arrival */}
      <section id="oh-arrival" data-scene className="oh-scene oh-arrival">
        <svg
          className="oh-anchor"
          aria-hidden="true"
          viewBox="0 0 1200 300"
          preserveAspectRatio="xMinYMax slice"
        >
          {/* Baseline sits low with headroom above so Thai tone marks, which
              stack well above cap height, are never clipped by the viewBox. */}
          <text x="0" y="228">
            {locale === "th" ? "ท่าพระจันทร์" : "Tha Prachan"}
          </text>
        </svg>
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
            <Button href="#oh-arrive" variant="primary">
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

      {/* 08:42 Getting there */}
      <section id="oh-arrive" data-scene className="oh-scene">
        <div className="oh-measure">
          <p className="oh-kicker oh-reveal" data-reveal>
            <span className="oh-time">{t(COPY.arriveTime, locale)}</span> ·{" "}
            {t(COPY.arriveKicker, locale)}
          </p>
          <h2 className="oh-heading oh-reveal" data-reveal data-delay="1">
            {t(COPY.arrivePrompt, locale)}
          </h2>
          <p className="oh-lede oh-reveal" data-reveal data-delay="1">
            {t(COPY.arriveNote, locale)}
          </p>
          <div className="oh-map oh-reveal" data-reveal data-delay="2">
            <ArrivalMap locale={locale} mode={arrive} />
          </div>
          <div className="oh-modes" role="group" aria-label={t(COPY.arrivePrompt, locale)}>
            {ARRIVE_MODES.map((m, i) => (
              <button
                key={m.key}
                type="button"
                className="oh-mode oh-reveal"
                data-reveal
                data-delay={String((i % 3) + 1)}
                aria-pressed={m.key === arrive}
                onClick={() => toggle(setArrive)(m.key)}
              >
                {t(m.label, locale)}
              </button>
            ))}
          </div>
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
            {courses.map((c, i) => (
              <button
                key={c.code}
                type="button"
                className="oh-slip oh-reveal"
                data-reveal
                data-delay={String((i % 3) + 1)}
                aria-pressed={c.code === course}
                aria-expanded={c.code === course}
                onClick={() => toggle(setCourse)(c.code)}
              >
                <span className="oh-slip-code">{c.code}</span>
                <span className="oh-slip-title">{t(c.title, locale)}</span>
                <span className="oh-slip-field">{t(c.field, locale)}</span>
              </button>
            ))}
          </div>

          <div className="oh-teaser-slot" aria-live="polite">
            {selectedCourse ? (
              <article
                key={selectedCourse.code}
                className="oh-teaser"
                aria-label={`${selectedCourse.code} ${t(selectedCourse.title, locale)}`}
              >
                <p className="oh-teaser-eyebrow oh-time">
                  {t(COPY.cardChoiceCourse, locale)} · {selectedCourse.code}
                </p>
                <h3 className="oh-teaser-hook">{t(selectedCourse.teaser.hook, locale)}</h3>
                <p className="oh-teaser-opens">{t(selectedCourse.teaser.opens, locale)}</p>
                <p className="oh-teaser-label">{t(COPY.keyIdeas, locale)}</p>
                <ul className="oh-tags">
                  {selectedCourse.teaser.thinkers.map((idea, k) => (
                    <li key={k} className="oh-tag">
                      {t(idea, locale)}
                    </li>
                  ))}
                </ul>
                <p className="oh-teaser-takeaway">{t(selectedCourse.teaser.takeaway, locale)}</p>
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

      {/* 10:47 Between classes */}
      <section id="oh-between" data-scene className="oh-scene oh-pause">
        <div className="oh-measure">
          <p className="oh-kicker oh-reveal" data-reveal>
            <span className="oh-time">{t(COPY.betweenTime, locale)}</span> ·{" "}
            {t(COPY.betweenKicker, locale)}
          </p>
          <p className="oh-pause-line oh-reveal" data-reveal data-delay="1">
            {t(COPY.betweenLine, locale)}
          </p>
          <p className="oh-pause-body oh-reveal" data-reveal data-delay="2">
            {t(COPY.betweenBody, locale)}
          </p>
        </div>
      </section>

      {/* 12:07 Lunch */}
      <section id="oh-lunch" data-scene className="oh-scene">
        <div className="oh-measure">
          <p className="oh-kicker oh-reveal" data-reveal>
            <span className="oh-time">{t(COPY.lunchTime, locale)}</span> ·{" "}
            {t(COPY.lunchKicker, locale)}
          </p>
          <h2 className="oh-heading oh-reveal" data-reveal data-delay="1">
            {t(COPY.lunchPrompt, locale)}
          </h2>
          <p className="oh-lede oh-reveal" data-reveal data-delay="1">
            {t(COPY.lunchNote, locale)}
          </p>

          <div className="oh-directions" role="group" aria-label={t(COPY.lunchPrompt, locale)}>
            {lunchDirections.map((d, i) => (
              <button
                key={d.key}
                type="button"
                className="oh-direction oh-reveal"
                data-reveal
                data-delay={String(i + 1)}
                aria-pressed={d.key === lunch}
                aria-expanded={d.key === lunch}
                onClick={() => toggle(setLunch)(d.key)}
              >
                <span className="oh-direction-label">{t(d.label, locale)}</span>
                <span className="oh-direction-blurb">{t(d.blurb, locale)}</span>
              </button>
            ))}
          </div>

          <div className="oh-places-slot" aria-live="polite">
            {selectedLunch ? (
              <div key={selectedLunch.key} className="oh-places">
                {selectedLunch.ferry ? (
                  <p className="oh-ferry-note">
                    <RiverTrace className="oh-ferry-trace" />
                  </p>
                ) : null}
                <ul className="oh-place-list">
                  {selectedLunch.places.map((p) => (
                    <li key={p.id} className="oh-place">
                      <div className="oh-place-head">
                        <h3 className="oh-place-name">{t(p.name, locale)}</h3>
                        <span className="oh-place-cat">{t(p.category, locale)}</span>
                      </div>
                      {p.note ? <p className="oh-place-note">{t(p.note, locale)}</p> : null}
                      <ExternalLink
                        href={mapsHref(p.mapsQuery)}
                        newTabLabel={t(COPY.newTab, locale)}
                        className="oh-place-link focus-highlight"
                      >
                        {t(COPY.openMaps, locale)}
                      </ExternalLink>
                    </li>
                  ))}
                </ul>
                <p className="oh-map-note">
                  {t(COPY.lunchMap, locale)}{" "}
                  <Link href={localeHref(locale, "/student-life")}>
                    {t(COPY.lunchMapLink, locale)} ↗
                  </Link>
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 13:23 Back to class */}
      <section id="oh-back" data-scene className="oh-scene">
        <div className="oh-measure">
          <p className="oh-kicker oh-reveal" data-reveal>
            <span className="oh-time">{t(COPY.backTime, locale)}</span> ·{" "}
            {t(COPY.backKicker, locale)}
          </p>
          <p className="oh-lede oh-reveal" data-reveal data-delay="1">
            {t(COPY.backLine, locale)}
          </p>
          <ul className="oh-questions">
            {COPY.backQuestions.map((q, i) => (
              <li
                key={i}
                className="oh-question oh-reveal"
                data-reveal
                data-delay={String((i % 3) + 1)}
              >
                {t(q, locale)}
              </li>
            ))}
          </ul>
          <p className="oh-back-note oh-reveal" data-reveal>
            {t(COPY.backNote, locale)}
          </p>
        </div>
      </section>

      {/* 16:34 Clubs */}
      <section id="oh-clubs" data-scene className="oh-scene">
        <div className="oh-measure">
          <p className="oh-kicker oh-reveal" data-reveal>
            <span className="oh-time">{t(COPY.clubsTime, locale)}</span> ·{" "}
            {t(COPY.clubsKicker, locale)}
          </p>
          <h2 className="oh-heading oh-reveal" data-reveal data-delay="1">
            {t(COPY.clubsPrompt, locale)}
          </h2>
          <p className="oh-lede oh-reveal" data-reveal data-delay="1">
            {t(COPY.clubsNote, locale)}
          </p>

          <div className="oh-wall" role="group" aria-label={t(COPY.clubsPrompt, locale)}>
            {CLUBS.map((c, i) => (
              <button
                key={c.slug}
                type="button"
                className="oh-club oh-reveal"
                data-reveal
                data-delay={String((i % 3) + 1)}
                data-feature={c.feature ? true : undefined}
                aria-pressed={c.slug === club}
                aria-expanded={c.slug === club}
                onClick={() => toggle(setClub)(c.slug)}
              >
                <span className="oh-club-kicker">{t(TEXTURE_LABELS[c.texture], locale)}</span>
                <span className="oh-club-name">{t(c.name, locale)}</span>
                <span className="oh-club-tag">{t(c.tagline, locale)}</span>
              </button>
            ))}
          </div>

          <div className="oh-door-slot" aria-live="polite">
            {selectedClub ? (
              <article
                key={selectedClub.slug}
                className="oh-door"
                aria-label={t(selectedClub.name, locale)}
              >
                <p className="oh-door-kicker">{t(TEXTURE_LABELS[selectedClub.texture], locale)}</p>
                <h3 className="oh-door-name">{t(selectedClub.name, locale)}</h3>
                <p className="oh-door-tag">{t(selectedClub.tagline, locale)}</p>
                <p className="oh-door-detail">{t(selectedClub.detail, locale)}</p>
                {selectedClub.join ? (
                  <p className="oh-door-join">
                    <span className="oh-door-join-label">{t(COPY.joinLabel, locale)}</span>{" "}
                    {t(selectedClub.join, locale)}
                  </p>
                ) : null}
                <div className="oh-door-foot">
                  {selectedClub.joinOpen ? (
                    <span className="oh-door-open">{t(COPY.joinOpen, locale)}</span>
                  ) : null}
                  {selectedClub.link ? (
                    <ExternalLink
                      href={selectedClub.link.url}
                      newTabLabel={t(COPY.newTab, locale)}
                      className="focus-highlight"
                    >
                      {selectedClub.link.label}
                    </ExternalLink>
                  ) : (
                    <Link href={localeHref(locale, `/clubs/${selectedClub.slug}`)}>
                      {t(COPY.clubsAll, locale)} ↗
                    </Link>
                  )}
                </div>
              </article>
            ) : null}
          </div>

          <p className="oh-wall-all">
            <Link href={localeHref(locale, "/clubs")}>{t(COPY.clubsAll, locale)} ↗</Link>
          </p>
        </div>
      </section>

      {/* 17:48 The campus changes */}
      <section id="oh-dusk" data-scene className="oh-scene oh-dusk">
        <div className="oh-measure">
          <p className="oh-dusk-line oh-reveal" data-reveal>
            {t(COPY.duskLine, locale)}
          </p>
        </div>
      </section>

      {/* 18:11 Getting home */}
      <section id="oh-home" data-scene className="oh-scene">
        <div className="oh-measure">
          <p className="oh-kicker oh-reveal" data-reveal>
            <span className="oh-time">{t(COPY.homeTime, locale)}</span> ·{" "}
            {t(COPY.homeKicker, locale)}
          </p>
          <h2 className="oh-heading oh-reveal" data-reveal data-delay="1">
            {t(COPY.homePrompt, locale)}
          </h2>
          {selectedArrive ? (
            <p className="oh-home-callback oh-reveal" data-reveal data-delay="1">
              {t(COPY.homeArrived, locale)} {t(selectedArrive.label, locale).toLowerCase()}.
            </p>
          ) : null}
          <div className="oh-reveal" data-reveal data-delay="2">
            <HomeBoard locale={locale} />
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
            <FieldNote locale={locale} name={name} entries={entries} />
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
          {anyChoice ? (
            <button
              type="button"
              className="oh-restart oh-reveal"
              data-reveal
              onClick={() => {
                setArrive(undefined);
                setCourse(undefined);
                setLunch(undefined);
                setClub(undefined);
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
