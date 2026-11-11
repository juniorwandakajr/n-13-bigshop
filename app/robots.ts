import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
    return {
        rules: { userAgent: "*", allow: "/"},
        sitemap: "https://n-13-bigshop.vercel.app/sitemap.xml",
    };
}