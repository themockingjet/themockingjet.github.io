import { Icon } from "@iconify/react";
import { skillList } from "./skillList";

export const Skills = () => {
    return (
        <section id="projects" className="w-full py-8">
            <h2 className="text-3xl font-bold mb-12 text-center">
                <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
                    Skills
                </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                    <h3 className="text-xl font-medium text-gray-200 mb-6">Programming</h3>
                    <div className="grid grid-cols-2 gap-5">
                        {skillList
                            .filter((item) => item.category === "programming")
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center group transition-all duration-300"
                                >
                                    <Icon icon={item.icon} className="w-5 h-5 mr-3" />
                                    <span className="text-gray-400 group-hover:text-gray-200 transition-colors">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-medium text-gray-200 mb-6">Design</h3>
                    <div className="grid grid-cols-2 gap-5">
                        {skillList
                            .filter((item) => item.category === "design")
                            .map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center group transition-all duration-300"
                                >
                                    <Icon
                                        icon={item.icon}
                                        className="w-5 h-5 mr-3 text-green-400 group-hover:text-green-300"
                                    />
                                    <span className="text-gray-400 group-hover:text-gray-200 transition-colors">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
