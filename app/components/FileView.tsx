"use client";

import React, { useState } from "react";

type Section = {
  startLine: number;
  endLine: number;
  feedBack: string;
};

type Response = {
  score: number;
  sections: Section[];
};

export default function FileView({ fileText }: { fileText: string }) {
  const text = JSON.stringify(fileText).slice(1, -1);
  const lines = text.split("\\n");

  const response: Response = {
    score: 85,
    sections: [
      { startLine: 3, endLine: 6, feedBack: "feedback 1" },
      { startLine: 9, endLine: 11, feedBack: "feedback 2" },
    ],
  };

  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [clickedSection, setClickedSection] = useState<number | null>(null);

  const handleMouseEnter = (section: Section) => {
    setHoveredSection(response.sections.indexOf(section));
  };

  const handleMouseLeave = () => {
    if (clickedSection === null) {
      setHoveredSection(null);
    }
  };

  const handleClick = (section: Section) => {
    const sectionIndex = response.sections.indexOf(section);
    if (clickedSection === sectionIndex) {
      setClickedSection(null); // Deselect if already selected
    } else {
      setClickedSection(sectionIndex); // Select new section
    }
  };

  return (
    <div className="flex p-10">
      <div className="p-10 border border-gray-400 rounded-xl w-[60rem] mr-10">
        {lines.map((line, index) => {
          const section = response.sections.find(
            (sec) => index >= sec.startLine - 1 && index < sec.endLine
          );
          const isHovered =
            section && response.sections.indexOf(section) === hoveredSection;
          const isClicked =
            section && response.sections.indexOf(section) === clickedSection;
          const isSignificant = section !== undefined;

          return (
            <span key={index} className="flex font-mono">
              <p className="text-gray-400 w-10">{index + 1}</p>
              <p
                className={`text-white ${isSignificant ? "bg-slate-700" : ""} ${
                  isHovered || isClicked ? "text-yellow-400" : ""
                }`}
                onMouseEnter={() => section && handleMouseEnter(section)}
                onMouseLeave={handleMouseLeave}
                onClick={() => section && handleClick(section)}
              >
                {line}
              </p>
            </span>
          );
        })}
      </div>
      <div className="border p-10 border-gray-400 text-white rounded-xl w-[40rem]">
        {hoveredSection !== null
          ? response.sections[hoveredSection].feedBack
          : clickedSection !== null &&
            response.sections[clickedSection].feedBack}
      </div>
    </div>
  );
}
