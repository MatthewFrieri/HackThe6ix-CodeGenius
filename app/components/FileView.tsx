"use client";

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
  fileName,
  fileText,
  score,
  annotations,
}: {
  fileName: string;
  fileText: string;
  score: string;
  annotations: string;
}) {
  const text = JSON.stringify(fileText).slice(1, -1);
  const lines = text.split("\\n");

  const sections = parseAnnotations(annotations);

  const parsedScore = parseScore(score);

  const response: Response = {
    score: parsedScore.score, // score to change!
    sections: sections,
  };

  const [hoveredSection, setHoveredSection] = useState<number | null>(null);
  const [clickedSection, setClickedSection] = useState<number | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [showScore, setShowScore] = useState<boolean>(false);

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

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowScore(true);
    }, 0); // Adjust the delay to match the slide-down animation duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes popIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          80% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes popupSlideIn {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          0% {
            max-height: 0;
            opacity: 0;
          }
          100% {
            max-height: 45rem;
            opacity: 1;
          }
        }

        @keyframes reveal {
          0% {
            max-height: 0;
            opacity: 0;
          }
          100% {
            max-height: 100%;
            opacity: 1;
          }
        }

        .code-container {
          width: 100%;
          height: 80vh;
          transition: width 0.5s;
          // animation: slideDown 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
          border-radius: 15px;
          overflow-y: scroll;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }

        .code-container::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        .score-popup {
          background: linear-gradient(to right, #ff4500, #ff7e00);
          border-radius: 15px;
          color: white;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          cursor: pointer;
          transition: transform 0.3s ease;
          // animation: popIn 0.5s ease-out;
        }

        .score-popup:hover {
          // transform: scale(1.02);
          transform: translateY(-5px);
        }

        .modal {
          display: none;
        }

        .modal.show {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          overflow: auto;
          background-color: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          background-color: #444;
          margin: auto;
          padding: 50px;
          border: 1px solid #888;
          border-radius: 15px;
          width: 80%;
          max-width: 800px;
          text-align: center;
          animation: popIn 0.5s forwards;
        }

        .modal-close {
          background-color: transparent;
          border: 2px solid #ccc;
          border-radius: 5px;
          color: white;
          cursor: pointer;
          padding: 5px 20px;
          font-size: 16px;
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .modal-close:hover {
          background-color: #ccc;
          color: black;
        }

        .feedback-column {
          width: 100%;
          height: 80%;
          padding: 20px;
          border: 2px solid #ccc;
          border-radius: 15px;
          background-color: #1e1e1e;
          overflow-y: auto;
        }

        .feedback-column h2 {
          font-size: 5xl;
          color: white;
          margin-bottom: 10px;
        }

        .feedback-column p {
          font-size: xl;
          color: white;
        }
      `}</style>
      <div className="relative flex flex-col items-center ">
        {isPopupVisible && (
          <div className="modal show">
            <div className="modal-content">
              <button className="modal-close" onClick={handleClosePopup}>
                Close
              </button>
              <h2 className="text-4xl text-white mb-8">Why this score?</h2>
              <p className="text-lg text-white whitespace-pre-wrap">
                {parsedScore.justification}
              </p>
            </div>
          </div>
        )}
        <div className="flex w-full ">
          <div className="border-gray-400 mr-4 p-10 border rounded-xl w-[70%] h-[40rem] overflow-scroll code-container">
            {lines.map((line, index) => {
              const section = response.sections.find(
                (sec) => index >= sec.startLine - 1 && index < sec.endLine + 1
              );
              const isHovered =
                section &&
                response.sections.indexOf(section) === hoveredSection;
              const isClicked =
                section &&
                response.sections.indexOf(section) === clickedSection;
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
          <div className="flex flex-col w-[30rem]">
            <div className="feedback-column w-full">
              <h2>Feedback</h2>
              {(hoveredSection !== null || clickedSection !== null) && (
                <div className="">
                  <p>
                    {hoveredSection !== null
                      ? String(response.sections[hoveredSection].feedback)
                      : clickedSection !== null
                      ? String(response.sections[clickedSection].feedback)
                      : ""}
                  </p>
                </div>
              )}
              {hoveredSection === null && clickedSection === null && (
                <p className="text-xl text-gray-500">
                  Find a highlighted code snippet for feedback
                </p>
              )}
            </div>
            {showScore && (
              <div className="flex-grow border-gray-400 mt-4 border rounded-xl w-full score-popup">
                <div
                  className="flex items-center justify-between w-full px-10 h-full cursor-pointer"
                  onClick={handleScoreClick}
                >
                  <div className="flex flex-col">
                    <span className="text-lg">Rated:</span>
                    <span className="text-5xl">
                      {response.score}
                      <span className="text-xl">/100</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <a className="text-sm text-white underline mr-2">See why</a>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-5 h-5 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
