import OriginSelector from "@/src/components/origin_selector/OriginSelector";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="bg-gray-950 w-full h-auto flex 
    justify-center text-gray-500 items-center flex-col gap-3 mt-20"
    >
      <h1 className="title w-1/2">Choose your playlist origin</h1>
      <OriginSelector />
    </div>
  );
}
