export type Skill = {
  label?: string;
  name: string;
  icon: string;
  iconClassName?: string;
  category: "tech" | "others";
};

const SKILL_DATA: Skill[] = [
  {
    name: "Python",
    icon: "logos:python",
    category: "tech",
  },
  {
    name: "JavaScript",
    icon: "logos:javascript",
    category: "tech",
  },
  {
    name: "TypeScript",
    icon: "logos:typescript-icon",
    category: "tech",
  },
  {
    name: "Svelte",
    icon: "logos:svelte-icon",
    category: "tech",
  },
  {
    name: "Tailwind CSS",
    icon: "logos:tailwindcss-icon",
    category: "tech",
  },
  {
    name: "Bun",
    icon: "logos:bun",
    category: "tech",
  },
  {
    name: "PostgreSQL",
    icon: "logos:postgresql",
    category: "tech",
  },
  {
    name: "AutoHotkey",
    icon: "vscode-icons:file-type-autohotkey",
    category: "tech",
  },
  {
    label: "Design",
    name: "Copilot",
    icon: "octicon:copilot-16",
    iconClassName: "text-white",
    category: "others",
  },
  {
    label: "Infrastructure",
    name: "Azure",
    icon: "logos:microsoft-azure",
    category: "others",
  },
  {
    label: "Infrastructure",
    name: "OVHCloud",
    icon: "logos:ubuntu",
    category: "others",
  },
  {
    label: "DevOps",
    name: "GitHub",
    icon: "octicon:mark-github-24",
    iconClassName: "text-white",
    category: "others",
  },
  {
    label: "DevOps",
    name: "Azure DevOps",
    icon: "logos:microsoft-azure",
    category: "others",
  },
];

export { SKILL_DATA };
