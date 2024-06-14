//37min:4s

db.r_artist_genre.aggregate(
  [
    {
      $match: { genre_id: "rap" },
    },
    {
      $lookup: {
        from: "r_track_artist",
        localField: "artist_id",
        foreignField: "artist_id",
        as: "track_artists",
      },
    },
    {
      $unwind: "$track_artists",
    },
    {
      $lookup: {
        from: "tracks",
        localField: "track_artists.track_id",
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
        _id: "$artist_id",
        track_count: { $sum: 1 },
        avg_speechiness: { $avg: "$audio_features.speechiness" },
        most_popular_track: {
          $max: {
            popularity: "$track_details.popularity",
            track_name: "$track_details.name",
          },
        },
      },
    },
    {
      $lookup: {
        from: "artists",
        localField: "_id",
        foreignField: "id",
        as: "artist_details",
      },
    },
    {
      $unwind: "$artist_details",
    },
    {
      $sort: { track_count: -1 },
    },
    {
      $project: {
        _id: 0,
        artist_id: "$_id",
        artist_name: "$artist_details.name",
        track_count: "$track_count",
        avg_speechiness: { $round: ["$avg_speechiness", 4] },
        most_popular_track_name: "$most_popular_track.track_name",
      },
    },
  ],
  {
    allowDiskUse: true,
  }
);
