import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({ className, children }) => {
  return (
    <div
      className={twMerge(
        clsx("mt-4 border-t border-slate-800/70 pt-3", className),
      )}
    >
      {children}
    </div>
  );
};

export default CardFooter;
