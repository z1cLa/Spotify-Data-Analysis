//0.15s

db.artists_with_genres.createIndex({ id: 1 });
db.tracks_optimized.createIndex({ artist_ids: 1 });
db.tracks_optimized.createIndex({ "audio_features.speechiness": 1 });

db.artists_with_genres.aggregate(
  [
    {
      $match: { genres: "rap" },
    },
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
        "tracks.audio_features.speechiness": { $gt: 0 },
      },
    },
    {
      $group: {
        _id: "$id",
        name: { $first: "$name" },
        track_count: { $sum: 1 },
        avg_speechiness: { $avg: "$tracks.audio_features.speechiness" },
        max_popularity: { $max: "$tracks.popularity" },
        tracks: { $push: "$tracks" },
      },
    },
    {
      $project: {
        name: 1,
        track_count: 1,
        avg_speechiness: 1,
        most_popular_track: {
          $arrayElemAt: [
            {
              $filter: {
                input: "$tracks",
                as: "track",
                cond: { $eq: ["$$track.popularity", "$max_popularity"] },
              },
            },
            0,
          ],
        },
      },
    },
    {
      $sort: { track_count: -1 },
    },
    {
      $project: {
        _id: 0,
        artist_id: "$_id",
        artist_name: "$name",
        track_count: 1,
        avg_speechiness: { $round: ["$avg_speechiness", 4] },
        most_popular_track_name: "$most_popular_track.name",
      },
    },
  ],
  {
    allowDiskUse: true,
  }
);

//db.artists_with_genres.dropIndex({ id: 1 });
//db.tracks_optimized.dropIndex({ artist_ids: 1 });
//db.tracks_optimized.dropIndex({ "audio_features.speechiness": 1 });
