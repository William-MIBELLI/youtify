import React, { FC } from "react";

interface IProps {
  index: number;
}

const StepIndex: FC<IProps> = ({ index }) => {
  return (
    <div className=" w-fit">
      <div className="flex justify-center items-center w-10 h-10   bg-emerald-400 text-gray-950 font-semibold rounded-full">
        <p>{index}</p>
      </div>
    </div>
  );
};

export default StepIndex;
