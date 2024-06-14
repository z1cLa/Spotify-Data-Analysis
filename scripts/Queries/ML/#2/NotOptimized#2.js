//31min:50s

/*
Izlistati jedinstvene izvodjace i njihove najtise pesme
Izvođači sve više teže ka glasnim pesmama da bi podstakli adrenalin slušaoca.Zanima nas ko najmanje koristi to u svoju korist.
Cilj ovog upita je pronaći top 100 najtiših pesama sa jedinstvenim izvođačima. 
Upit koristi podatke iz kolekcija audio_features, tracks, r_track_artist, i artists kako bi pronašao pesme sa najnižom glasnoćom i prikazao izvođače tih pesama,
 osiguravajući da svaki izvođač bude prikazan samo jednom sa svojom najtišom pesmom.
*/

db.audio_features.aggregate([
  {
    $sort: { loudness: 1 }, // Sortiramo pesme po glasnoći u rastućem redosledu
  },
  {
    $limit: 200, // Ograničavamo rezultat na top 1000 najtiših pesama
  },
  {
    $lookup: {
      from: "tracks",
      localField: "id",
      foreignField: "audio_feature_id",
      as: "track_info",
    },
  },
  { $unwind: "$track_info" },
  {
    $lookup: {
      from: "r_track_artist",
      localField: "track_info.id",
      foreignField: "track_id",
      as: "artist_tracks",
    },
  },
  { $unwind: "$artist_tracks" },
  {
    $lookup: {
      from: "artists",
      localField: "artist_tracks.artist_id",
      foreignField: "id",
      as: "artist_info",
    },
  },
  { $unwind: "$artist_info" },
  {
    $group: {
      _id: "$artist_info.id",
      artist_name: { $first: "$artist_info.name" },
      track_id: { $first: "$track_info.id" },
      track_name: { $first: "$track_info.name" },
      loudness: { $first: "$loudness" },
    },
  },
  {
    $sort: { loudness: 1 },
  },
  {
    $limit: 100,
  },
  {
    $project: {
      artist_name: 1,
      track_id: 1,
      track_name: 1,
      loudness: 1,
    },
  },
]);
