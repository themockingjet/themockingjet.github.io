import { Icon } from "@iconify/react";

export const Footer = () => {
    return (
        <footer className="mt-auto py-6 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <p className="text-gray-400 text-sm text-center flex items-center justify-center gap-1">
                    © 2025 • Built with
                    <Icon icon="logos:vitejs" className="w-4 h-4 mx-1 inline-block" />
                    Vite and
                    <Icon icon="logos:react" className="w-4 h-4 mx-1 inline-block" />
                    React
                </p>
            </div>
        </footer>
    );
};
