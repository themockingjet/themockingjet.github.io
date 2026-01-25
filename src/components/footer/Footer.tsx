import { Icon } from "@iconify/react";

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-800 py-6">
      <div className="container mx-auto px-4">
        <p className="flex items-center justify-center gap-1 text-center text-sm text-gray-400">
          © 2025 themockingjet • Built with
          <Icon icon="logos:vitejs" className="mx-1 inline-block h-4 w-4" />
          Vite
          <Icon icon="logos:react" className="mx-1 inline-block h-4 w-4" />
          React and
          <Icon
            icon="logos:tailwindcss-icon"
            className="mx-1 inline-block h-5 w-5"
          />
          Tailwind CSS
        </p>
      </div>
    </footer>
  );
};
