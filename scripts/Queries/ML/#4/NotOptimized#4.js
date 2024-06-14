//41min:10s

/*
Koje su najpopularnije pesme sa najpopularnijih albuma?
Izvođači često traže najpopularnije pesme sa najpopularnijih albuma kako bi ih najviše promovisali,
 što pomaže u boljoj promociji albuma i povećanju popularnosti izvođača. Cilj ovog upita je obezbeđivanje izvođačima te ključne informacije, 
 uključujući ime albuma, prosečnu popularnost pesama na albumu, broj pesama na albumu, i detalje o izvođačima pesama. 
 Upit koristi podatke iz kolekcija albums, r_albums_tracks, tracks, r_track_artist, artists, r_artist_genre, i genres kako bi pronašao top 3 najpopularnije pesme sa top 100 najpopularnijih albuma,
 zajedno sa dodatnim informacijama o pesmama i izvođačima, uključujući trajanje pesama i žanrove izvođača.
*/

db.albums.aggregate([
  {
    $sort: { popularity: -1 },
  },
  {
    $limit: 100,
  },
  {
    $lookup: {
      from: "r_albums_tracks",
      localField: "id",
      foreignField: "album_id",
      as: "album_tracks",
    },
  },
  { $unwind: "$album_tracks" },
  {
    $lookup: {
      from: "tracks",
      localField: "album_tracks.track_id",
      foreignField: "id",
      as: "track_info",
    },
  },
  { $unwind: "$track_info" },
  {
    $lookup: {
      from: "r_track_artist",
      localField: "track_info.id",
      foreignField: "track_id",
      as: "track_artists",
    },
  },
  { $unwind: "$track_artists" },
  {
    $lookup: {
      from: "artists",
      localField: "track_artists.artist_id",
      foreignField: "id",
      as: "artist_info",
    },
  },
  { $unwind: "$artist_info" },
  {
    $lookup: {
      from: "r_artist_genre",
      localField: "artist_info.id",
      foreignField: "artist_id",
      as: "artist_genres",
    },
  },
  { $unwind: { path: "$artist_genres", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "genres",
      localField: "artist_genres.genre_id",
      foreignField: "id",
      as: "genre_info",
    },
  },
  { $unwind: { path: "$genre_info", preserveNullAndEmptyArrays: true } },
  {
    $group: {
      _id: {
        album_id: "$id",
        album_name: "$name",
        track_id: "$track_info.id",
        track_name: "$track_info.name",
        track_popularity: "$track_info.popularity",
        track_duration: "$track_info.duration",
        artist_id: "$artist_info.id",
        artist_name: "$artist_info.name",
        genre: "$genre_info.name",
      },
      album_popularity: { $first: "$popularity" },
      track_popularity_sum: { $sum: "$track_info.popularity" },
      track_count: { $sum: 1 },
    },
  },
  {
    $sort: { "_id.track_popularity": -1 },
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
          genre: "$_id.genre",
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
]);
