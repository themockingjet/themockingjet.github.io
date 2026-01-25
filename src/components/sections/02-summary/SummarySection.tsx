import React from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

import { SUMMARY_DATA } from "@data/02-summary";
import type { SummaryParagraph } from "@data/02-summary";

interface SummarySectionProps {
  id: string;
  className?: string;
}

function renderParagraph(paragraph: SummaryParagraph[]) {
  return paragraph.map((content, index) => (
    <p key={index} className={content.className}>
      {index === paragraph.length - 1 ? (
        <span className="mr-3 h-px w-6 bg-gray-600"></span>
      ) : null}
      {content.segments.map((seg, i) =>
        seg.className ? (
          <span key={i} className={seg.className}>
            {seg.text}
          </span>
        ) : (
          <React.Fragment key={i}>{seg.text}</React.Fragment>
        ),
      )}
    </p>
  ));
}

const SummarySection: React.FC<SummarySectionProps> = ({ id, className }) => {
  return (
    <section
      id={id}
      className={twMerge(
        clsx("flex h-screen max-w-3xl flex-col justify-center", className),
      )}
    >
      {renderParagraph(SUMMARY_DATA.paragraphs)}
    </section>
  );
};

export default SummarySection;
