//1min:52s

db.albums_with_tracks.createIndex({ release_date: 1 });
db.albums_with_tracks.createIndex({ track_ids: 1 });
db.tracks_optimized.createIndex({ id: 1 });

db.albums_with_tracks.aggregate(
  [
    {
      $project: {
        year: { $year: { $toDate: "$release_date" } },
        album_id: "$id",
        track_ids: 1,
      },
    },
    {
      $unwind: "$track_ids",
    },
    {
      $lookup: {
        from: "tracks_optimized",
        localField: "track_ids",
        foreignField: "id",
        as: "track_details",
      },
    },
    {
      $unwind: "$track_details",
    },
    {
      $group: {
        _id: { year: "$year", album_id: "$album_id" },
        avg_acousticness: {
          $avg: "$track_details.audio_features.acousticness",
        },
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

//db.albums_with_tracks.dropIndex({ release_date: 1 });
//db.albums_with_tracks.dropIndex({ track_ids: 1 });
//db.tracks_optimized.dropIndex({ id: 1 });
