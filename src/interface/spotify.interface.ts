
export interface IUserPlaylist {
  href: string;
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
  items: IPlaylistItem[]
}

export interface IPlaylistItem extends Partial<{ 
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string
  };
  href: string;
  id: string
  images: [
    {
      url: string;
      height: number;
      width: number
    }
  ];
  name: string;
  owner: {
    external_urls: {
      spotify: string
    };
    followers: {
      href: string;
      total: number
    };
    href: string;
    id: string;
    type: "user";
    uri: string;
    display_name: string
  };
  public: false;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number
  };
  type: string;
  uri: string
}> { };

export interface ISpotifyUser extends Partial<{
  display_name: string,
  external_urls: {
    spotify: string
  },
  followers: {
    href: string,
    total: number
  },
  href: string,
  id: string,
  images: [
    {
      url: string,
      height: number,
      width: number
    }
  ],
  type: "user",
  uri: string
}> { };

export interface ISpotifyRequestToken {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export interface IPlaylistTracksList {
  href: string,
  limit: number,
  next: string,
  offset: number,
  previous: string,
  total: number,
  items: ITracksListItem[]
}

export interface ITracksListItem {
  added_at: string,
  added_by: {
    external_urls: {
      spotify: string
    },
    followers: {
      href: string,
      total: number
    },
    href: string,
    id: string,
    type: 'user',
    uri: string
  },
  is_local: false,
  track: SpotifyTrack
}



export interface SpotifyTrack {
  album: {
    album_type: 'compilation'| 'album' | 'single',
    total_tracks: number,
    available_markets: string[],
    external_urls: {
      spotify: string
    },
    href: string,
    id: string,
    images: [
      {
        url: string,
        height: number,
        width: number
      }
    ],
    name: string,
    release_date: string,
    release_date_precision: "year" | 'month' | 'day',
    restrictions: {
      reason: 'market' | 'product' | 'explicit'
    },
    type: "album",
    uri: string,
    artists: [
      {
        external_urls: {
          spotify: string
        },
        href: string,
        id: string,
        name: string,
        type: "artist",
        uri: string
      }
    ]
  },
  artists: [
    {
      external_urls: {
        spotify: string
      },
      href: string,
      id: string,
      name: string,
      type: "artist",
      uri: string
    }
  ],
  available_markets: string[],
  disc_number: number,
  duration_ms: number,
  explicit: false,
  external_ids: {
    isrc: string,
    ean: string,
    upc: string
  },
  external_urls: {
    spotify: string
  },
  href: string,
  id: string,
  is_playable: false,
  linked_from: {},
  restrictions: {
    reason: string
  },
  name: string,
  popularity: number,
  preview_url: string,
  track_number: number,
  type: "track",
  uri: string,
  is_local: false
}

export interface ISearchResult {
  href: string,
  limit: number,
  next: string,
  offset: number,
  previous: string,
  total: number,
  items: SpotifyTrack[]
}