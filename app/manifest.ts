import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BIRSA Portal",
    short_name: "BIRSA",
    description:
      "The official portal of the BIR Student Association, Faculty of Political Science, Thammasat University.",
    id: "/",
    lang: "th",
    // Straight to the default locale, so launching the app skips the redirect.
    start_url: "/th",
    scope: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#d81f26",
    icons: [
      { src: "/icon.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/birsa-logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
