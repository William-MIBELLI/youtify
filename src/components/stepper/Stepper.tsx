"use client";
import { Button, Input } from "@nextui-org/react";
import { Search } from "lucide-react";
import React, { useState } from "react";

const Stepper = () => {
  const [user, setUser] = useState<string>();

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex items-center w-full gap-3">
        <div className="flex justify-center items-center w-10 h-10 mr-5  bg-gray-400 text-gray-950 font-semibold rounded-full">
          <p>1</p>
        </div>
        <div>
          <p className="">Select an user</p>
          <div className="flex gap-2">
            <Input variant="bordered" name="userId" />
            <Button endContent={<Search size={20} />} isIconOnly />
          </div>
        </div>
      </div>
      <hr className="border-0 border-t border-gray-600"></hr>
    </div>
  );
};

export default Stepper;
