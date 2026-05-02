const ICON_MAP: Record<string, string> = {
  // Languages
  Python: 'logos:python',
  JavaScript: 'logos:javascript',
  TypeScript: 'logos:typescript-icon',
  AutoHotkey: 'vscode-icons:file-type-autohotkey',

  // Frontend
  React: 'logos:react',
  Svelte: 'logos:svelte-icon',
  'Tailwind CSS': 'logos:tailwindcss-icon',

  // Runtime / Build
  Bun: 'logos:bun',
  Vite: 'logos:vitejs',
  'Node.js': 'logos:nodejs-icon',

  // Backend / Framework
  '.NET': 'logos:dotnet',
  'ASP.NET': 'logos:dotnet',
  'ASP.NET MVC': 'logos:dotnet',
  'ASP.NET API': 'logos:dotnet',
  'semantic-kernel': 'logos:microsoft',
  'agent-framework': 'logos:microsoft',

  // Data
  PostgreSQL: 'logos:postgresql',
  MongoDB: 'logos:mongodb-icon',

  // Cloud / Infra
  Azure: 'logos:microsoft-azure',
  'GitHub Pages': 'logos:github-icon',

  // Tools / APIs
  'Binance API': 'cryptocurrency:bnb',
  'Binance Websocket': 'cryptocurrency:bnb',
  'TA-Lib': 'mdi:chart-line',
  'Discord.js': 'logos:discord-icon',

  // AI / Other
  Copilot: 'octicon:copilot-16'
}

export function resolveIcon(name: string): string | null {
  return ICON_MAP[name] ?? null
}
