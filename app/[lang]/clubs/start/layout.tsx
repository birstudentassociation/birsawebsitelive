import { redirectIfClosed } from "@/lib/closures";

/** Sends visitors to the "Service unavailable" page while this service is switched off (lib/closures.ts). */
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  await redirectIfClosed("start-club", lang);
  return children;
}
