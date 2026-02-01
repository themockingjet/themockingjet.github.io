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
        clsx(
          "flex flex-col items-center justify-center pt-24 md:items-start md:pt-36 lg:h-dvh lg:pt-0",
          className,
        ),
      )}
    >
      <div className="flex flex-col items-center md:block">
        <h1 className="text-4xl font-bold lg:text-7xl">
          {INTRODUCTION_DATA.title}
        </h1>
        <h2 className="text-blue-400">{INTRODUCTION_DATA.position}</h2>
      </div>
      <div className="mt-2 flex space-x-4">
        <Badge
          type="text"
          icon={INTRODUCTION_DATA.countryBadge.icon}
          label={INTRODUCTION_DATA.countryBadge.label}
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
