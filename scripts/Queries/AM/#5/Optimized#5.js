//19s

db.artists_with_genres.createIndex({ id: 1 });
db.tracks_optimized.createIndex({ artist_ids: 1 });

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
      $group: {
        _id: "$id",
        name: { $first: "$name" },
        followers: { $first: "$followers" },
        track_count: { $sum: 1 },
      },
    },
    {
      $match: {
        followers: { $gt: 0 },
        track_count: { $gt: 0 },
      },
    },
    {
      $addFields: {
        ratio: { $divide: ["$followers", "$track_count"] },
      },
    },
    {
      $sort: { ratio: -1 },
    },
    {
      $limit: 100,
    },
    {
      $project: {
        _id: 0,
        artist_id: "$_id",
        name: "$name",
        followers: "$followers",
        track_count: "$track_count",
        ratio: "$ratio",
      },
    },
  ],
  {
    allowDiskUse: true,
  }
);

//db.artists_with_genres.dropIndex({ id: 1 });
//db.tracks_optimized.dropIndex({ artist_ids: 1 });
