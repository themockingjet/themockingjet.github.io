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
  labelClassName?: string;
  iconClassName?: string;
}

const Badge: React.FC<BadgeProps> = ({
  type,
  icon,
  label,
  href,
  className,
  labelClassName,
  iconClassName,
}) => {
  if (type === "link" && href) {
    return (
      <div className={twMerge(clsx("flex items-center", className))}>
        <Icon icon={icon} className={twMerge(clsx("h-6 w-6", iconClassName))} />
        <a href={href} className={twMerge(clsx("underline", labelClassName))}>
          {label}
        </a>
      </div>
    );
  }

  return (
    <div className={twMerge(clsx("flex items-center", className))}>
      <Icon
        icon={icon}
        className={twMerge(clsx("mr-2 h-6 w-6", iconClassName))}
      />
      <span className={twMerge(clsx("text-sm", labelClassName))}>{label}</span>
    </div>
  );
};

export default Badge;
