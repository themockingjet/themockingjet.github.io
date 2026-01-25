import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface SectionDividerProps {
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ className }) => {
  return <div className={twMerge(clsx("h-[10vh]", className))}></div>;
};

export default SectionDivider;
