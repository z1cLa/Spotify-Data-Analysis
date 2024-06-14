// 2h:4min:56sec

db.tracks.aggregate([
  {
    $lookup: {
      from: "audio_features",
      localField: "audio_feature_id",
      foreignField: "id",
      as: "audio_features_info",
    },
  },
  { $unwind: "$audio_features_info" },
  {
    $lookup: {
      from: "r_albums_tracks",
      localField: "id",
      foreignField: "track_id",
      as: "album_tracks",
    },
  },
  { $unwind: "$album_tracks" },
  {
    $lookup: {
      from: "albums",
      localField: "album_tracks.album_id",
      foreignField: "id",
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
      energy: "$audio_features_info.energy",
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
