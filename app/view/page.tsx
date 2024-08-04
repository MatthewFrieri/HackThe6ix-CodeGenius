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
      console.log(parsedAllFileData);

      setAllParsedData(parsedAllFileData);
    }
  }, [allFileData]);

  return (
    <div className="relative flex flex-col">
      <Link href={"/"}>
        <button className="top-10 right-10 z-10 absolute border-2 border-white hover:bg-white p-2 border-rounded rounded text-white text-xl hover:text-black transform transition-transform animate-fade-in duration-500 hover:scale-110">
          Return Home
        </button>
      </Link>
      <h1 className="top-10 absolute bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 w-full h-32 font-bold text-6xl text-center text-transparent animate-fade-in">
        Review your Code
      </h1>
      <div
        className="mx-10 mt-24 overflow-hidden"
        style={{ animation: "slideDown 1.5s cubic-bezier(.26,.93,.5,.9)" }}
      >
        <Tabs>
          <TabList style={{ marginLeft: "40px" }}>
            {allParsedData.map((parsedData, index) => (
              <Tab key={index}>{parsedData.fileName}</Tab>
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
        @keyframes slideDown {
          from {
            maxheight: 0rem;
            opacity: 1;
          }
          to {
            maxheigt: 100rem;
            opacity: 1;
          }
        }

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
