"use client";

import { useState } from "react";
import CreatePrompt from "../api/prompt";

export default function Home() {
  const [file, setFile] = useState<File>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const prompt = CreatePrompt(text);

        // Pass the prompt to llama here
        console.log(prompt);
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col justify-center items-center h-screen w-full"
    >
      <label className="text-white w-20">File Input</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0])}
        className="border text-white "
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit
      </button>
    </form>
  );
}
