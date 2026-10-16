import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // The Open House share image lives under /api/ and must stay fetchable
      // for link previews; the longer Allow wins over the shorter Disallow.
      allow: ["/", "/api/openhouse-card"],
      disallow: ["/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
