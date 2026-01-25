import React, { useEffect, useRef, useState } from "react";

import Firefly from "./Firefly";

interface FireflyData {
  id: string;
  width: string;
  height: string;
  backgroundColor?: string;
  top: string;
  left: string;
  boxShadow: string;
  filter: string;
  animation: string;
  opacity: number;
  duration: number;
}

const Fireflies: React.FC = () => {
  const [numOfFireflies, setNumOfFireflies] = useState(30);
  const [fireflies, setFireflies] = useState<FireflyData[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const uid = () =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? (crypto as any).randomUUID()
      : Math.random().toString(36).slice(2, 9);

  const makeFireflyData = (): FireflyData => {
    const size = Math.random() * 4 + 2;
    const opacity = Math.random() * 0.5 + 0.3;
    const hue =
      Math.random() > 0.5
        ? Math.floor(Math.random() * 30 + 180)
        : Math.floor(Math.random() * 30 + 140);
    const glowSize = size * 1;
    const duration = Math.random() * 10 + 5;
    const animations = [
      "firefly-vertical",
      "firefly-swerve-left",
      "firefly-swerve-right",
    ];
    const animation = animations[Math.floor(Math.random() * animations.length)];

    return {
      id: uid(),
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: `hsla(${hue}, 100%, 75%, ${opacity})`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      boxShadow: `0 0 ${glowSize}px ${Math.floor(glowSize / 2)}px hsla(${hue}, 100%, 70%, 0.6)`,
      filter: `blur(${size / 3}px) brightness(1.2)`,
      animation: `${animation} ${duration}s ease-in-out infinite alternate`,
      opacity,
      duration,
    };
  };

  const scheduleIfNeeded = (firefly: FireflyData) => {
    if (timersRef.current[firefly.id]) return;
    const t = window.setTimeout(() => {
      setFireflies((prev) =>
        prev.map((p) => (p.id === firefly.id ? makeFireflyData() : p)),
      );
      delete timersRef.current[firefly.id];
    }, firefly.duration * 1000);
    timersRef.current[firefly.id] = t as unknown as number;
  };

  // Calculate number of fireflies based on area size
  useEffect(() => {
    const updateNumOfFireflies = () => {
      // Configurable density factor and min/max fireflies
      const DENSITY_FACTOR = 150000;
      const MIN_FIREFLIES = 10;
      const MAX_FIREFLIES = 100;

      const area = window.innerWidth * window.innerHeight;
      let calculated = Math.floor(area / DENSITY_FACTOR);
      calculated = Math.max(MIN_FIREFLIES, Math.min(calculated, MAX_FIREFLIES));
      setNumOfFireflies(calculated);
    };

    updateNumOfFireflies();
    window.addEventListener("resize", updateNumOfFireflies);

    return () => {
      window.removeEventListener("resize", updateNumOfFireflies);
    };
  });

  useEffect(() => {
    const initial = Array.from({ length: numOfFireflies }).map(() =>
      makeFireflyData(),
    );
    setFireflies(initial);

    return () => {
      // cleanup all timers on unmount
      Object.values(timersRef.current).forEach((t) => clearTimeout(t));
      timersRef.current = {};
    };
  }, []);

  useEffect(() => {
    // ensure each firefly has a scheduled replacement
    fireflies.forEach(scheduleIfNeeded);
  }, [fireflies]);

  return (
    <>
      {fireflies.map((firefly) => (
        <Firefly
          key={firefly.id}
          width={firefly.width}
          height={firefly.height}
          backgroundColor={firefly.backgroundColor}
          top={firefly.top}
          left={firefly.left}
          boxShadow={firefly.boxShadow}
          filter={firefly.filter}
          animation={firefly.animation}
          opacity={firefly.opacity}
        />
      ))}
    </>
  );
};

export default Fireflies;
