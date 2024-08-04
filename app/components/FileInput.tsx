"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getIndices, getScore } from "../api/apiCalls";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (file) {
      setLoading(true); // Set loading to true before starting the API calls
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileText = e.target?.result as string;
        const text = JSON.stringify(fileText).slice(1, -1);
        const lines = text.split("\\n");

        const indexedLines = lines.map((line, index) => `${index}~${line}`);

        // Join all items into one big string without newline characters
        const resultString = indexedLines.join("");

        try {
          // API CALLS
          const score = await getScore(fileText);
          console.log("api await", score);

          const annotations = await getIndices(resultString);

          // Navigate to the view page and pass the review response
          router.push(
            `/view?fileText=${encodeURIComponent(
              fileText
            )}&score=${encodeURIComponent(
              score
            )}&annotations=${encodeURIComponent(annotations)}`
          );
        } catch (error) {
          console.error("Error during API calls:", error);
        } finally {
          setLoading(false); // Set loading to false after the API calls are complete
        }
      };

      reader.onerror = (e) => {
        console.error("File reading error:", e);
        setLoading(false); // Set loading to false in case of error
      };

      reader.readAsText(file);
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-pulse-custom {
          animation: pulse 2s infinite;
        }

        .spinner {
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid #ffffff;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileInput"
          className={`border-4 p-6 border-red-400 rounded-2xl text-white w-[55rem] h-[17rem] flex flex-col items-center justify-center cursor-pointer ${
            file ? "border-solid" : "border-dashed border-red-400 animate-pulse"
          } `}
        >
          <p className="text-4xl">
            {file ? (
              <div className="flex flex-col justify-center items-center">
                <p className="mb-8">File Selected:</p>
                <p>{file.name}</p>
              </div>
            ) : (
              "Drop in a file!"
            )}
          </p>
        </label>
        <button
          type="submit"
          className={`focus:shadow-outline bg-white mt-12 px-4 py-4 rounded font-bold text-zinc-800 focus:outline-none ${
            loading ? "" : "hover:bg-gray-300"
          }`}
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        <div className="right-10 bottom-10 absolute">
          {loading && <img src="loading.gif" width={60} />}
        </div>
      </form>
    </>
  );
}
