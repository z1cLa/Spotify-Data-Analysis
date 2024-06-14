//0.022s

db.tracks_optimized.createIndex({ "audio_features.loudness": 1 });
db.tracks_optimized.createIndex({ artist_ids: 1 });
db.artists_with_genres.createIndex({ id: 1 });

db.tracks_optimized.aggregate([
  {
    $match: {
      "audio_features.loudness": { $ne: null },
    },
  },
  {
    $sort: { "audio_features.loudness": 1 },
  },
  {
    $limit: 200,
  },
  {
    $unwind: "$artist_ids",
  },
  {
    $lookup: {
      from: "artists_with_genres",
      localField: "artist_ids",
      foreignField: "id",
      as: "artist_info",
    },
  },
  { $unwind: "$artist_info" },
  {
    $group: {
      _id: "$artist_info.id",
      artist_name: { $first: "$artist_info.name" },
      genres: { $first: "$artist_info.genres" },
      track_id: { $first: "$id" },
      track_name: { $first: "$name" },
      loudness: { $first: "$audio_features.loudness" },
    },
  },
  {
    $sort: { loudness: 1 },
  },
  {
    $limit: 100,
  },
  {
    $project: {
      artist_name: 1,
      genres: 1,
      track_id: 1,
      track_name: 1,
      loudness: 1,
    },
  },
]);

// db.tracks_optimized.dropIndex({ "audio_features.loudness": 1 });
// db.tracks_optimized.dropIndex({ artist_ids: 1 });
// db.artists_with_genres.dropIndex({ id: 1 });
