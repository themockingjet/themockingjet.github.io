import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { Icon } from "@iconify/react";

import { SKILL_DATA } from "@data/04-skill";

interface SkillSectionProps {
  id: string;
  className?: string;
}

const SkillSection: React.FC<SkillSectionProps> = ({ id, className }) => {
  const categories = Array.from(
    new Set(SKILL_DATA.map((skill) => skill.category)),
  );

  return (
    <section
      id={id}
      className={twMerge(clsx("mb-12 flex w-full flex-col py-8", className))}
    >
      <h2 className="mb-12 text-3xl font-bold">
        <span className="bg-linear-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          Skills
        </span>
      </h2>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-6 text-xl font-medium text-gray-200 capitalize">
              {category}
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {SKILL_DATA.filter((skill) => skill.category === category).map(
                (skill) => (
                  <div key={skill.name} className="flex items-center space-x-2">
                    <Icon
                      inline
                      icon={skill.icon}
                      className={twMerge("h-8 w-8", skill.iconClassName)}
                    />
                    <span className="ml-2">{skill.name}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SkillSection;
