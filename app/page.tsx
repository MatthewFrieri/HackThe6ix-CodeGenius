"use client";

import FileInput from "./components/FileInput"; // Correct path to the FileInput component

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center mt-24">
      <style jsx>{`
        @keyframes reveal {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.5);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .reveal {
          overflow: hidden;
          white-space: nowrap;
          display: inline-block;
        }

        .reveal span {
          display: inline-block;
          animation: reveal 1s forwards;
        }

        .popIn {
          animation: popIn 0.5s ease-out forwards;
        }
      `}</style>
      <div className="mb-20 text-9xl reveal">
        <span className="bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 font-bold text-transparent">
          CodeGenius
        </span>
      </div>
      <div className="popIn">
        <FileInput />
      </div>
    </div>
  );
}
