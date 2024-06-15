// db.audio_features.createIndex({ id: 1 });

db.tracks_with_artists.aggregate(
  [
    {
      $lookup: {
        from: "audio_features",
        localField: "id",
        foreignField: "id",
        pipeline: [
          {
            $project: {
              _id: 0,
              id: 0,
              duration: 0,
              instrumentalness: 0,
              key: 0,
              mode: 0,
              tempo: 0,
              time_signature: 0,
              valence: 0,
            },
          },
        ],
        as: "audio_features",
      },
    },
    { $unwind: { path: "$audio_features", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        audio_features: {
          $cond: {
            if: { $eq: ["$audio_features", null] },
            then: {},
            else: "$audio_features",
          },
        },
      },
    },
    { $out: "tracks_with_artists_and_af" },
  ],
  { allowDiskUse: true }
);

// db.audio_features.dropIndex({ id: 1 });
// db.tracks_with_artists.drop();
