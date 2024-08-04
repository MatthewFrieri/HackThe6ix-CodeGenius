"use client";

import { useSearchParams } from "next/navigation";
import FileView from "@/app/components/FileView";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "@/app/styles/tabs.css";

type FileData = {
  fileName: string;
  fileText: string;
  scoreObj: string;
  annotationsObj: string;
};

const customTabsTheme = {
  Tab: {
    backgroundColor: "#f0f0f0",
    borderBottom: "2px solid #ccc",
    padding: "10px",
  },
  TabActive: {
    backgroundColor: "#fff",
    borderBottom: "2px solid #337ab7",
    padding: "10px",
  },
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
    <div className="relative flex flex-col">
      <Link href={"/"}>
        <button className="top-10 z-10 right-10 absolute bg-gradient-to-r from-red-500 to-orange-400 p-2 rounded text-white text-xl">
          Return Home
        </button>
      </Link>
      <h1 className="bg-clip-text top-10 absolute text-center w-full bg-gradient-to-r from-red-500 to-orange-400 h-32 font-bold text-6xl text-transparent">
        Review your Code
      </h1>
      <div className="mx-10 mt-24">
        <Tabs>
          <TabList style={{ marginLeft: "40px" }}>
            {allParsedData.map((parsedData) => (
              <Tab>{parsedData.fileName}</Tab>
            ))}
          </TabList>
          <div className="">
            {allParsedData.map((parsedData) => (
              <TabPanel>
                <FileView
                  fileName={parsedData.fileName}
                  fileText={parsedData.fileText}
                  score={parsedData.scoreObj}
                  annotations={parsedData.annotationsObj}
                />
              </TabPanel>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
