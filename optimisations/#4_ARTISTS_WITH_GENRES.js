// Kreiranje potrebnih indeksa
db.artists.createIndex({ id: 1 });
db.r_artist_genre.createIndex({ artist_id: 1 });

db.artists.aggregate(
  [
    {
      $lookup: {
        from: "r_artist_genre",
        localField: "id",
        foreignField: "artist_id",
        as: "artist_genres",
      },
    },
    {
      $addFields: {
        genres: "$artist_genres.genre_id",
      },
    },
    {
      $project: {
        _id: 1,
        id: 1,
        name: 1,
        popularity: 1,
        followers: 1,
        genres: {
          $cond: {
            if: { $gt: [{ $size: "$genres" }, 0] },
            then: "$genres",
            else: [],
          },
        },
      },
    },
    {
      $out: "artists_with_genres",
    },
  ],
  { allowDiskUse: true }
);
