//32min:35s

db.audio_features.aggregate([
  {
    $lookup: {
      from: "r_track_artist",
      localField: "id",
      foreignField: "track_id",
      as: "artists",
    },
  },
  { $unwind: "$artists" },
  {
    $group: {
      _id: {
        artist_id: "$artists.artist_id",
        is_studio: { $lte: ["$liveness", 0.2] },
      },
      track_count: { $sum: 1 },
    },
  },
  {
    $group: {
      _id: "$_id.artist_id",
      studio_track_count: {
        $sum: { $cond: [{ $eq: ["$_id.is_studio", true] }, "$track_count", 0] },
      },
      non_studio_track_count: {
        $sum: {
          $cond: [{ $eq: ["$_id.is_studio", false] }, "$track_count", 0],
        },
      },
    },
  },
  {
    $lookup: {
      from: "artists",
      localField: "_id",
      foreignField: "id",
      as: "artist_info",
    },
  },
  { $unwind: "$artist_info" },
  {
    $project: {
      _id: 0,
      artist_id: "$_id",
      artist_name: "$artist_info.name",
      studio_track_count: 1,
      non_studio_track_count: 1,
      studio_non_studio_ratio: {
        $cond: {
          if: { $eq: ["$non_studio_track_count", 0] },
          then: "N/A",
          else: { $divide: ["$studio_track_count", "$non_studio_track_count"] },
        },
      },
    },
  },
  {
    $sort: { studio_track_count: -1 },
  },
  // {
  //   $limit: 200,
  // },
]);
