//15.319s

db.tracks_optimized.createIndex({ artist_ids: 1 });
db.artists_with_genres.createIndex({ id: 1 });

db.tracks_optimized.aggregate(
  [
    {
      $unwind: "$artist_ids",
    },
    {
      $group: {
        _id: {
          artist_id: "$artist_ids",
          is_studio: { $lte: ["$audio_features.liveness", 0.2] },
        },
        track_count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: "$_id.artist_id",
        studio_track_count: {
          $sum: {
            $cond: [{ $eq: ["$_id.is_studio", true] }, "$track_count", 0],
          },
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
        from: "artists_with_genres",
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
        genres: "$artist_info.genres",
        studio_track_count: 1,
        non_studio_track_count: 1,
        studio_non_studio_ratio: {
          $cond: {
            if: { $eq: ["$non_studio_track_count", 0] },
            then: "N/A",
            else: {
              $divide: ["$studio_track_count", "$non_studio_track_count"],
            },
          },
        },
      },
    },
    {
      $sort: { studio_track_count: -1 },
    },
  ],
  { allowDiskUse: true }
);

//db.tracks_optimized.dropIndex({ artist_ids: 1 });
//db.artists_with_genres.dropIndex({ id: 1 });
