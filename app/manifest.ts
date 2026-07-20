import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BIRSA Portal",
    short_name: "BIRSA",
    description:
      "The official portal of the BIR Student Association, Faculty of Political Science, Thammasat University.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#d81f26",
    icons: [
      {
        src: "/birsa-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
