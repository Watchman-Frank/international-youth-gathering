import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prayer & Prophetic Party",
  description: "IYG's recurring intercessory gathering on US federal holidays — join online for prayer, prophetic declarations, and Spirit-led worship.",
};

export default function PrayerPartyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
