interface IProject {
    name: string;
    status: "beta" | "deprecated";
    description: string;
    url: string;
    urlTitle: string;
    tags: string[];
}

export const projectList: IProject[] = [
    {
        name: "Binance Trading Bot",
        status: "beta",
        description:
            "Automates trading on Binance using the Binance API, Binance Websocket and TA-Lib.",
        url: "#",
        urlTitle: "Private Repository",
        tags: [
            "Bun",
            "Binance API",
            "Binance Websocket",
            "TA-Lib",
            "TypeScript",
            "Svelte",
            "Tailwind CSS",
        ],
    },
    {
        name: "themockingjet.github.io",
        status: "beta",
        description: "Personal portfolio website.",
        url: "https://github.com/themockingjet/themockingjet.github.io",
        urlTitle: "GitHub Repository",
        tags: ["GitHub Pages", "TypeScript", "React", "Tailwind CSS"],
    },
    {
        name: "Discord Axie Infinity Marketplace",
        status: "deprecated",
        description: "Automates buying and selling Axie Infinity NFTs on Discord.",
        url: "#",
        urlTitle: "Available on request",
        tags: ["Discord.js", "MongoDB", "JavaScript", "Node.js"],
    },
    {
        name: "SecondLife AFK Bot",
        status: "deprecated",
        description: "Automates AFK activities in SecondLife. Notifies user when logged out.",
        url: "#",
        urlTitle: "Available on request",
        tags: ["AutoHotkey"],
    },
    {
        name: "Ragnarok Private Server Auto-Quest",
        status: "deprecated",
        description: "Automates ticket questing in Ragnarok Private Server.",
        url: "#",
        urlTitle: "Available on request",
        tags: ["AutoHotkey"],
    },
];
