import React, { useEffect, useRef, useState } from "react";
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
  const activeIndexRef = useRef<number>(0);
  const prevDistRef = useRef<number>(Infinity);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const elems: HTMLElement[] = [];
    for (let i = 0; i < numOfSections; i++) {
      const el = document.getElementById(sectionIds[i]);
      if (el) elems.push(el);
    }

    if (elems.length === 0) return;

    const observer = new IntersectionObserver(
      () => {
        if (typeof window === "undefined") return;

        const HYSTERESIS = 60; // pixels
        const viewportCenter = window.innerHeight / 2;
        let closestIdx = -1;
        let minDist = Infinity;

        elems.forEach((el, idx) => {
          const rect = el.getBoundingClientRect();
          const elCenter = rect.top + rect.height / 2;
          const dist = Math.abs(elCenter - viewportCenter);
          if (dist < minDist) {
            minDist = dist;
            closestIdx = idx;
          }
        });

        if (closestIdx === -1) return;

        const currentIdx = activeIndexRef.current;
        const prevDist = prevDistRef.current;

        const acceptIfSignificantlyCloser = minDist + HYSTERESIS < prevDist;
        const acceptIfNearCenter = minDist < window.innerHeight * 0.12;

        if (closestIdx === currentIdx) {
          prevDistRef.current = minDist;
          return;
        }

        if (acceptIfSignificantlyCloser || acceptIfNearCenter) {
          setActiveIndex(closestIdx);
          activeIndexRef.current = closestIdx;
          prevDistRef.current = minDist;
        }
      },
      { root: null, rootMargin: "0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
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
