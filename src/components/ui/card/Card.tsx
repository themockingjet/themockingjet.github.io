import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface CardProps {
  className?: string;
  children?: React.ReactNode;
}
const Card: React.FC<CardProps> = ({ className, children }) => {
  return (
    <div
      className={twMerge(
        clsx("overflow-hidden rounded-lg bg-slate-900 shadow-lg", className),
      )}
    >
      {children}
    </div>
  );
};

export default Card;
