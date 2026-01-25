import React from "react";
import { twMerge } from "tailwind-merge";

interface FireflyProps {
  width: string;
  height: string;
  backgroundColor?: string;
  top: string;
  left: string;
  boxShadow: string;
  filter: string;
  animation: string;
  opacity: number;
  className?: string;
}

const Firefly: React.FC<FireflyProps> = ({
  width,
  height,
  backgroundColor,
  top,
  left,
  boxShadow,
  filter,
  animation,
  opacity,
  className,
}) => {
  return (
    <div
      className={twMerge("absolute -z-10 rounded-full", className)}
      style={{
        width,
        height,
        backgroundColor,
        top,
        left,
        boxShadow,
        filter,
        animation,
        opacity,
      }}
    />
  );
};

export default Firefly;
