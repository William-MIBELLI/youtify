"use server";

import { google } from "googleapis";
import {
  addtracksOnPlaylist,
  createPlaylistOnSpotify,
} from "../request/spotify.request";

type OptionCreation = {
  title: string;
  visibility: string;
  userId: string;
  list: string[];
};

export const globalCreatePlaylistACTION = async (
  list: string[],
  state: unknown,
  fd: FormData
) => {
  //ON CHECK LES INPUTS VALUES
  const title = fd.get("title")?.toString();
  const visibility = fd.get("visibility")?.toString();
  const userId = fd.get("userId")?.toString();
  const origin = fd.get("origin")?.toString();

  try {
    if (!title || !visibility || !userId || !origin) {
      throw new Error(
        "Some mandatories informations are missing for playlist creation."
      );
    }

    //ON CREE UN OBJET D'OPTIONS POUR LA CREATION
    const options: OptionCreation = { title, visibility, userId, list };

    //ON CALL LA BONNE ACTION SELON L'ORIGIN
    const playlistLink =
      origin === "youtube"
        ? await createSpotifyPlaylistACTION(options)
        : await createYoutubePlaylistACTION(options);

    //ON RETURN LE STATE AVEC LE LINK DE LA PLAYLIST CREEE
    return { success: true, playlistLink, error: undefined };

  } catch (error: any) {
    console.log("ERROR CREATE PLAYLIST ACTION : ", error?.message);
    return {
      success: false,
      error: error?.message || "Something wents wrong.",
    };
  }
};

export const createSpotifyPlaylistACTION = async (options: OptionCreation) => {
    const { visibility, userId, title, list } = options;

    //ON CREE LA PLAYLIST ET ON RECUPERE SON ID
    const playlistId = await createPlaylistOnSpotify(userId, title, visibility);

    if (!playlistId) {
      throw new Error("PlaylistId is null.");
    }

    //ICI ON DOIT RAJOUTER LES TRACKS A LA PLAYLIST FRAICHEMENT CREEE
    const snapshotId = await addtracksOnPlaylist(playlistId, list);

    if (!snapshotId) {
      throw new Error("No snapshot id.");
    }

    //ON CREE LE LIEN POUR LA PLAYLISTCREE
    const playlistLink = `spotify:playlist:${snapshotId}`;

    return playlistLink;
};

export const createYoutubePlaylistACTION = async (options: OptionCreation) => {
    const res = await google.youtube("v3").playlists.insert({
      requestBody: {
        status: {
          privacyStatus: "",
        },
        snippet: {
          title: "",
        },
      },
    });
    return ''
};
