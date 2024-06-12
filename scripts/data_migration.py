import pandas as pd
import sqlite3
from pymongo import MongoClient
from timeit import default_timer as timer

# Start the timer
start_time = timer()

# Configuration constants
BATCH_SIZE = 500000
DATE_THRESHOLD = 1494626400000 # 13.05.2017, first night out
                 
# Database connections
mongo_uri = "mongodb://localhost:27017/"
mongo_db_name = "spotify-original"
sqlite_db_path = "spotify.sqlite"

# Initialize MongoDB client and database
mongo_client = MongoClient(mongo_uri, username="z1", password="z1")
mongo_db = mongo_client[mongo_db_name]

# Initialize SQLite connection
sqlite_conn = sqlite3.connect(sqlite_db_path, isolation_level=None, detect_types=sqlite3.PARSE_COLNAMES)
sqlite_conn.text_factory = lambda b: b.decode(errors='ignore')

def migrate_data_to_mongo(table_name, query):
    """
    Retrieves data from SQLite using the given query and inserts it into the specified MongoDB collection in batches.
    """
    print(f"Transferring data for '{table_name}'...")
    data = pd.read_sql_query(query, sqlite_conn)
    print("Transforming data to dictionary format...")
    
    for start_idx in range(0, len(data), BATCH_SIZE):
        end_idx = start_idx + BATCH_SIZE
        batch = data.iloc[start_idx:end_idx]
        print(f"Processing batch {start_idx // BATCH_SIZE}:")
        print(batch.head())
        records = batch.to_dict(orient='records')
        mongo_db[table_name].insert_many(records)
        del batch, records
    
    del data
    print(f"Completed transfer for '{table_name}'")
    print("=========================================")

# Define table queries
queries = {
    "albums": "SELECT * FROM albums",

    "artists": "SELECT * FROM artists WHERE id IN (SELECT artist_id FROM r_albums_artists)",

    "audio_features": """
        SELECT *
        FROM audio_features
        WHERE id IN (SELECT id FROM tracks WHERE id IN (SELECT track_id FROM r_albums_tracks))
    """,

    "tracks": """
        SELECT *
        FROM tracks
        WHERE id IN (SELECT track_id FROM r_albums_tracks)
    """,

    "genres": "SELECT * FROM genres",

    "r_albums_artists": "SELECT * FROM r_albums_artists",

    "r_albums_tracks": "SELECT * FROM r_albums_tracks",

    "r_track_artist": """
        SELECT * FROM r_track_artist
        WHERE track_id IN (SELECT id FROM tracks WHERE id IN (SELECT track_id FROM r_albums_tracks))
    """,

    "r_artist_genre": """
        SELECT * FROM r_artist_genre
        WHERE artist_id IN (SELECT id FROM artists WHERE id IN (SELECT artist_id FROM r_albums_artists))
    """

}


# FIRSTLY OPTIMIZED QUERIES
optimizedQueries = {
    "albums": f"SELECT id, name, album_type, release_date, popularity FROM albums WHERE release_date > {DATE_THRESHOLD}",

    "artists": f"SELECT * FROM artists WHERE id in (SELECT artist_id FROM r_albums_artists WHERE album_id in (SELECT id FROM albums WHERE release_date > {DATE_THRESHOLD}))",

    "audio_features": f"""
        SELECT id, ROUND(acousticness, 5) AS acousticness, ROUND(danceability, 5) AS danceability,
               duration, ROUND(energy, 5) AS energy, ROUND(instrumentalness, 5) AS instrumentalness,
               key, ROUND(liveness, 5) AS liveness, ROUND(loudness, 5) AS loudness, mode,
               ROUND(speechiness, 5) AS speechiness, ROUND(tempo, 5) AS tempo, time_signature,
               ROUND(valence, 5) AS valence
        FROM audio_features
        WHERE id IN (SELECT id FROM tracks WHERE id IN (SELECT track_id FROM r_albums_tracks WHERE album_id IN (SELECT id FROM albums WHERE release_date > {DATE_THRESHOLD})))
    """,

    "tracks": f"""
        SELECT id, duration, explicit, audio_feature_id, name, popularity
        FROM tracks
        WHERE id IN (SELECT track_id FROM r_albums_tracks WHERE album_id IN (SELECT id FROM albums WHERE release_date > {DATE_THRESHOLD}))
    """,

    "r_albums_artists": f"SELECT * FROM r_albums_artists WHERE album_id in (SELECT id FROM albums WHERE release_date > {DATE_THRESHOLD})",

    "r_albums_tracks": f"SELECT * FROM r_albums_tracks WHERE album_id in (SELECT id FROM albums WHERE release_date > {DATE_THRESHOLD})",

    "r_track_artist": f"""
        SELECT * FROM r_track_artist
        WHERE track_id IN (SELECT id FROM tracks WHERE id IN (SELECT track_id FROM r_albums_tracks WHERE album_id IN (SELECT id FROM albums WHERE release_date > {DATE_THRESHOLD})))
    """,

    "r_artist_genre": f"""
        SELECT * FROM r_artist_genre
        WHERE artist_id IN (SELECT id FROM artists WHERE id IN (SELECT artist_id FROM r_albums_artists WHERE album_id IN (SELECT id FROM albums WHERE release_date > {DATE_THRESHOLD})))
    """


}

# Migrate data for each table
for table, sql_query in optimizedQueries.items(): # queries.items()
    migrate_data_to_mongo(table, sql_query)

# Close SQLite connection
sqlite_conn.close()

# Stop the timer and print elapsed time
end_time = timer()
print(f"Total Elapsed Time: {end_time - start_time:.2f} seconds")
