//27min:23s

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
