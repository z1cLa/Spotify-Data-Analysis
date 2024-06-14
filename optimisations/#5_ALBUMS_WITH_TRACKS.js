db.albums.createIndex({ id: 1 });
db.r_albums_tracks.createIndex({ album_id: 1 });
db.r_albums_tracks.createIndex({ album_id: 1, track_id: 1 });

db.albums.aggregate([
  {
    $lookup: {
      from: "r_albums_tracks", // kolekcija iz koje dohvaćamo podatke
      localField: "id", // polje u `albums` po kojem se spaja
      foreignField: "album_id", // polje u `r_albums_tracks` po kojem se spaja
      as: "tracks", // ime novog polja koje sadrži spojene dokumente
    },
  },
  {
    $project: {
      id: 1, // uključivanje polja id
      name: 1, // uključivanje polja name
      album_type: 1, // uključivanje polja album_type
      release_date: 1, // uključivanje polja release_date
      popularity: 1, // uključivanje polja popularity
      track_ids: "$tracks.track_id", // stvaranje niza ID-ova traka
    },
  },
  {
    $out: "albums_with_tracks", // snimanje rezultata u novu kolekciju
  },
]);

// db.albums.dropIndex({ id: 1 });
// db.r_albums_tracks.dropIndex({ album_id: 1 });
// db.r_albums_tracks.dropIndex({ album_id: 1, track_id: 1 });
