db.tracks_with_artists_and_af.aggregate(
  [
    {
      $addFields: {
        "audio_features.danceability_energy_ratio": {
          $cond: {
            if: { $ne: ["$audio_features.energy", 0] },
            then: {
              $divide: [
                "$audio_features.danceability",
                "$audio_features.energy",
              ],
            },
            else: null,
          },
        },
      },
    },
    {
      $out: "tracks_optimized",
    },
  ],
  { allowDiskUse: true }
);

// db.tracks_with_artists_and_af.drop();
