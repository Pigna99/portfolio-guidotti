"use client";

import type { ReactNode } from "react";
import MainNav from "./MainNav";
import SiteCredits from "./SiteCredits";
import SocialIcons from "./SocialIcons";
import TopBar from "./TopBar";

interface Props {
  children: ReactNode;
}

export default function SectionLayout({ children }: Props) {
  return (
    <div className="min-h-screen md:flex md:flex-row">
      <aside className="md:w-2/5 md:max-w-[900px] md:h-screen md:sticky md:top-0 flex flex-col p-6 md:p-10 gap-8 md:gap-10">
        <TopBar />
        <div className="md:flex-1 md:flex md:flex-col md:justify-start">
          <MainNav />
        </div>
        <div className="hidden md:flex md:flex-col md:gap-3">
          <SocialIcons />
          <SiteCredits />
        </div>
      </aside>

      <main className="flex-1 md:h-screen md:overflow-y-auto p-6 md:p-10">
        {children}
      </main>

      <div className="md:hidden p-6 pt-0 flex flex-col gap-3">
        <SocialIcons />
        <SiteCredits />
      </div>
    </div>
  );
}
