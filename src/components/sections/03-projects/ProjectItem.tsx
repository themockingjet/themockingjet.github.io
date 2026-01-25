import React from "react";
import Card from "@components/ui/card/Card";
import CardHeader from "@components/ui/card/CardHeader";
import CardBody from "@components/ui/card/CardBody";
import CardFooter from "@components/ui/card/CardFooter";

interface ProjectItemProps {
  name: string;
  status: "beta" | "deprecated" | "active";
  description: string;
  tags: string[];
  link: string;
  linkTitle?: string;
}
const ProjectItem: React.FC<ProjectItemProps> = ({
  name,
  status,
  description,
  tags,
  link,
  linkTitle,
}) => {
  return (
    <Card>
      <div className="flex h-full flex-col p-6">
        <CardHeader>
          <div className="mb-2 flex items-center">
            <h3 className="text-xl font-semibold text-white">{name}</h3>
            {status && (
              <span
                className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                  status === "beta"
                    ? "bg-blue-900/40 text-blue-300"
                    : status === "deprecated"
                      ? "bg-red-900/40 text-red-300"
                      : ""
                }`}
              >
                {status}
              </span>
            )}
          </div>
        </CardHeader>
        <CardBody className="flex-1">
          <p className="mb-5 text-sm text-slate-400">{description}</p>
          <div className="mt-auto flex flex-wrap gap-2 pt-4">
            {tags.map((tag, tagIndex) => (
              <span
                key={tagIndex}
                className="transform rounded-md border border-gray-700/50 bg-gray-800/60 px-2 py-0.5 text-xs text-gray-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-600/50 hover:bg-gray-700/50 hover:text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardBody>
        <CardFooter>
          <a
            href={link}
            target={link === "#" ? "_self" : "_blank"}
            rel="noopener noreferrer"
            className="flex items-center text-sm font-medium text-sky-400 hover:text-sky-300"
          >
            {linkTitle || "View Project"}
          </a>
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProjectItem;
