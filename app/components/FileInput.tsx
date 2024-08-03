"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getIndices, getScore } from "../api/apiCalls";

export default function Home() {
  const [file, setFile] = useState<File>();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileText = e.target?.result as string;
        const text = JSON.stringify(fileText).slice(1, -1);
        const lines = text.split("\\n");

        const indexedLines = lines.map((line, index) => `${index}~${line}`);
    
        // Join all items into one big string without newline characters
        const resultString = indexedLines.join('');

        // API CALLS
        const score = await getScore(fileText);

        const threeThings = await getIndices(resultString);
        console.log(threeThings);
        console.log(resultString);

        // Navigate to the view page and pass the review response
        router.push(
          `/view?fileText=${encodeURIComponent(
            fileText
          )}&score=${encodeURIComponent(score)}&threeThings=${encodeURIComponent(threeThings)}`
        );
      };

      reader.onerror = (e) => {
        console.error("File reading error:", e);
      };

      reader.readAsText(file);
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="fileInput"
        className={`border-4 p-6 rounded-2xl text-white w-[60rem] h-[20rem] flex flex-col items-center justify-center cursor-pointer ${
          file ? "bg-green-600" : "border-dashed border-red-400"
        } `}
      >
        <p className="text-4xl">
          {file ? `Selected: ${file.name}` : "Drop in a file!"}
        </p>
      </label>
      <button
        type="submit"
        className="bg-white hover:bg-gray-200 focus:shadow-outline mt-12 px-4 py-2 rounded font-bold text-zinc-800 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
}
