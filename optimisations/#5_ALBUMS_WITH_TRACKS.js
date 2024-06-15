db.albums.createIndex({ id: 1 });
db.r_albums_tracks.createIndex({ album_id: 1 });
db.r_albums_tracks.createIndex({ album_id: 1, track_id: 1 });

db.albums.aggregate([
  {
    $lookup: {
      from: "r_albums_tracks",
      localField: "id",
      foreignField: "album_id",
      as: "tracks",
    },
  },
  {
    $project: {
      id: 1,
      name: 1,
      album_type: 1,
      release_date: 1,
      popularity: 1,
      track_ids: "$tracks.track_id",
    },
  },
  {
    $out: "albums_with_tracks",
  },
]);

// db.albums.dropIndex({ id: 1 });
// db.r_albums_tracks.dropIndex({ album_id: 1 });
// db.r_albums_tracks.dropIndex({ album_id: 1, track_id: 1 });
