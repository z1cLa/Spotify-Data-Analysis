//0.212s

db.albums_with_tracks.createIndex({ popularity: -1 });
db.albums_with_tracks.createIndex({ track_ids: 1 });
db.tracks_optimized.createIndex({ id: 1 });
db.tracks_optimized.createIndex({ popularity: -1 });
db.tracks_optimized.createIndex({ artist_ids: 1 });
db.artists_with_genres.createIndex({ id: 1 });

db.albums_with_tracks.aggregate([
  {
    $sort: { popularity: -1 },
  },
  {
    $limit: 100,
  },
  { $unwind: "$track_ids" },
  {
    $lookup: {
      from: "tracks_optimized",
      localField: "track_ids",
      foreignField: "id",
      as: "track_info",
    },
  },
  { $unwind: "$track_info" },
  {
    $lookup: {
      from: "artists_with_genres",
      localField: "track_info.artist_ids",
      foreignField: "id",
      as: "artist_info",
    },
  },
  { $unwind: "$artist_info" },
  {
    $group: {
      _id: {
        album_id: "$_id",
        album_name: "$name",
        track_id: "$track_info.id",
        track_name: "$track_info.name",
        track_popularity: "$track_info.popularity",
        track_duration: "$track_info.duration",
        artist_id: "$artist_info.id",
        artist_name: "$artist_info.name",
        genres: "$artist_info.genres",
      },
      album_popularity: { $first: "$popularity" },
      track_popularity_sum: { $sum: "$track_info.popularity" },
      track_count: { $sum: 1 },
    },
  },
  {
    $sort: { track_popularity_sum: -1 },
  },
  {
    $group: {
      _id: "$_id.album_id",
      album_name: { $first: "$_id.album_name" },
      album_popularity: { $first: "$album_popularity" },
      avg_popularity: { $avg: "$_id.track_popularity" },
      track_count: { $first: "$track_count" },
      top_tracks: {
        $push: {
          track_id: "$_id.track_id",
          track_name: "$_id.track_name",
          track_popularity: "$_id.track_popularity",
          track_duration: "$_id.track_duration",
          artist_id: "$_id.artist_id",
          artist_name: "$_id.artist_name",
          genres: "$_id.genres",
        },
      },
    },
  },
  {
    $project: {
      album_id: "$_id",
      album_name: 1,
      album_popularity: 1,
      avg_popularity: 1,
      track_count: 1,
      top_tracks: { $slice: ["$top_tracks", 3] },
    },
  },
  {
    $sort: { album_popularity: -1 },
  },
]);

//db.albums_with_tracks.dropIndex({ popularity: -1 });
//db.albums_with_tracks.dropIndex({ track_ids: 1 });
//db.tracks_optimized.dropIndex({ id: 1 });
//db.tracks_optimized.dropIndex({ popularity: -1 });
//db.tracks_optimized.dropIndex({ artist_ids: 1 });
//db.artists_with_genres.dropIndex({ id: 1 });
