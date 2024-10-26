import React, { FC } from "react";
import StepIndex from "./StepIndex";

interface IProps {
  children?: React.ReactNode;
  index: number;
  title: string;
}
const Step: FC<IProps> = ({ children, index, title }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-[3rem,1fr] items-center">
        <StepIndex index={index} />
        <div className="flex flex-col my-4">
          <h3 className="text-2xl font-semibold text-emerald-400">{title}</h3>
        </div>
        <div className="col-start-2">{children}</div>
      </div>

      <hr className="border-0 border-t border-gray-600"></hr>
    </div>
  );
};

export default Step;
