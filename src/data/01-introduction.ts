export type BadgeData = {
  icon: string;
  label: string;
  href?: string;
};

export type IntroductionData = {
  title: string;
  coutryBadge: BadgeData;
  linkBadge: BadgeData;
};

const INTRODUCTION_DATA: IntroductionData = {
  title: "themockingjet",
  coutryBadge: {
    icon: "circle-flags:ph",
    label: "Philippines",
  },
  linkBadge: {
    icon: "mdi:github",
    label: "themockingjet",
    href: "http://github.com/themockingjet",
  },
};

export { INTRODUCTION_DATA };
