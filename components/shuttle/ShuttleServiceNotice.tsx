/**
 * Announcement banner for the current change to shuttle service, e.g. the
 * reduced Sanam Chai Line rush hour service after an accident.
 *
 * The copy lives in `serviceModification` in `lib/shuttle.ts`, which is also
 * what flags the affected lines on `ShuttleTimer`. Nothing is rendered when
 * that is `undefined`, which is the normal state.
 */
import WarningText from "@/components/WarningText";
import type { Locale } from "@/lib/i18n";
import { serviceModification } from "@/lib/shuttle";

export type ShuttleServiceNoticeProps = {
  locale: Locale;
};

export default function ShuttleServiceNotice({ locale }: ShuttleServiceNoticeProps) {
  if (!serviceModification) return null;

  return (
    <WarningText locale={locale} title={serviceModification.title[locale]}>
      <p className="mb-2">{serviceModification.body[locale]}</p>
      <p>{serviceModification.alternatives[locale]}</p>
    </WarningText>
  );
}
