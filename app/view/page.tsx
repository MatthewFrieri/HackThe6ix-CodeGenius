"use client";

import { useSearchParams } from "next/navigation";
import FileView from "@/app/components/FileView";
import { use, useEffect, useState } from "react";

export default function ViewPage() {
  const searchParams = useSearchParams();
  const [text, setText] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [annotations, setAnnotations] = useState<string>("");

  useEffect(() => {
    console.log("useEffect triggered");

    // Get the fileText parameter from the searchParams
    const fileText = searchParams.get("fileText");
    const score = searchParams.get("score");
    const annotations = searchParams.get("annotations");

    if (score !== "" && score !== null) {
      const decodedScore = decodeURIComponent(score);
      setScore(decodedScore);
    }
    if (fileText) {
      const decodedText = decodeURIComponent(fileText);
      setText(decodedText);
    }
    if (annotations) {
      const decodedText = decodeURIComponent(annotations);
      setAnnotations(decodedText);
    }
  }, [searchParams]);

  return score !== "" ? (
    <FileView fileText={text} score={score} annotations={annotations} />
  ) : (
    <h1>No score available</h1>
  );
}
