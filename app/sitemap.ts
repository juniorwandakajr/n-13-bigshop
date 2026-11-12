import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://n-13-bigshop-9fg6.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
