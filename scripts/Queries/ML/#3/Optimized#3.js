//1min:28sec

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
      album_id: "$album_info.id",
      album_name: "$album_info.name",
      duration: "$duration",
    },
  },
  {
    $group: {
      _id: {
        year: "$year",
        album_id: "$album_id",
        album_name: "$album_name",
      },
      avg_duration: { $avg: "$duration" },
    },
  },
  {
    $sort: {
      "_id.year": 1,
      avg_duration: -1,
    },
  },
  {
    $group: {
      _id: "$_id.year",
      album_id: { $first: "$_id.album_id" },
      album_name: { $first: "$_id.album_name" },
      avg_duration: { $first: "$avg_duration" },
    },
  },
  {
    $project: {
      _id: 0,
      year: "$_id",
      album_id: 1,
      album_name: 1,
      avg_duration: 1,
    },
  },
  {
    $sort: { year: 1 },
  },
]);

//db.albums_with_tracks.dropIndex({ track_ids: 1 });
