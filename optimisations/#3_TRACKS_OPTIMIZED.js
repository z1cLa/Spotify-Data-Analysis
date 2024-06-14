db.tracks_with_artists_and_af.aggregate(
  [
    {
      $addFields: {
        "audio_features.danceability_energy_ratio": {
          $cond: {
            if: { $ne: ["$audio_features.energy", 0] }, // Check to avoid division by zero
            then: {
              $divide: [
                "$audio_features.danceability",
                "$audio_features.energy",
              ],
            },
            else: null, // Set to null if energy is zero
          },
        },
      },
    },
    {
      $out: "tracks_optimized", // Output to a new collection
    },
  ],
  { allowDiskUse: true }
);

// db.tracks_with_artists_and_af.drop();
