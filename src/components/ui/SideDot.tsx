import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface SideDotProps {
  label?: string;
  link?: string;
  active: boolean;
  className?: string;
}

const SideDot: React.FC<SideDotProps> = ({
  label,
  link,
  active,
  className,
}) => {
  const baseClasses =
    "h-3 w-3 transform-gpu cursor-pointer rounded-full transition-transform duration-150";
  const baseClassesFocus =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/80";
  const activeClasses = "scale-150 bg-primary";
  const inactiveClasses = "bg-primary/50 hover:scale-110 hover:bg-primary/70";

  return (
    <a
      href={link}
      aria-label={label}
      aria-current={active ? "true" : undefined}
      className={twMerge(clsx("block", className))}
    >
      <div
        role="button"
        tabIndex={0}
        className={`${baseClasses} ${active ? activeClasses : inactiveClasses} ${baseClassesFocus}`}
      />
    </a>
  );
};

export default SideDot;
