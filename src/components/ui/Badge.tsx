import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

interface BadgeProps {
  type: "text" | "link";
  icon: string;
  label: string;
  href?: string;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  type,
  icon,
  label,
  href,
  className,
}) => {
  if (type === "link" && href) {
    return (
      <div className={twMerge(clsx("flex items-center", className))}>
        <Icon icon={icon} className="h-6 w-6" />
        <a href={href} className="underline">
          {label}
        </a>
      </div>
    );
  }

  return (
    <div className={twMerge(clsx("flex items-center", className))}>
      <Icon icon={icon} className="mr-2 h-6 w-6" />
      <span className="text-sm">{label}</span>
    </div>
  );
};

export default Badge;
