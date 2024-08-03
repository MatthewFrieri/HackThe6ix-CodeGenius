"use client";

import Link from "next/link";
import React, { useState } from "react";

type Section = {
  startLine: number;
  endLine: number;
  feedback: string;
};

type Response = {
  score: string;
  sections: Section[];
};

export default function FileView({
  fileText,
  score,
  threeThings
}: {
  fileText: string;
  score: string;
  threeThings: string;
}) {
  const text = JSON.stringify(fileText).slice(1, -1);
  const lines = text.split("\\n");

  const trimmedString = threeThings.slice(1, -1);

  // Split the string on the first two commas it finds
  const parts = trimmedString.split(/,(.+)/, 2);

  const startLine = parseInt(parts[0].trim());
  const endLineAndFeedback = parts[1].split(/,(.+)/, 2);
  const endLine = parseInt(endLineAndFeedback[0].trim());
  const feedback = endLineAndFeedback[1].trim().slice(1, -1); // Remove surrounding single quotes

  const resultObject = {
      startLine: startLine,
      endLine: endLine,
      feedback: feedback
  };

  console.log("threeThings");
  console.log(threeThings);

  const response: Response = {
    score: score, // score to change!
    sections: [
      resultObject
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
    <div className="relative flex flex-col items-center">
      <Link href={"/"}>
        <button className="top-20 left-20 absolute bg-gradient-to-r from-red-500 to-orange-400 p-2 rounded text-white text-xl">
          Return Home
        </button>
      </Link>
      <div className="top-10 right-10 absolute flex justify-center items-center bg-gradient-to-r from-red-500 to-orange-400 rounded-full w-40 h-40">
        <h2 className="text-6xl text-white">
          {response.score}
          <p className="inline text-xl">/100</p>
        </h2>
      </div>
      <h1 className="bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 my-8 py-2 w-fit font-bold text-6xl text-transparent">
        Review your Code
      </h1>
      <div className="flex justify-between w-[90%]">
        <div className="border-gray-400 mr-10 p-10 border rounded-xl w-[60%] h-[45rem] overflow-scroll">
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
                <p className="w-10 text-gray-400">{index + 1}</p>
                <p
                  className={`text-white ${
                    isSignificant ? "bg-slate-700" : ""
                  } ${isHovered || isClicked ? "text-yellow-400" : ""}`}
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
        <div className="flex border-gray-400 p-10 border rounded-xl w-[40%] text-white">
          {hoveredSection !== null
            ? response.sections[hoveredSection].feedback
            : clickedSection !== null &&
              response.sections[clickedSection].feedback}
        </div>
      </div>
    </div>
  );
}
