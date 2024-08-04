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
      setAllParsedData(parsedAllFileData);
    }
  }, [allFileData]);

  return (
    <div className="relative flex flex-col">
      <Link href={"/"}>
        <button className="top-10 z-10 right-10 absolute border-white border-2 border-rounded p-2 rounded text-white text-xl hover:bg-white hover:text-black transition-transform transform duration-500 hover:scale-110 animate-fade-in">
          Return Home
        </button>
      </Link>
      <h1 className="bg-clip-text top-10 absolute text-center w-full bg-gradient-to-r from-red-500 to-orange-400 h-32 font-bold text-6xl text-transparent animate-fade-in">
        Review your Code
      </h1>
      <div className="mx-10 mt-24">
        <Tabs>
          <TabList style={{ marginLeft: "40px" }}>
            {allParsedData.map((parsedData, index) => (
              <Tab style={{animation: 'fadeIn 2s ease-in-out'}} key={index}>{parsedData.fileName}</Tab>
            ))}
          </TabList>
          <div className="">
            {allParsedData.map((parsedData, index) => (
              <TabPanel key={index}>
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
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fadeIn 2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
