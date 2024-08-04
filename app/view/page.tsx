"use client";

import { useSearchParams } from "next/navigation";
import FileView from "@/app/components/FileView";
import { Suspense, useEffect, useState } from "react";
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

  useEffect(() => {
    const allFileData = searchParams.get("allFileData");

    if (allFileData) {
      const decodedData = decodeURIComponent(allFileData);
      setAllFileData(decodedData);
    }
  }, [searchParams]);

  useEffect(() => {
    if (allFileData !== "") {
      const parsedAllFileData = JSON.parse(allFileData);
      console.log(parsedAllFileData);
      setAllParsedData(parsedAllFileData);
    }
  }, [allFileData]);

  return (
    <div className="relative flex flex-col">
      <Link href={"/"}>
        <button className="top-10 z-10 right-10 absolute border-white border-2 border-rounded p-2 rounded text-white text-xl">
          Return Home
        </button>
      </Link>
      <h1 className="bg-clip-text top-10 absolute text-center w-full bg-gradient-to-r from-red-500 to-orange-400 h-32 font-bold text-6xl text-transparent">
        Review your Code
      </h1>
      <div className="mx-10 mt-24">
        <Suspense fallback={<div>Loading...</div>}>
          <Tabs>
            <TabList style={{ marginLeft: "40px" }}>
              {allParsedData.map((parsedData) => (
                <Tab key={parsedData.fileName}>{parsedData.fileName}</Tab>
              ))}
            </TabList>
            <div className="">
              {allParsedData.map((parsedData) => (
                <TabPanel key={parsedData.fileName}>
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
        </Suspense>
      </div>
    </div>
  );
}
