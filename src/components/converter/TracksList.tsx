'use client';
import { Playlist, TrackToConvert } from "@/src/store/Playlist.store";
import { Radio, RadioGroup } from "@nextui-org/react";
import React, { FC, useState } from "react";

interface IProps {
  list: Playlist;
  setter: React.Dispatch<React.SetStateAction<TrackToConvert>>;
}

const TracksList: FC<IProps> = ({ list, setter }) => {

  const onChangeHandler = (id: string) => {
    const current = list.find(item => item.id === id);
    if (!current) {
      return;
    }
    setter(current);
  }

  return (
    <RadioGroup
    onValueChange={onChangeHandler}  size="sm" classNames={{
      base: [
        'my-2 ml-5 bg-gray-900 p-2 rounded-lg'
      ]
    }}>
      {list &&
        list.map((track) => (
          <Radio key={track.id} value={track.id} classNames={{
            labelWrapper: [
              'hover:text-white'
            ],
            label: [
              'text-gray-500 ml-3'
            ]
          }}>
            <div className="flex gap-3 ">
              <p>{track.title}</p>-<p>{track.artist}</p>
            </div>
          </Radio>
        ))}
    </RadioGroup>
  );
};

export default TracksList;
