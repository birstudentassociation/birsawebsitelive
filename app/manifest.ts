import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BIRSA Portal",
    short_name: "BIRSA",
    description:
      "News, activities, clubs and a student-life guide from the BIR Student Association, Thammasat University.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#d81f26",
    icons: [
      {
        src: "/birsa-logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
