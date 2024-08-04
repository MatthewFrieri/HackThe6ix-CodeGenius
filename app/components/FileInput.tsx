"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { getIndices, getScore } from "../api/apiCalls";

type ScoreObj = {
  score: string;
  justification: string;
};

type AnnotationsObj = {
  startLine: number;
  endLine: number;
  feedback: string;
};

type FileData = {
  fileText: string;
  scoreObj: ScoreObj;
  annotationsObj: AnnotationsObj;
};

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

      const allFileData: FileData[] = [];
      const files: File[] = [];
      let counter = 0;

      // Check if the uploaded file is a zip file
      if (file.type === "application/zip") {
        try {
          const zip = await JSZip.loadAsync(file);
          for (const fileName in zip.files) {
            counter++;
            const zipFile = zip.files[fileName];
            if (!zipFile.dir) {
              const fileText = await zipFile.async("text");

              if (counter % 2 === 1) {
                files.push(new File([fileText], fileName));
              }
            }
          }
        } catch (error) {
          console.error("Error reading zip file:", error);
        }
      } else {
        files.push(file);
      }

      // Function to process file
      const processFile = async (file: File) => {
        const fileText = await readFileAsText(file);

        // middle man variables
        const text = JSON.stringify(fileText).slice(1, -1);
        const lines = text.split("\\n");
        const indexedLines = lines.map((line, index) => `${index}~${line}`);
        const resultString = indexedLines.join("");

        try {
          // API CALLS
          const score = await getScore(fileText);
          const annotations = await getIndices(resultString);

          const fileData = {
            fileText: fileText,
            scoreObj: score,
            annotationsObj: annotations,
          };

          allFileData.push(fileData);
        } catch (error) {
          console.error("Error during API calls:", error);
        }
      };

      try {
        // Read and process each file in the list
        for (const file of files) {
          await processFile(file);
        }

        // DECLARE PATH AND PUSH ROUTER
        const path = `/view?allFileData=${encodeURIComponent(
          JSON.stringify(allFileData)
        )}`;
        router.push(path);
      } catch (error) {
        console.error("Error during file processing:", error);
      } finally {
        setLoading(false); // Set loading to false after the API calls are complete
      }
    } else {
      console.log("No file selected.");
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
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
          <div className="text-4xl">
            {file ? (
              <div className="flex flex-col justify-center items-center">
                <p className="mb-8">File Selected:</p>
                <p>{file.name}</p>
              </div>
            ) : (
              "Drop in a file!"
            )}
          </div>
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
