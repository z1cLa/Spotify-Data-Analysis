//#1
db.tracks.createIndex({ id: 1 });
db.r_track_artist.createIndex({ track_id: 1 });
db.artists.createIndex({ id: 1 });

//#2
db.audio_features.createIndex({ id: 1 });

//#4
db.artists.createIndex({ id: 1 });
db.r_artist_genre.createIndex({ artist_id: 1 });

//#5
db.albums.createIndex({ id: 1 });
db.r_albums_tracks.createIndex({ album_id: 1 });
db.r_albums_tracks.createIndex({ album_id: 1, track_id: 1 });

//DROP COLLECTIONS BETWEEN SCRIPTS
db.tracks_with_artists.drop();
db.tracks_with_artists_and_af.drop();

db.audio_features.drop();
db.r_albums_tracks.drop();
db.r_artist_genre.drop();
db.r_track_artist.drop();
db.tracks.drop();
db.artists.drop();
db.albums.drop();

//OPTIONAL - DROP INDEXES AFTER USING THEM
//#1
db.tracks.dropIndex({ id: 1 });
db.r_track_artist.dropIndex({ track_id: 1 });
db.artists.dropIndex({ id: 1 });

//#2
db.audio_features.dropIndex({ id: 1 });

//#4
db.artists.dropIndex({ id: 1 });
db.r_artist_genre.dropIndex({ artist_id: 1 });

//#5
db.albums.dropIndex({ id: 1 });
db.r_albums_tracks.dropIndex({ album_id: 1 });
db.r_albums_tracks.dropIndex({ album_id: 1, track_id: 1 });
