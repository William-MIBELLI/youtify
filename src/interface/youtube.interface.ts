export interface IYoutubePlaylist {
  "kind": "youtube#playlistListResponse",
  "etag": any,
  "nextPageToken"?: string,
  "prevPageToken"?: string,
  "pageInfo": {
    "totalResults": number,
    "resultsPerPage": number
  },
  "items": IPlaylistItem[]
}


export interface IPlaylistItem {
  "kind": "youtube#playlistItem",
  "etag": any,
  "id": string,
  "snippet": {
    "publishedAt": Date,
    "channelId": string,
    "title": string,
    "description": string,
    "thumbnails": {
      (key: string): {
        "url": string,
        "width": number,
        "height": number
      }
    },
    "channelTitle": string,
    "videoOwnerChannelTitle": string,
    "videoOwnerChannelId": string,
    "playlistId": string,
    "position": number,
    "resourceId": {
      "kind": string,
      "videoId": string,
    }
  },
  "contentDetails": {
    "videoId": string,
    "startAt": string,
    "endAt": string,
    "note": string,
    "videoPublishedAt": Date
  },
  "status": {
    "privacyStatus": string
  }
}