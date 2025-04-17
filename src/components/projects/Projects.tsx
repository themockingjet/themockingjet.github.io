import { ProjectTags } from "./ProjectTags";
import { projectList } from "./projectList";

export const Projects = () => {
    return (
        <section id="projects" className="w-full py-20">
            <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                    Projects
                </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projectList.map((project, index) => (
                    <div
                        key={index}
                        className="bg-slate-900/30 backdrop-blur-sm rounded-xl overflow-hidden border-l-2 border-transparent hover:border-l-sky-500 transition-all duration-300 shadow-lg hover:shadow-sky-500/10"
                    >
                        <div className="p-6 h-full flex flex-col">
                            <div className="flex items-center mb-2">
                                <h3 className="text-xl font-semibold text-white">
                                    {project.name}
                                </h3>
                                {project.status && (
                                    <span
                                        className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                                            project.status === "beta"
                                                ? "bg-blue-900/40 text-blue-300"
                                                : project.status === "deprecated"
                                                ? "bg-red-900/40 text-red-300"
                                                : ""
                                        }`}
                                    >
                                        {project.status}
                                    </span>
                                )}
                            </div>
                            <p className="text-slate-400 text-sm mb-5 flex-grow">
                                {project.description}
                            </p>
                            <div className="mt-auto">
                                <ProjectTags tags={project.tags} />
                                {project.url && (
                                    <div className="mt-4 pt-3 border-t border-slate-800/70">
                                        <a
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group text-sky-400 hover:text-sky-300 text-sm font-medium flex items-center"
                                        >
                                            {project.urlTitle || "View Project"}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
