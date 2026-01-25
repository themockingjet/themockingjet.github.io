import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface CardBodyProps {
  className?: string;
  children?: React.ReactNode;
}

const CardBody: React.FC<CardBodyProps> = ({ className, children }) => {
  return (
    <div className={twMerge(clsx("flex flex-col", className))}>{children}</div>
  );
};

export default CardBody;
