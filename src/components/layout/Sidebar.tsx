import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import SideDot from "@components/ui/SideDot";

interface SidebarProps {
  sectionIds: string[];
  numOfSections: number;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  className,
  numOfSections,
  sectionIds,
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const elems: HTMLElement[] = [];
    for (let i = 0; i < numOfSections; i++) {
      const el = document.getElementById(sectionIds[i]);
      if (el) elems.push(el);
    }

    if (elems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with largest intersectionRatio that's intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const idx = elems.indexOf(visible.target as HTMLElement);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      { root: null, rootMargin: "0px", threshold: [0.25, 0.5, 0.75] },
    );

    elems.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [numOfSections, sectionIds]);

  return (
    <div className={twMerge(clsx("z-10", className))}>
      <div className="flex flex-col items-center space-y-8">
        {Array.from({ length: numOfSections }).map((_, i) => (
          <SideDot
            key={i}
            label={`Go to section ${i + 1}`}
            link={`#${sectionIds[i]}`}
            active={i === activeIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
