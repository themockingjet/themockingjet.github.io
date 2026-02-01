import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import ProjectItem from "./ProjectItem";
import { PROJECT_DATA } from "@data/03-project";

interface ProjectSectionProps {
  id: string;
  className?: string;
}

const ProjectSection: React.FC<ProjectSectionProps> = ({ id, className }) => {
  return (
    <section
      id={id}
      className={twMerge(
        clsx(
          "flex min-h-screen w-full flex-col justify-center pt-24 md:pt-36 lg:h-dvh lg:pt-0",
          className,
        ),
      )}
    >
      <h2 className="section-title mb-8 text-3xl font-bold">Projects</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {PROJECT_DATA.map((project, index) => (
          <ProjectItem
            key={index}
            name={project.name}
            status={project.status}
            description={project.description}
            tags={project.tags}
            link={project.url}
            linkTitle={project.urlTitle}
          />
        ))}
      </div>
    </section>
  );
};

export default ProjectSection;
