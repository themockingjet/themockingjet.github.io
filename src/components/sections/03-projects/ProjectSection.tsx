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
        clsx("flex h-screen w-full snap-center flex-col py-8", className),
      )}
    >
      <h2 className="mb-8 text-3xl font-bold">
        <span className="bg-linear-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
          Projects
        </span>
      </h2>
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
