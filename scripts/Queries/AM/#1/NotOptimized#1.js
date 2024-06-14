// 2h:27min:16s

db.artists.aggregate(
  [
    {
      $lookup: {
        from: "r_track_artist",
        localField: "id",
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
      $match: {
        "audio_features.danceability": { $gt: 0 },
        "audio_features.energy": { $gt: 0 },
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        avg_danceability: { $avg: "$audio_features.danceability" },
        avg_energy: { $avg: "$audio_features.energy" },
      },
    },
    {
      $addFields: {
        danceability_energy_ratio: {
          $divide: ["$avg_danceability", "$avg_energy"],
        },
      },
    },
    {
      $sort: { danceability_energy_ratio: 1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 0,
        artist_id: "$_id",
        name: "$name",
        avg_danceability: { $round: ["$avg_danceability", 2] },
        avg_energy: { $round: ["$avg_energy", 2] },
        danceability_energy_ratio: {
          $round: ["$danceability_energy_ratio", 2],
        },
      },
    },
  ],
  {
    allowDiskUse: true,
  }
);
