import Card, { CardTitle } from "@/components/bds/Card";
import Email from "@/components/bds/Email";
import { Stack } from "@/components/bds/Layout";
import { Text } from "@/components/bds/Type";
import { getPortfolio, type PortfolioId } from "@/lib/portfolios";
import type { Locale } from "@/lib/i18n";

/**
 * BIRSA Design System: `ContactPanelSection` (REDESIGN-2.0 §4.6, media
 * cluster).
 *
 * Renders the `contact-panel` entry of `components/bds/sectionPalette.ts`:
 * a portfolio's contact details, pulled from one place, through `Card`
 * (content cluster, already built). "The details are never typed in
 * twice" (`sectionPalette.ts`) is why `title` comes from
 * `getPortfolio(portfolioId)` (`lib/portfolios.ts`, frozen) rather than
 * being typed in by an officer: the portfolio label is the one source, so a
 * portfolio rename changes every contact panel that references it instead
 * of needing to be re-typed on each one.
 *
 * `lib/portfolios.ts` carries the portfolio VOCABULARY (id, label, who
 * holds it), not contact details: there is no email or phone field there
 * today, and adding one is not this cluster's file to touch. The actual
 * contact fields (`email`, `phone`, `officeHours`) are CMS-authored content
 * this component receives as plain props, the same way `Figure` receives an
 * already-resolved image source rather than resolving one itself.
 */
export type ContactPanelSectionProps = {
  portfolioId: PortfolioId;
  locale: Locale;
  email?: string;
  phone?: string;
  officeHours?: string;
};

export default function ContactPanelSection({
  portfolioId,
  locale,
  email,
  phone,
  officeHours,
}: ContactPanelSectionProps) {
  const portfolio = getPortfolio(portfolioId);

  return (
    <Card>
      <CardTitle>{portfolio.label[locale]}</CardTitle>
      <Stack gap="xs">
        {email ? (
          <Text step="body-sm" className="text-muted">
            <Email address={email} />
          </Text>
        ) : null}
        {phone ? (
          <Text step="body-sm" className="text-muted">
            {phone}
          </Text>
        ) : null}
        {officeHours ? (
          <Text step="body-sm" className="text-muted">
            {officeHours}
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
