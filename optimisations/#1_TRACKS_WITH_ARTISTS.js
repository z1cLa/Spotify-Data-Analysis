// db.tracks.createIndex({ id: 1 });
// db.r_track_artist.createIndex({ track_id: 1 });
// db.artists.createIndex({ id: 1 });

db.tracks.aggregate(
  [
    {
      $lookup: {
        from: "r_track_artist",
        localField: "id",
        foreignField: "track_id",
        as: "artists_info",
      },
    },
    { $unwind: { path: "$artists_info", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "artists",
        localField: "artists_info.artist_id",
        foreignField: "id",
        as: "artist_info",
      },
    },
    { $unwind: { path: "$artist_info", preserveNullAndEmptyArrays: true } },
    {
      $group: {
        _id: "$id",
        id: { $first: "$id" },
        name: { $first: "$name" },
        audio_feature_id: { $first: "$audio_feature_id" },
        popularity: { $first: "$popularity" },
        duration: { $first: "$duration" },
        explicit: { $first: "$explicit" },
        artist_ids: { $addToSet: "$artist_info.id" },
      },
    },
    {
      $addFields: {
        artist_ids: {
          $cond: {
            if: { $eq: [{ $type: "$artist_ids" }, "array"] },
            then: "$artist_ids",
            else: [],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        audio_feature_id: 1,
        popularity: 1,
        duration: 1,
        explicit: 1,
        artist_ids: 1,
      },
    },
    {
      $out: "tracks_with_artists",
    },
  ],
  { allowDiskUse: true }
);

// db.tracks.dropIndex({ id: 1 });
// db.r_track_artist.dropIndex({ track_id: 1 });
// db.artists.dropIndex({ id: 1 });
