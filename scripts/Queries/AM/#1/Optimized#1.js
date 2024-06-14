//24s

db.artists_with_genres.createIndex({ id: 1 });
db.tracks_optimized.createIndex({ artist_ids: 1 });
db.tracks_optimized.createIndex({
  "audio_features.danceability_energy_ratio": 1,
});

db.artists_with_genres.aggregate(
  [
    {
      $lookup: {
        from: "tracks_optimized",
        localField: "id",
        foreignField: "artist_ids",
        as: "tracks",
      },
    },
    {
      $unwind: "$tracks",
    },
    {
      $match: {
        "tracks.audio_features.danceability_energy_ratio": { $gt: 0 },
      },
    },
    {
      $group: {
        _id: "$id",
        name: { $first: "$name" },
        avg_danceability_energy_ratio: {
          $avg: "$tracks.audio_features.danceability_energy_ratio",
        },
      },
    },
    {
      $sort: { avg_danceability_energy_ratio: 1 },
    },
    {
      $limit: 10,
    },
    {
      $project: {
        _id: 0,
        artist_id: "$_id",
        name: "$name",
        avg_danceability_energy_ratio: {
          $round: ["$avg_danceability_energy_ratio", 2],
        },
      },
    },
  ],
  {
    allowDiskUse: true,
  }
);

//db.artists_with_genres.dropIndex({ id: 1 });
//db.tracks_optimized.dropIndex({ artist_ids: 1 });
//db.tracks_optimized.dropIndex({ "audio_features.danceability_energy_ratio": 1 });
