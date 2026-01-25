import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import Sidebar from "./Sidebar";
import Fireflies from "@components/effects/Fireflies";

interface AppLayoutProps {
  className?: string;
  children?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  const [sectionCount, setSectionCount] = React.useState(0);
  const [sectionIds, setSectionIds] = React.useState<string[]>([]);

  const getSectionElements = (
    children: React.ReactNode,
  ): { count: number; ids: string[] } => {
    const ids: string[] = [];
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;

      const id = (child as React.ReactElement<{ id?: string }>).props?.id;
      if (typeof id === "string" && id.trim() !== "") {
        ids.push(id);
      }
    });
    return { count: ids.length, ids };
  };

  useEffect(() => {
    const { count, ids } = getSectionElements(children);
    setSectionCount(count);
    setSectionIds(ids);
  }, [children]);

  return (
    <div
      className={twMerge(
        clsx(
          "relative h-screen min-h-screen w-full antialiased select-none md:flex-row",
          className,
        ),
      )}
    >
      <Sidebar
        className="fixed top-1/2 right-0 hidden -translate-y-1/2 md:mr-8 md:block lg:mr-16"
        numOfSections={sectionCount}
        sectionIds={sectionIds}
      />
      <main className="relative">
        <Fireflies />
        <div className="container mx-auto flex flex-col scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
