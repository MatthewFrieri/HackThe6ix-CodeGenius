"use client";

import { useSearchParams } from "next/navigation";
import FileView from "@/app/components/FileView";
import { useEffect, useState } from "react";

type FileData = {
  fileText: string;
  scoreObj: string;
  annotationsObj: string;
};

export default function ViewPage() {
  const searchParams = useSearchParams();
  const [allFileData, setAllFileData] = useState<string>("");
  const [allParsedData, setAllParsedData] = useState<FileData[]>([]);

  // const [text, setText] = useState<string>("");
  // const [score, setScore] = useState<string>("");
  // const [annotations, setAnnotations] = useState<string>("");

  useEffect(() => {
    // Get the fileText parameter from the searchParams

    // const fileText = searchParams.get("fileText");
    // const score = searchParams.get("score");
    // const annotations = searchParams.get("annotations");
    const allFileData = searchParams.get("allFileData");

    if (allFileData) {
      const decodedData = decodeURIComponent(allFileData);
      setAllFileData(decodedData);
    }

    // if (score !== "" && score !== null) {
    //   const decodedScore = decodeURIComponent(score);
    //   setScore(decodedScore);
    // }
    // if (fileText) {
    //   const decodedText = decodeURIComponent(fileText);
    //   setText(decodedText);
    // }
    // if (annotations) {
    //   const decodedText = decodeURIComponent(annotations);
    //   setAnnotations(decodedText);
    // }
  }, [searchParams]);

  useEffect(() => {
    if (allFileData !== "") {
      const parsedAllFileData = JSON.parse(allFileData);
      console.log(parsedAllFileData);
      setAllParsedData(parsedAllFileData);
    }
  }, [allFileData]);

  // return score !== "" ? (
  //   <FileView fileText={text} score={score} annotations={annotations} />
  // ) : (
  //   <h1 className="text-white">No score available</h1>
  // );
  return (
    <div className="">
      {allParsedData.map((parsedData) => (
        <FileView
          fileText={parsedData.fileText}
          score={parsedData.scoreObj}
          annotations={parsedData.annotationsObj}
        />
      ))}
    </div>
  );
}
