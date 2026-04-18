import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CommunityStats } from "@/components/CommunityStats";
import { ScreeningsPreview } from "@/components/ScreeningsPreview";
import { EventsPreview } from "@/components/EventsPreview";
import { Footer } from "@/components/Footer";
import { WelcomePopup } from "@/components/WelcomePopup";

export type CommunityFilter = "all" | "cinema" | "anime";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cinema EZ & Anime EZ — Ahmedabad's Film & Anime Community" },
      { name: "description", content: "Join Ahmedabad's premier cinephile and anime community. Exclusive screenings, events, cosplay meetups, and more." },
      { property: "og:title", content: "Cinema EZ & Anime EZ — Ahmedabad" },
      { property: "og:description", content: "Ahmedabad's premier film & anime community with exclusive screenings and events." },
    ],
  }),
  component: Index,
});

function Index() {
  const [filter, setFilter] = useState<CommunityFilter>("all");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WelcomePopup />
      <HeroSection filter={filter} onFilter={setFilter} />
      <CommunityStats />
      <ScreeningsPreview filter={filter} />
      <EventsPreview filter={filter} />
      <Footer />
    </div>
  );
}
