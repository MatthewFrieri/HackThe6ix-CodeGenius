"use client";

import Link from "next/link";
import React, { useState } from "react";
import { parseAnnotations, parseScore } from "../lib/parse";
import ScorePopup from "./ScorePopup";

export type Section = {
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
  annotations,
}: {
  fileText: string;
  score: string;
  annotations: string;
}) {
  const text = JSON.stringify(fileText).slice(1, -1);
  const lines = text.split("\\n");

  const sections = parseAnnotations(annotations);

  console.log("score:::", score);

  const parsedScore = parseScore(score);

  const response: Response = {
    score: parsedScore.score, // score to change!
    sections: sections,
  };

  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [clickedSection, setClickedSection] = useState<number | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);

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

  const handleScoreClick = () => {
    setIsPopupVisible(true);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      {isPopupVisible && (
        <ScorePopup justification={parsedScore.justification}>
          <button
            className="-top-8 -right-8 absolute bg-red-500 rounded-full w-16 h-16 text-3xl text-white"
            onClick={handleClosePopup}
          >
            X
          </button>
        </ScorePopup>
      )}
      <Link href={"/"}>
        <button className="top-20 left-20 absolute bg-gradient-to-r from-red-500 to-orange-400 p-2 rounded text-white text-xl">
          Return Home
        </button>
      </Link>
      <div
        className="top-10 right-10 absolute flex justify-center items-center bg-gradient-to-r from-red-500 to-orange-400 rounded-full w-40 h-40 cursor-pointer"
        onClick={handleScoreClick}
      >
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
              (sec) => index >= sec.startLine - 1 && index < sec.endLine + 1
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
        <div className="flex flex-col border-gray-400 p-10 border rounded-xl w-[40%] text-white">
          <h2 className="mb-10 text-5xl text-white">Feedback</h2>
          {hoveredSection !== null ? (
            <p className="text-xl">
              {response.sections[hoveredSection].feedback}
            </p>
          ) : (
            clickedSection !== null && (
              <p className="text-xl">
                {response.sections[clickedSection].feedback}
              </p>
            )
          )}
          {hoveredSection === null && clickedSection === null ? (
            <p className="text-xl">
              Find a highlighted code snippet for feedback
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
