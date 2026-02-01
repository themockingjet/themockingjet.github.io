export type Skill = {
  label?: string;
  name: string;
  icon: string;
  iconClassName?: string;
  category: "stack" | "others";
};

const SKILL_DATA: Skill[] = [
  {
    name: "Python",
    icon: "logos:python",
    category: "stack",
  },
  {
    name: "JavaScript",
    icon: "logos:javascript",
    category: "stack",
  },
  {
    name: "TypeScript",
    icon: "logos:typescript-icon",
    category: "stack",
  },
  {
    name: "Svelte",
    icon: "logos:svelte-icon",
    category: "stack",
  },
  {
    name: "Tailwind CSS",
    icon: "logos:tailwindcss-icon",
    category: "stack",
  },
  {
    name: "Bun",
    icon: "logos:bun",
    category: "stack",
  },
  {
    name: "PostgreSQL",
    icon: "logos:postgresql",
    category: "stack",
  },
  {
    name: "AutoHotkey",
    icon: "vscode-icons:file-type-autohotkey",
    category: "stack",
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
