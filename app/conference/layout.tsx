import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "God-Life Conference",
  description: "IYG's flagship annual gathering — days of worship, apostolic teaching, and prophetic activation. Join us in person or online.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
