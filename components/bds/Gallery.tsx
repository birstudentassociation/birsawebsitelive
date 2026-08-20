"use client";

/**
 * BIRSA Design System: `Gallery` (REDESIGN-2.0 §4.7B, media cluster).
 *
 * An ordered set of images with a lightbox. THE ONE TO BE CAREFUL WITH: a
 * lightbox is a modal, so it needs focus trapping, an escape route, and a
 * non-JavaScript fallback that is simply the images in a list.
 *
 * MODELLED ON `ConfirmDialog` / `useConfirmDialog`, as instructed: the
 * lightbox is a native `<dialog>` shown with `showModal()`, which gives a
 * focus trap and top-layer stacking for free, and the native `cancel` event
 * (fired on Escape) gives Escape handling for free. `onClick` closes on a
 * backdrop click the same way `ConfirmDialog` does: a click landing on the
 * `<dialog>` element itself, rather than one of its children, is a click on
 * the `::backdrop` area, because the dialog box is sized to its content.
 *
 * THE NO-JAVASCRIPT FALLBACK, AND WHY IT ACTUALLY WORKS RATHER THAN JUST
 * CLAIMING TO. Every thumbnail is a real `<a href>` pointing straight at the
 * full-size image source, not a `<button>` with an `onClick` and nothing
 * else. Next.js server-renders a client component's initial markup the same
 * as any other, so that `href` is present in the HTML the browser gets
 * before a single script runs. With JavaScript: a plain, unmodified left
 * click is intercepted (`preventDefault`, open the lightbox); a modified
 * click (Ctrl, Cmd, Shift, Alt, or a non-primary button) is left alone, so
 * "open in new tab" and every other native link behaviour still works
 * exactly as a reader expects. Without JavaScript: nothing intercepts the
 * click, so the anchor does what an anchor always does and navigates to the
 * image. That is "simply the images in a list": a real list of real links to
 * real images, keyboard- and screen-reader-operable with no script running
 * at all, which is a stronger fallback than an inert thumbnail would be and
 * is why this component ships the lightbox rather than "the list and no
 * lightbox" (this file's brief allows shipping just the list "if you cannot
 * make the no-JS fallback work properly"; it does work, so both ship).
 *
 * The `<dialog>` itself never appears in that no-JS markup in any useful
 * way: it starts with no `open` attribute and nothing ever calls
 * `showModal()` without JavaScript, so it stays inert and invisible rather
 * than rendering a broken half-open modal.
 *
 * Every thumbnail and the enlarged image share `Figure`'s validation gate
 * and ratio map, so an invalid `ImageField` fails exactly as loudly here as
 * anywhere else in this cluster (`assertValidImage`, `Figure.tsx`).
 */
import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";

import {
  assertValidImage,
  ratioClassName,
  resolveAlt,
  resolveCaption,
  type ImageSource,
} from "@/components/bds/Figure";
import Icon from "@/components/bds/Icon";
import { Text } from "@/components/bds/Type";
import VisuallyHidden from "@/components/bds/VisuallyHidden";
import type { ImageField } from "@/components/bds/imageContract";
import type { Locale } from "@/lib/i18n";

export type GalleryItem = {
  image: ImageField;
  source: ImageSource;
};

/**
 * Every user-facing string `Gallery` needs. This cluster owns no dictionary
 * namespace (see this cluster's report), so a caller supplies these,
 * typically from the `a11y` or `chrome` namespace another cluster owns.
 * `positionLabel` is a function rather than a fixed string because English
 * and Thai order and punctuate "image 3 of 8" differently and this
 * component has no dictionary of its own to hold a per-locale template.
 */
export type GalleryLabels = {
  close: string;
  previous: string;
  next: string;
  /** e.g. (3, 8) => "Image 3 of 8" / "รูปที่ 3 จาก 8". Used as the dialog's accessible name and as a fallback link name for a decorative gallery item. */
  positionLabel: (position: number, total: number) => string;
};

export type GalleryProps = {
  items: GalleryItem[];
  locale: Locale;
  labels: GalleryLabels;
  className?: string;
};

