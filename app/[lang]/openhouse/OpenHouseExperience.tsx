"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import { localeHref, formatDate, type Locale } from "@/lib/i18n";
import type { CuratedCourse, LunchDirection } from "@/lib/openhouse";
import { ARRIVE_MODES, COPY, HOME_ROUTES, OPEN_HOUSE, t } from "@/content/openhouse/copy";
import { CLUBS, TEXTURE_LABELS } from "@/content/openhouse/clubs";
import RiverLine from "./RiverLine";
import ArrivalMap from "./ArrivalMap";
import HomeBoard from "./HomeBoard";
import FieldNoteCanvas, {
  FIELDNOTE_CANVAS_ID,
  type FieldNoteEntry,
  type FieldNoteText,
} from "./FieldNoteCanvas";

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

const mapsHref = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/** The breadth of the wall in one line, in the order the activities first appear. */
const TEXTURES_IN_ORDER = Array.from(new Set(CLUBS.map((c) => c.texture)));

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
  const home = arrive ? HOME_ROUTES[arrive] : undefined;
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
    if (home)
      out.push({ time: "18:11", label: t(COPY.fnHome, locale), value: t(home.card, locale) });
    return out;
  }, [selectedArrive, selectedCourse, selectedLunch, selectedClub, home, locale]);

  const cardText = useMemo<FieldNoteText>(
    () => ({
      kicker: locale === "th" ? t(COPY.eyebrow, locale) : t(COPY.eyebrow, locale).toUpperCase(),
      edition: "OPEN HOUSE 2026",
      title: t(COPY.daySubtitle, locale),
      date: formatDate(locale, OPEN_HOUSE.dateISO),
      keptBy: t(COPY.cardFor, locale),
      empty: t(COPY.dayEmpty, locale),
      place: t(COPY.cardPlace, locale),
      campus: locale === "th" ? "ท่าพระจันทร์" : "Tha Prachan",
    }),
    [locale]
  );

  const cardLabel = useMemo(() => {
    const who = name.trim() ? `${name.trim()}. ` : "";
    const lead =
      locale === "th"
        ? `${who}การ์ดวัน Open House ของ BIR ท่าพระจันทร์ 31 ตุลาคม 2026`
        : `${who}BIR Tha Prachan Open House day card, 31 October 2026`;
    const body = entries.map((e) => `${e.time} ${e.label} ${e.value}`).join("; ");
    return body ? `${lead}. ${body}` : lead;
  }, [entries, name, locale]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (animate) root.classList.add("oh-animate");

    const revealObserver = animate
      ? new IntersectionObserver(
          (items) => {
            for (const e of items) {
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
      (items) => {
        for (const e of items) {
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
        // The fixed folio takes night tokens only once the dusk gradient has
        // actually turned dark behind it, and hands them back as the invitation
        // returns to daylight. Set on the DOM directly so React never owns it.
        const dusk = document.getElementById("oh-dusk")?.getBoundingClientRect();
        const invite = document.getElementById("oh-invite")?.getBoundingClientRect();
        const mid = window.innerHeight / 2;
        const night =
          !!dusk && !!invite && dusk.top + dusk.height * 0.55 < mid && invite.top + 96 > mid;
        if (night) root.dataset.night = "";
        else delete root.dataset.night;
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

  const cardBlob = useCallback(
    () =>
      new Promise<Blob | null>((resolve) => {
        const canvas = document.getElementById(FIELDNOTE_CANVAS_ID) as HTMLCanvasElement | null;
        if (!canvas) return resolve(null);
        canvas.toBlob((b) => resolve(b), "image/png");
      }),
    []
  );

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast(t(COPY.copied, locale));
    } catch {
      showToast(window.location.href);
    }
  }, [locale, showToast]);

  const share = useCallback(async () => {
    const url = window.location.href;
    const blob = await cardBlob();
    const file = blob ? new File([blob], "bir-open-house.png", { type: "image/png" }) : null;
    try {
      if (file && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "BIR Open House", url });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "BIR Open House", url });
        return;
      }
    } catch {
      return;
    }
    void copyLink();
  }, [cardBlob, copyLink]);

  const saveCard = useCallback(async () => {
    const blob = await cardBlob();
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "bir-open-house.png";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }, [cardBlob]);

  const anyChoice = !!(arrive || course || lunch || club);
  const newTab = t(COPY.newTab, locale);

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
                  s.name ? `${t(s.label, locale)}, ${t(s.name, locale)}` : t(s.label, locale)
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
        <div className="oh-arrival-grid">
          <div className="oh-arrival-body">
            <p className="oh-kicker oh-reveal" data-reveal>
              {t(COPY.eyebrow, locale)}
            </p>
            <p className="oh-kicker oh-kicker-sub oh-reveal" data-reveal data-delay="1">
              {t(COPY.event, locale)}
            </p>
            <h1 className="oh-display oh-reveal" data-reveal data-delay="1">
              {t(COPY.headline, locale)}
            </h1>
            <p className="oh-arrival-sub oh-reveal" data-reveal data-delay="2">
              {t(COPY.sub, locale)}
            </p>
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
          </div>
          <RiverLine locale={locale} />
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
            {ARRIVE_MODES.map((m) => (
              <button
                key={m.key}
                type="button"
                className="oh-mode"
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

          <ol className="oh-index" aria-label={t(COPY.classHint, locale)}>
            {courses.map((c) => {
              const open = c.code === course;
              const panelId = `oh-teaser-${c.code}`;
              return (
                <li key={c.code} className="oh-index-item" data-open={open || undefined}>
                  <button
                    type="button"
                    className="oh-index-row"
                    aria-pressed={open}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(setCourse)(c.code)}
                  >
                    <span className="oh-index-code">{c.code}</span>
                    <span className="oh-index-title">{t(c.title, locale)}</span>
                    <span className="oh-index-field">{t(c.field, locale)}</span>
                  </button>
                  <div id={panelId} className="oh-teaser" hidden={!open}>
                    {open ? (
                      <>
                        <p className="oh-teaser-hook">{t(c.teaser.hook, locale)}</p>
                        <p className="oh-teaser-opens">{t(c.teaser.opens, locale)}</p>
                        <p className="oh-teaser-label">{t(COPY.keyIdeas, locale)}</p>
                        <ul className="oh-tags">
                          {c.teaser.thinkers.map((idea, k) => (
                            <li key={k} className="oh-tag">
                              {t(idea, locale)}
                            </li>
                          ))}
                        </ul>
                        <p className="oh-teaser-takeaway">{t(c.teaser.takeaway, locale)}</p>
                        <p className="oh-teaser-link">
                          <Link href={localeHref(locale, "/services/study-plan/curriculum")}>
                            {t(COPY.curriculumLink, locale)}
                          </Link>
                        </p>
                      </>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
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
            {lunchDirections.map((d) => (
              <button
                key={d.key}
                type="button"
                className="oh-direction"
                aria-pressed={d.key === lunch}
                aria-expanded={d.key === lunch}
                aria-controls="oh-places"
                onClick={() => toggle(setLunch)(d.key)}
              >
                <span className="oh-direction-label">{t(d.label, locale)}</span>
                <span className="oh-direction-blurb">{t(d.blurb, locale)}</span>
              </button>
            ))}
          </div>

          <div id="oh-places" className="oh-places-slot" aria-live="polite">
            {selectedLunch ? (
              <div key={selectedLunch.key} className="oh-places">
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
                        newTabLabel={newTab}
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
                    {t(COPY.lunchMapLink, locale)}
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
          <ol className="oh-questions">
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
          </ol>
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
        </div>

        <div className="oh-wall-wrap">
          <p className="oh-wall" role="group" aria-label={t(COPY.clubsPrompt, locale)}>
            {CLUBS.map((c, i) => (
              <Fragment key={c.slug}>
                <span className="oh-wall-item">
                  <button
                    type="button"
                    className="oh-wall-name"
                    data-feature={c.feature ? true : undefined}
                    aria-pressed={c.slug === club}
                    aria-expanded={c.slug === club}
                    aria-controls="oh-door"
                    onClick={() => toggle(setClub)(c.slug)}
                  >
                    {t(c.name, locale)}
                  </button>
                  {i < CLUBS.length - 1 ? (
                    <span className="oh-wall-sep" aria-hidden="true">
                      {" /"}
                    </span>
                  ) : null}
                </span>{" "}
              </Fragment>
            ))}
          </p>
          <p className="oh-wall-breadth">
            {TEXTURES_IN_ORDER.map((tx) => t(TEXTURE_LABELS[tx], locale)).join(" · ")}
          </p>
        </div>

        <div className="oh-measure">
          <div id="oh-door" className="oh-door-slot" aria-live="polite">
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
                      newTabLabel={newTab}
                      className="focus-highlight"
                    >
                      {selectedClub.link.label}
                    </ExternalLink>
                  ) : (
                    <Link href={localeHref(locale, `/clubs/${selectedClub.slug}`)}>
                      {t(COPY.clubsAll, locale)}
                    </Link>
                  )}
                </div>
              </article>
            ) : null}
          </div>

          <p className="oh-wall-all">
            <Link href={localeHref(locale, "/clubs")}>{t(COPY.clubsAll, locale)}</Link>
          </p>
        </div>
      </section>

      {/* 17:48 The campus changes */}
      <section id="oh-dusk" data-scene className="oh-scene oh-dusk">
        <div className="oh-measure">
          <p className="oh-dusk-time oh-time" aria-hidden="true">
            {t(COPY.duskTime, locale)}
          </p>
          <p className="oh-dusk-line oh-reveal" data-reveal>
            {t(COPY.duskLine, locale)}
          </p>
        </div>
      </section>

      {/* 18:11 Getting home */}
      <section id="oh-home" data-scene className="oh-scene oh-night">
        <div className="oh-measure">
          <p className="oh-kicker oh-reveal" data-reveal>
            <span className="oh-time">{t(COPY.homeTime, locale)}</span> ·{" "}
            {t(COPY.homeKicker, locale)}
          </p>
          <h2 className="oh-heading oh-reveal" data-reveal data-delay="1">
            {t(COPY.homePrompt, locale)}
          </h2>
          {home ? (
            <p className="oh-lede oh-reveal" data-reveal data-delay="1">
              {t(home.line, locale)}
            </p>
          ) : null}
          <div className="oh-reveal" data-reveal data-delay="2">
            <HomeBoard locale={locale} />
          </div>
        </div>
      </section>

      {/* Your day */}
      <section id="oh-day" data-scene className="oh-scene oh-night oh-day">
        <div className="oh-day-grid">
          <div className="oh-day-intro">
            <p className="oh-kicker oh-reveal" data-reveal>
              {t(COPY.dayKicker, locale)}
            </p>
            <h2 className="oh-heading oh-reveal" data-reveal data-delay="1">
              {t(COPY.daySubtitle, locale)}
            </h2>
            <ol className="sr-only">
              {entries.map((e) => (
                <li key={e.time}>
                  {e.time} {e.label} {e.value}
                </li>
              ))}
            </ol>
          </div>
          <div className="oh-card oh-reveal" data-reveal data-delay="1">
            <FieldNoteCanvas
              locale={locale}
              name={name}
              entries={entries}
              text={cardText}
              label={cardLabel}
            />
          </div>
          <div className="oh-day-controls">
            <div className="oh-namefield">
              <label htmlFor="oh-name">{t(COPY.nameLabel, locale)}</label>
              <input
                id="oh-name"
                type="text"
                value={name}
                maxLength={32}
                autoComplete="off"
                placeholder={t(COPY.namePlaceholder, locale)}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="oh-actions">
              <Button onClick={saveCard} variant="primary">
                {t(COPY.save, locale)}
              </Button>
              <Button onClick={share} variant="secondary">
                {t(COPY.share, locale)}
              </Button>
              <Button onClick={copyLink} variant="ghost">
                {t(COPY.copy, locale)}
              </Button>
            </div>
            <p className="oh-toast" role="status" aria-live="polite">
              {toast}
            </p>
            {anyChoice ? (
              <button
                type="button"
                className="oh-restart"
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
