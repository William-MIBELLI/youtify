import { IPlaylistTracksList } from "@/src/interface/spotify.interface";
import { Checkbox, CheckboxGroup } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";
import Step from "../stepper/Step";

interface IProps {
  playlist: IPlaylistTracksList;
}

const TrackSelector: FC<IProps> = ({ playlist }) => {

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [mappedTracksValue, setMappedTracksValue] = useState<string[]>([]);


  //AU MONTAGE, ON CREE UN TABLEAU DE STRING POUR LES VALUES DU CHECKBOXGROUP
  useEffect(() => {
    const mappedTracks = playlist.items.map((item) => {
      return `${item.track.name} - ${item.track.artists[0].name}`;
    });
    setMappedTracksValue(mappedTracks);
  }, [playlist]);


  //GESTION DU CLICK SUR LES CHECKBOXS CLASSIQUES
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {

    //SI CHECK EST TRUE, ON ADD LE TRACKS AU TABLEAU DES SELECTED
    if (event.target.checked) {
      return setSelectedTracks(previous => [...previous, event.target.value]);
    }
    console.log(event.target.value);
    //SINON ON L'ENLEVE
    const filtered = selectedTracks.filter(item => item !== event.target.value);
    setSelectedTracks(filtered);
  }

  //CLICK SUR LA CHECKBOX GLOBALE
  const onGlobalSelectHandler = (event: boolean) => {
    console.log('EVENT DANS GLOBAL : ', event);
    if (event) {
      return setSelectedTracks(mappedTracksValue);
    }
    setSelectedTracks([]);
  }

  return (
    <Step index={3} title="Select tracks you want to save">
        {/* HEADER AVEC LE CHECKBOX GLOBAL */}
        <Checkbox
          classNames={{
            base: "min-w-full w-full",
            label: "min-w-full w-full",
          }}
          isSelected={selectedTracks.length === mappedTracksValue.length}
          onValueChange={onGlobalSelectHandler}
        >
          <div
            className={`min-w-full grid grid-cols-3 text-gray-200 font-semibold gap-4 items-center`}
          >
            <div className="text-center">{"Name"}</div>
            <div className="text-center">{"Artist"}</div>
            <div className="text-center">{"Duration"}</div>
          </div>
        </Checkbox>
        <hr className="border-0 border-t border-gray-600 my-3"></hr>
      <CheckboxGroup
        value={selectedTracks}
        classNames={{
          wrapper: "min-w-full w-full",
        }}
      >


        
        {/* MAP SUR LA PLAYLIST POUR GENERER LES CHECKBOXS */}
        {playlist.items.map((item) => (
          <Checkbox
            value={`${item.track.name} - ${item.track?.artists[0].name}`}
            key={Math.random()}
            onChange={onChangeHandler}
            classNames={{
              base: "min-w-full w-full",
              label: "min-w-full w-full",
            }}
          >
            <div
              className={`min-w-full grid grid-cols-3 text-gray-400 gap-4 items-center`}
            >
              <div>{item.track.name}</div>
              <div>{item.track.artists[0].name}</div>
              <div>{(item.track.duration_ms / 60000).toFixed(2)}</div>
            </div>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </Step>
  );
};

export default TrackSelector;
