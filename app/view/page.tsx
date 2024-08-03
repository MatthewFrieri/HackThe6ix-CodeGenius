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
    // Get the fileText parameter from the searchParams
    const fileText = searchParams.get("fileText");
    const score = searchParams.get("score");
    const annotations = searchParams.get("annotations");

    if (score) {
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

  return <FileView fileText={text} score={score} annotations={annotations}></FileView>;
}
