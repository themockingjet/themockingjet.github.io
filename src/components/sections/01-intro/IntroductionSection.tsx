import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import Badge from "@components/ui/Badge";
import { INTRODUCTION_DATA } from "@data/01-introduction";

interface IntroductionSectionProps {
  id: string;
  className?: string;
}

const IntroductionSection: React.FC<IntroductionSectionProps> = ({
  id,
  className,
}) => {
  return (
    <section
      id={id}
      className={twMerge(
        clsx("flex h-screen snap-center flex-col justify-center", className),
      )}
    >
      <h1 className="text-4xl font-bold text-white lg:text-7xl">
        {INTRODUCTION_DATA.title}
      </h1>
      <div className="mt-2 flex space-x-4 text-gray-300">
        <Badge
          type="text"
          icon={INTRODUCTION_DATA.coutryBadge.icon}
          label={INTRODUCTION_DATA.coutryBadge.label}
        />
        <Badge
          type="link"
          icon={INTRODUCTION_DATA.linkBadge.icon}
          label={INTRODUCTION_DATA.linkBadge.label}
          href={INTRODUCTION_DATA.linkBadge.href}
        />
      </div>
    </section>
  );
};

export default IntroductionSection;
