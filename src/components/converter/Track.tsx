'use client';
import { Playlist, TrackToConvert } from "@/src/store/Playlist.store";
import { Checkbox } from "@nextui-org/react";
import { ChevronDown } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import TracksList from "./TracksList";

interface IProps {
  changeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tracks: Playlist;
  updatePlaylist: (playlist: Playlist,id: string) => void
}

const Track: FC<IProps> = ({ changeHandler, tracks, updatePlaylist }) => {

  const [item, ...rest] = tracks;
  const [displayList, setDisplayList] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<TrackToConvert>(item);

  useEffect(() => {
    if (selectedTrack) {
      updatePlaylist(tracks, selectedTrack.id);
    }
  },[selectedTrack])

  return (
    <div className="w-full  flex flex-col hover:bg-gray-900 rounded-lg">
      <div className="flex justify-between">
        <Checkbox onChange={changeHandler} value={selectedTrack.id}>
          <div className="flex gap-3 text-gray-300">
            <p>{selectedTrack.title}</p>-<p>{selectedTrack.artist}</p>
          </div>
        </Checkbox>
        <ChevronDown
          className={`transition-all ${
            displayList ? "rotate-180" : ""
          } cursor-pointer hover:text-white`}
          onClick={() => setDisplayList(!displayList)}
        />
      </div>
      {displayList && <TracksList list={tracks} setter={setSelectedTrack} />}
    </div>
  );
};

export default Track;
