"use client";

import Carousel from "./Carousel";
import MainNav from "./MainNav";
import SiteCredits from "./SiteCredits";
import SocialIcons from "./SocialIcons";
import TopBar from "./TopBar";

export default function HomePage() {
  return (
    <div className="min-h-screen md:flex md:flex-row">
      <aside className="md:w-2/5 md:max-w-[900px] md:h-screen md:sticky md:top-0 flex flex-col p-6 md:p-10 gap-8">
        <TopBar />
        <div className="hidden md:flex flex-1 flex-col justify-center">
          <MainNav />
        </div>
        <div className="hidden md:flex md:flex-col md:gap-3">
          <SocialIcons />
          <SiteCredits />
        </div>
      </aside>

      <main className="flex-1 md:h-screen">
        <Carousel />
      </main>

      <div className="md:hidden flex flex-col gap-6 p-6">
        <MainNav />
        <SocialIcons />
        <SiteCredits />
      </div>
    </div>
  );
}
