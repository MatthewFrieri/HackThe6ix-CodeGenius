import FileInput from "./components/FileInput";

export default function HomePage() {
  return (
    <div className="flex flex-col justify-center items-center my-32">
      <h1 className="bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 mb-20 w-fit font-bold text-9xl text-transparent">
        CodeGenius
      </h1>
      <FileInput></FileInput>
    </div>
  );
}
