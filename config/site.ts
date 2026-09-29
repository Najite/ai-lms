/**
 * Site Metadata & Global Academy Configuration
 */
export const siteConfig = {
  name: "AI-Native Software Engineering Academy",
  shortName: "AI Academy",
  description: "Enterprise-grade, AI-native software engineering academy transforming complete beginners into autonomous L4/L5 engineers.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    github: "https://github.com/academy/lms",
    docs: "/docs",
  },
  creator: "AI-Native Academy Council",
} as const;

export type SiteConfig = typeof siteConfig;
