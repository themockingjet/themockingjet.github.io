type ParagraphSegmentContent = {
  text: string;
  className?: string;
};

export type SummaryParagraph = {
  segments: ParagraphSegmentContent[];
  className?: string;
};

export type SummaryData = {
  paragraphs: SummaryParagraph[];
};

const SUMMARY_DATA: SummaryData = {
  paragraphs: [
    {
      segments: [
        { text: "Hi! I'm " },
        { text: "Jet", className: "font-bold text-blue-300 italic" },
        { text: "." },
      ],
      className: "mb-4 leading-relaxed",
    },
    {
      segments: [
        { text: "I create automation tools using " },
        { text: "AutoHotkey", className: "text-green-300" },
        { text: " and " },
        { text: "Python", className: "text-blue-300" },
        { text: "." },
      ],
      className: "mb-4 leading-relaxed",
    },
    {
      segments: [
        { text: "Lately, I've been learning " },
        { text: "Web development", className: "italic" },
        { text: " with " },
        { text: "ASP.NET MVC", className: "text-blue-400" },
        { text: " and " },
        { text: "ASP.NET API", className: "text-blue-400" },
        { text: ". " },
        { text: "I am also into " },
        { text: "AI development", className: "italic" },
        { text: " with " },
        { text: "semantic-kernel", className: "text-blue-400" },
        { text: "." },
      ],
      className: "mb-4 leading-relaxed text-pretty",
    },
    {
      segments: [
        {
          text: "This site is evolving — check back later for new projects and updates.",
          className: "italic text-gray-400",
        },
      ],
      className: "mt-4 flex items-center font-sans text-sm",
    },
  ],
};

export { SUMMARY_DATA };
