//1min:24sec

db.albums_with_tracks.createIndex({ track_ids: 1 });

db.tracks_optimized.aggregate([
  {
    $lookup: {
      from: "albums_with_tracks",
      localField: "id",
      foreignField: "track_ids",
      as: "album_info",
    },
  },
  { $unwind: "$album_info" },
  {
    $addFields: {
      release_date_as_date: { $toDate: "$album_info.release_date" },
    },
  },
  {
    $project: {
      year: { $year: "$release_date_as_date" },
      energy: "$audio_features.energy",
    },
  },
  {
    $group: {
      _id: "$year",
      avg_energy: { $avg: "$energy" },
    },
  },
  {
    $sort: {
      avg_energy: -1,
    },
  },
  {
    $project: {
      _id: 0,
      year: "$_id",
      avg_energy: 1,
    },
  },
]);

// db.albums_with_tracks.dropIndex({ track_ids: 1 });
