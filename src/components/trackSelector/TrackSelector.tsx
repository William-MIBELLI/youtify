import { IPlaylistTracksList } from "@/src/interface/spotify.interface";
import { Button, Checkbox, CheckboxGroup } from "@nextui-org/react";
import React, { FC, useEffect, useState } from "react";
import Step from "../stepper/Step";
import { useFormState } from "react-dom";
import { convertYoutubeVideoToSpotifyTrack } from "@/src/lib/action/spotify.action";
import { usePlaylistContext } from "@/src/context/PlaylistContext.context";
import { useRouter } from "next/navigation";
import { usePlaylistStore } from "@/src/store/Playlist.store";


export interface PlaylistItemForSelector {
  title: string;
  artist: string;
  id: string;
  duration?: number
}

interface IProps {
  playlist: PlaylistItemForSelector[];
  from: origin;
}

export type origin = 'youtube' | 'spotify';

const TrackSelector: FC<IProps> = ({ playlist, from }) => {

  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);
  const [mappedTracksValue, setMappedTracksValue] = useState<string[]>([]);
  const { setSpotifyPlaylist, setYoutubePlaylist } = usePlaylistContext();
  const router = useRouter();
  const { addPlaylist } = usePlaylistStore.getState();


  //AU MONTAGE, ON CREE UN TABLEAU DE STRING POUR LES VALUES DU CHECKBOXGROUP
  useEffect(() => {
    const mappedTracks = playlist.map((item) => {
      return `${item.title} - ${item.artist}`;
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

  const [state, action] = useFormState(convertYoutubeVideoToSpotifyTrack.bind(null, selectedTracks), undefined);

  //RESULTAT DU SUBMIT
  useEffect(() => {

    //SI LE STATE EST SUCCESS ET QU'ON A DES DATA
    if (state?.success && state?.data) {

      //ON INJECTE LES DATA DANS LE STATE CORRESPONDANT ET ON REDIRECT
      if (from === 'youtube') {
        // setSpotifyPlaylist(state.data);

        addPlaylist(state.data, 'spotify');
        router.push('/to-spotify');
        return;
      }
    }
  }, [state])
  
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
      <form action={action} noValidate>
        <CheckboxGroup
          name="tracks"
          value={selectedTracks}
          classNames={{
            wrapper: "min-w-full w-full",
          }}
        >


          
          {/* MAP SUR LA PLAYLIST POUR GENERER LES CHECKBOXS */}
          {playlist.map((item) => (
            <Checkbox
              value={`${item.title} - ${item.artist}`}
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
                <div>{item.title}</div>
                <div>{item.artist}</div>
                {
                  item?.duration && (
                    <div>{(item.duration / 60000).toFixed(2)}</div>
                  )
                }
              </div>
            </Checkbox>
          ))}
        </CheckboxGroup>
        <Button type="submit" >Convert</Button>

      </form>
    </Step>
  );
};

export default TrackSelector;
