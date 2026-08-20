import Notice from "@/components/bds/Notice";

/**
 * BIRSA Design System: `NoticeSection` (REDESIGN-2.0 §4.6, media cluster).
 *
 * Renders the `notice` entry of `components/bds/sectionPalette.ts`: an
 * info, success, warning or error callout, through `Notice` (status
 * cluster, already built). `variant` is restricted to those four: `Notice`
 * also has a fifth, `placeholder`, for example content BIRSA has not
 * written yet (BUILD-BRIEF-2.0 §9), which is a content-lifecycle marker, not
 * something an officer chooses when composing a page, so it is deliberately
 * absent from this section's own type.
 *
 * "A page-level result is a `NotificationBanner`, not this" is
 * `sectionPalette.ts`'s own validation note; enforcing it is a CMS-schema
 * and editorial concern (there is nothing at this component's level that
 * distinguishes "inline aside" from "result of an action" once both are
 * just a variant and a string), so it is not re-implemented here.
 */
export type NoticeSectionProps = {
  variant: "info" | "success" | "warning" | "error";
  /** Optional bold lead line above the body. */
  title?: string;
  body: string;
};

export default function NoticeSection({ variant, title, body }: NoticeSectionProps) {
  return (
    <Notice variant={variant} title={title}>
      {body}
    </Notice>
  );
}
