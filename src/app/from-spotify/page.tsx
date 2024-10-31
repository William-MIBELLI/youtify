import SpotifyStepper from "@/src/components/stepper/SpotifyStepper";
import React from "react";

const page = () => {
  return (
    <div className="h-auto w-3/4 mx-auto flex flex-col gap-5 mt-16 text-gray-400 ">
      <h2 className="title text-white">From Spotify to Youtube</h2>
      <SpotifyStepper />
    </div>
  );
};

export default page;
