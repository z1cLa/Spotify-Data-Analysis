//2.8s

db.artists_with_genres.createIndex({ genres: 1 });
db.artists_with_genres.createIndex({ id: 1 });
db.tracks_optimized.createIndex({ artist_ids: 1 });

db.artists_with_genres.aggregate(
  [
    {
      $unwind: "$genres",
    },
    {
      $group: {
        _id: {
          genre_id: "$genres",
          artist_id: "$id",
        },
        artist_name: { $first: "$name" },
        followers: { $first: "$followers" },
        genre_id: { $first: "$genres" },
      },
    },
    {
      $sort: {
        followers: -1,
      },
    },
    {
      $group: {
        _id: "$_id.genre_id",
        artist_id: { $first: "$_id.artist_id" },
        artist_name: { $first: "$artist_name" },
        followers: { $first: "$followers" },
        genre_id: { $first: "$genre_id" },
      },
    },
    {
      $lookup: {
        from: "tracks_optimized",
        localField: "artist_id",
        foreignField: "artist_ids",
        as: "track_details",
      },
    },
    {
      $unwind: "$track_details",
    },
    {
      $group: {
        _id: {
          genre_id: "$_id",
          artist_id: "$artist_id",
        },
        artist_name: { $first: "$artist_name" },
        followers: { $first: "$followers" },
        genre_id: { $first: "$genre_id" },
        most_popular_track: {
          $max: {
            popularity: "$track_details.popularity",
            track_name: "$track_details.name",
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id.genre_id",
        artist_id: { $first: "$_id.artist_id" },
        artist_name: { $first: "$artist_name" },
        followers: { $first: "$followers" },
        track_name: { $first: "$most_popular_track.track_name" },
      },
    },
    {
      $project: {
        _id: 0,
        genre_id: "$_id",
        artist_id: "$artist_id",
        artist_name: "$artist_name",
        followers: "$followers",
        track_name: "$track_name",
      },
    },
  ],
  {
    allowDiskUse: true,
  }
);

//db.artists_with_genres.dropIndex({ genres: 1 });
//db.artists_with_genres.dropIndex({ id: 1 });
//db.tracks_optimized.dropIndex({ artist_ids: 1 });
