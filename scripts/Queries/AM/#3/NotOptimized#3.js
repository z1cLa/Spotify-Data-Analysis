//51min:2s

db.r_artist_genre.aggregate(
  [
    {
      $lookup: {
        from: "artists",
        localField: "artist_id",
        foreignField: "id",
        as: "artist_details",
      },
    },
    {
      $unwind: "$artist_details",
    },
    {
      $group: {
        _id: {
          genre_id: "$genre_id",
          artist_id: "$artist_id",
        },
        artist_name: { $first: "$artist_details.name" },
        followers: { $first: "$artist_details.followers" },
        genre_id: { $first: "$genre_id" },
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
        from: "r_track_artist",
        localField: "artist_id",
        foreignField: "artist_id",
        as: "track_artists",
      },
    },
    {
      $unwind: "$track_artists",
    },
    {
      $lookup: {
        from: "tracks",
        localField: "track_artists.track_id",
        foreignField: "id",
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
