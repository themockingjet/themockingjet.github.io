import Badge from "@components/ui/Badge";

import { FOOTER_DATA } from "@data/footer";

export const Footer = () => {
  return (
    <footer className="container mx-auto mt-6 h-18">
      <div className="h-[0.5px] bg-linear-to-r/increasing from-indigo-800 to-red-800" />
      <div className="mt-1 flex h-full flex-col justify-center gap-2 px-4 text-sm text-gray-400 md:flex-row md:items-center md:justify-center md:gap-4 lg:mt-2">
        <p className="text-center">{FOOTER_DATA.content}</p>
        <div className="flex justify-center gap-4 md:before:content-['|']">
          {FOOTER_DATA.stack.map((item) => (
            <span key={item.name}>
              <Badge
                type="text"
                icon={item.icon}
                label={item.name}
                iconClassName="h-5 w-5 lg:h-6 lg:w-6"
              />
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
};
