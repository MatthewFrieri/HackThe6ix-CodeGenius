"use client";

import { useSearchParams } from "next/navigation";
import FileView from "@/app/components/FileView";
import { useEffect, useState } from "react";

export default function ViewPage() {
  const searchParams = useSearchParams();
  const [text, setText] = useState<string>("");

  useEffect(() => {
    // Get the fileText parameter from the searchParams
    const fileText = searchParams.get("fileText");

    if (fileText) {
      const decodedText = decodeURIComponent(fileText);
      setText(decodedText);
      console.log(decodedText);
    }
  }, [searchParams]);

  return <FileView fileText={text}></FileView>;
}
