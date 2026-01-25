import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface LinkProps {
  href: string;
  label?: string;
  className?: string;
  children: React.ReactNode;
}

const Link: React.FC<LinkProps> = ({ href, label, children, className }) => {
  return (
    <a href={href} aria-label={label} className={twMerge(clsx(className))}>
      {children}
    </a>
  );
};

export default Link;
