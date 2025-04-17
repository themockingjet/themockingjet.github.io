export const ProjectTags = (props: { tags: string[] }) => {
    return (
        <div className="mt-auto pt-4 flex flex-wrap gap-2">
            {props.tags.map((tag, tagIndex) => (
                <span
                    key={tagIndex}
                    className="px-2 py-0.5 bg-gray-800/60 rounded-md text-xs text-gray-400 border border-gray-700/50 hover:bg-gray-700/50 hover:text-gray-200 hover:border-gray-600/50 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
};
