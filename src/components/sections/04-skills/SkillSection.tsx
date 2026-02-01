import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import { SKILL_DATA } from "@data/04-skill";
import Badge from "@components/ui/Badge";

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
      className={twMerge(
        clsx("flex w-full flex-col md:mb-24 lg:mb-48", className),
      )}
    >
      <h2 className="section-title mb-12 text-3xl font-bold">Skills</h2>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-6 text-center text-xl font-medium text-gray-200 capitalize md:text-start">
              {category}
            </h3>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
              {SKILL_DATA.filter((skill) => skill.category === category).map(
                (skill) => (
                  <div key={skill.name} className="flex items-center space-x-2">
                    <Badge
                      type="text"
                      icon={skill.icon}
                      label={skill.name}
                      iconClassName="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8"
                    />
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
