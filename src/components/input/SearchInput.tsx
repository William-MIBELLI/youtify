import { Button, Spinner } from "@nextui-org/react";
import { Search } from "lucide-react";
import { Input } from "@nextui-org/react";
import React, { FC } from "react";
import { useFormStatus } from "react-dom";

interface IProps {
  name: string;
  error?: string;
}

const SearchInput: FC<IProps> = ({ name, error }) => {

  const { pending } = useFormStatus();

  return (
    <div>
      <div className="flex gap-2">
        <Input isDisabled={pending} variant="bordered" name={name} />
        <Button isDisabled={pending} type="submit" endContent={ pending ?<Spinner size="sm" color="white"/> : <Search size={20} />} isIconOnly />
      </div>
      <p className="my-3 text-center text-sm text-red-400">
        {error}
      </p>
    </div>
  );
};

export default SearchInput;
