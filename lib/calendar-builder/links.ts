/** Per-app action links for subscribing to a feed URL. Pure string building. */

export type FeedLinks = {
  /** Apple Calendar and classic Outlook. */
  webcal: string;
  google: string;
  /** Outlook on the web and new Outlook, personal accounts. */
  outlookLive: string;
  /** Outlook on the web, work or school accounts. */
  outlookOffice: string;
  /** The feed URL with `download=1`, served as an attachment. */
  download: string;
};

/** Replaces an http(s) scheme with `webcal:`. */
export function toWebcal(httpsUrl: string): string {
  return httpsUrl.replace(/^https?:/i, "webcal:");
}

/** The same URL with `download=1` set. */
export function downloadUrl(httpsUrl: string): string {
  const url = new URL(httpsUrl);
  url.searchParams.set("download", "1");
  return url.toString();
}

/** Builds every link from the https feed URL and the calendar's display name. */
export function buildFeedLinks(httpsUrl: string, name: string): FeedLinks {
  const webcal = toWebcal(httpsUrl);
  const outlook = (origin: string) =>
    `${origin}/calendar/0/addfromweb?url=${encodeURIComponent(httpsUrl)}&name=${encodeURIComponent(name)}`;
  return {
    webcal,
    google: `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcal)}`,
    outlookLive: outlook("https://outlook.live.com"),
    outlookOffice: outlook("https://outlook.office.com"),
    download: downloadUrl(httpsUrl),
  };
}
