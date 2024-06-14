//1h:32min:59s

db.albums.aggregate(
  [
    {
      $project: {
        year: { $year: { $toDate: "$release_date" } },
        album_id: "$id",
      },
    },
    {
      $lookup: {
        from: "r_albums_tracks",
        localField: "album_id",
        foreignField: "album_id",
        as: "album_tracks",
      },
    },
    {
      $unwind: "$album_tracks",
    },
    {
      $lookup: {
        from: "tracks",
        localField: "album_tracks.track_id",
        foreignField: "id",
        as: "track_details",
      },
    },
    {
      $unwind: "$track_details",
    },
    {
      $lookup: {
        from: "audio_features",
        localField: "track_details.audio_feature_id",
        foreignField: "id",
        as: "audio_features",
      },
    },
    {
      $unwind: "$audio_features",
    },
    {
      $group: {
        _id: { year: "$year", album_id: "$album_id" },
        avg_acousticness: { $avg: "$audio_features.acousticness" },
      },
    },
    {
      $group: {
        _id: "$_id.year",
        year_avg_acousticness: { $avg: "$avg_acousticness" },
      },
    },
    {
      $sort: { year_avg_acousticness: 1 },
    },
    {
      $limit: 5,
    },
    {
      $project: {
        _id: 0,
        year: "$_id",
        year_avg_acousticness: { $round: ["$year_avg_acousticness", 4] },
      },
    },
  ],
  {
    allowDiskUse: true,
  }
);
