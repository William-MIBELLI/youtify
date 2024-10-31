import { Button } from "@nextui-org/react";
import { Search } from "lucide-react";
import { Input } from "@nextui-org/react";
import React, { FC } from "react";

interface IProps {
  name: string;
}

const SearchInput: FC<IProps> = ({ name }) => {
  return (
    <div className="flex gap-2">
      <Input variant="bordered" name={name} />
      <Button type="submit" endContent={<Search size={20} />} isIconOnly />
    </div>
  );
};

export default SearchInput;
