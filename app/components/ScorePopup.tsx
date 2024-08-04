export default function ScorePopup({
  justification,
  children,
}: {
  justification: string;
  children: React.ReactNode;
}) {
  return (
    <div className="absolute flex justify-center backdrop-blur-xl w-screen h-screen">
      <div className="top-32 absolute flex flex-col border-white bg-zinc-800 p-16 border rounded-xl w-[60rem] h-[40rem]">
        <h2 className="my-10 text-4xl text-white">Why this score?</h2>
        <p className="text-2xl text-white">{justification}</p>
        {children}
      </div>
    </div>
  );
}
