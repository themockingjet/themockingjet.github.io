import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface CardHeaderProps {
  className?: string;
  children?: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({ className, children }) => {
  return (
    <div className={twMerge(clsx("mb-2 flex items-center", className))}>
      {children}
    </div>
  );
};

export default CardHeader;