export default function Gallery({ items, locale, labels, className }: GalleryProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeIndex !== null && !dialog.open) {
      dialog.showModal();
    } else if (activeIndex === null && dialog.open) {
      dialog.close();
    }
  }, [activeIndex]);

  function close() {
    setActiveIndex(null);
  }

  function step(delta: number) {
    setActiveIndex((current) => {
      if (current === null || items.length === 0) return current;
      return (current + delta + items.length) % items.length;
    });
  }

  function openAt(index: number, event: React.MouseEvent<HTMLAnchorElement>) {
    // Leave every modified or non-primary click alone: Ctrl/Cmd-click,
    // Shift-click and middle-click all keep their native "open elsewhere"
    // behaviour, exactly as a reader expects from a real link.
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setActiveIndex(index);
  }

  const active = activeIndex !== null ? items[activeIndex] : undefined;
  const activeValid = active ? assertValidImage(active.image, "Gallery") : false;
  const activeCaption = active ? resolveCaption(active.image, locale) : undefined;

  return (
    <div className={clsx("flex flex-col gap-4", className)}>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item, index) => {
          const valid = assertValidImage(item.image, "Gallery");
          const alt = resolveAlt(item.image, locale);
          const accessibleName = alt || labels.positionLabel(index + 1, items.length);
          return (
            <li key={item.image.assetId}>
              <a
                href={item.source.src}
                onClick={(event) => openAt(index, event)}
                aria-label={item.image.decorative ? accessibleName : undefined}
                className="focus-halo group block overflow-hidden rounded-lg border border-line bg-sunken"
              >
                <span className={clsx("relative block", ratioClassName[item.image.ratio])}>
                  {valid ? (
                    <Image
                      src={item.source.src}
                      alt={item.image.decorative ? "" : alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-150 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby={active ? titleId : undefined}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "ArrowRight") step(1);
        }}
        className="m-auto w-[min(64rem,calc(100vw-2rem))] rounded-lg border border-line bg-surface p-0 shadow-lg backdrop:bg-ink/70"
      >
        {active ? (
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between gap-3">
              <VisuallyHidden>
                <h2 id={titleId}>
                  {resolveAlt(active.image, locale) ||
                    labels.positionLabel(activeIndex! + 1, items.length)}
                </h2>
              </VisuallyHidden>
              <span role="status" className="sr-only">
                {labels.positionLabel(activeIndex! + 1, items.length)}
              </span>
              <div className="ml-auto flex items-center gap-1">
                {items.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => step(-1)}
                      className="focus-halo flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-sunken"
                    >
                      <Icon name="chevron-left" />
                      <VisuallyHidden>{labels.previous}</VisuallyHidden>
                    </button>
                    <button
                      type="button"
                      onClick={() => step(1)}
                      className="focus-halo flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-sunken"
                    >
                      <Icon name="chevron-right" />
                      <VisuallyHidden>{labels.next}</VisuallyHidden>
                    </button>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={close}
                  className="focus-halo flex h-11 w-11 items-center justify-center rounded-md text-ink hover:bg-sunken"
                >
                  <Icon name="circle-x" />
                  <VisuallyHidden>{labels.close}</VisuallyHidden>
                </button>
              </div>
            </div>
            <div
              className={clsx(
                "relative overflow-hidden rounded-md bg-sunken",
                ratioClassName[active.image.ratio]
              )}
            >
              {activeValid ? (
                <Image
                  src={active.source.src}
                  alt={resolveAlt(active.image, locale)}
                  fill
                  sizes="90vw"
                  className="object-contain"
                />
              ) : null}
            </div>
            {!active.image.decorative && (activeCaption || active.image.credit) ? (
              <div className="flex flex-col gap-0.5">
                {activeCaption ? (
                  <Text as="p" step="body-sm" className="text-muted">
                    {activeCaption}
                  </Text>
                ) : null}
                {active.image.credit ? (
                  <Text as="p" step="body-sm" className="text-muted">
                    {active.image.credit}
                  </Text>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
