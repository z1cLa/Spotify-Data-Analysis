//ML#1
db.tracks_optimized.createIndex({ artist_ids: 1 });
db.artists_with_genres.createIndex({ id: 1 });

//ML#2
db.tracks_optimized.createIndex({ "audio_features.loudness": 1 });
db.tracks_optimized.createIndex({ artist_ids: 1 }); // redundant
db.artists_with_genres.createIndex({ id: 1 }); // redundant

//ML#3
db.albums_with_tracks.createIndex({ track_ids: 1 });

//ML#4
db.albums_with_tracks.createIndex({ popularity: -1 });
db.albums_with_tracks.createIndex({ track_ids: 1 }); // redundant
db.tracks_optimized.createIndex({ id: 1 });
db.tracks_optimized.createIndex({ popularity: -1 });
db.tracks_optimized.createIndex({ artist_ids: 1 }); // redundant
db.artists_with_genres.createIndex({ id: 1 }); // redundant

//ML#5
db.albums_with_tracks.createIndex({ track_ids: 1 }); // redundant

//AM#1
db.artists_with_genres.createIndex({ id: 1 }); // redundant
db.tracks_optimized.createIndex({ artist_ids: 1 }); // redundant
db.tracks_optimized.createIndex({
  "audio_features.danceability_energy_ratio": 1,
});

//AM#2
db.artists_with_genres.createIndex({ id: 1 }); // redundant
db.tracks_optimized.createIndex({ artist_ids: 1 }); // redundant
db.tracks_optimized.createIndex({ "audio_features.speechiness": 1 });

//AM#3
db.artists_with_genres.createIndex({ genres: 1 });
db.artists_with_genres.createIndex({ id: 1 }); // redundant
db.tracks_optimized.createIndex({ artist_ids: 1 }); // redundant

//AM#4
db.albums_with_tracks.createIndex({ release_date: 1 });
db.albums_with_tracks.createIndex({ track_ids: 1 }); // redundant
db.tracks_optimized.createIndex({ id: 1 }); // redundant

//AM#5
db.artists_with_genres.createIndex({ id: 1 }); // redundant
db.tracks_optimized.createIndex({ artist_ids: 1 }); // redundant

//OPTIONALLY DROP INDEXES AFTER USING THEM

//ML#1
db.tracks_optimized.dropIndex({ artist_ids: 1 });
db.artists_with_genres.dropIndex({ id: 1 });

//ML#2
db.tracks_optimized.dropIndex({ "audio_features.loudness": 1 });
db.tracks_optimized.dropIndex({ artist_ids: 1 }); // redundant
db.artists_with_genres.dropIndex({ id: 1 }); // redundant

//ML#3
db.albums_with_tracks.dropIndex({ track_ids: 1 });

//ML#4
db.albums_with_tracks.dropIndex({ popularity: -1 });
db.albums_with_tracks.dropIndex({ track_ids: 1 }); // redundant
db.tracks_optimized.dropIndex({ id: 1 });
db.tracks_optimized.dropIndex({ popularity: -1 });
db.tracks_optimized.dropIndex({ artist_ids: 1 }); // redundant
db.artists_with_genres.dropIndex({ id: 1 }); // redundant

//ML#5
db.albums_with_tracks.dropIndex({ track_ids: 1 }); // redundant

//AM#1
db.artists_with_genres.dropIndex({ id: 1 }); // redundant
db.tracks_optimized.dropIndex({ artist_ids: 1 }); // redundant
db.tracks_optimized.dropIndex({
  "audio_features.danceability_energy_ratio": 1,
});

//AM#2
db.artists_with_genres.dropIndex({ id: 1 }); // redundant
db.tracks_optimized.dropIndex({ artist_ids: 1 }); // redundant
db.tracks_optimized.dropIndex({ "audio_features.speechiness": 1 });

//AM#3
db.artists_with_genres.dropIndex({ genres: 1 });
db.artists_with_genres.dropIndex({ id: 1 }); // redundant
db.tracks_optimized.dropIndex({ artist_ids: 1 }); // redundant

//AM#4
db.albums_with_tracks.dropIndex({ release_date: 1 });
db.albums_with_tracks.dropIndex({ track_ids: 1 }); // redundant
db.tracks_optimized.dropIndex({ id: 1 }); // redundant

//AM#5
db.artists_with_genres.dropIndex({ id: 1 }); // redundant
db.tracks_optimized.dropIndex({ artist_ids: 1 }); // redundant
