import FileInput from "./components/FileInput";

export default function HomePage() {
  return (
    <div className="flex justify-center items-center flex-col my-40">
      <h1 className="text-9xl font-bold mb-20 w-fit text-transparent bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text">
        CodeGenius
      </h1>
      <FileInput></FileInput>
    </div>
  );
}
