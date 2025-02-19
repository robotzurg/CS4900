-- NOTE: The site uses NeonDB, which already creates a database for me.
-- As a result, you may not need the CREATE DATABASE and \c commands if you have something like that.

-- Create a New Database
CREATE DATABASE waveform_db;

-- Connect to the new database
\c waveform_db;

-- Create pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE Users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_access_token TEXT,
  spotify_refresh_token TEXT,
  lfm_username TEXT,
  discord_embed_color TEXT,
  discord_mailbox_dm BOOLEAN DEFAULT FALSE,
  discord_review_ping BOOLEAN DEFAULT FALSE,
  bio TEXT,
  spotify_mailbox_playlist_id TEXT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  discord_user_id TEXT UNIQUE,
  discord_username TEXT,
  friends_list UUID[]
);

-- Songs Table
CREATE TABLE Songs (
  song_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  release_date DATE NOT NULL,
  image_url TEXT,
  spotify_link TEXT,
  spotify_uri TEXT,
  soundcloud_link TEXT,
  apple_link TEXT,
  youtube_link TEXT
);

-- Albums Table
CREATE TABLE Albums (
  album_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  release_date DATE NOT NULL,
  image_url TEXT,
  spotify_link TEXT,
  spotify_uri TEXT,
  soundcloud_link TEXT,
  apple_link TEXT,
  youtube_link TEXT
);

-- Genres Table
CREATE TABLE Genres (
  genre_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

-- Artists Table
CREATE TABLE Artists (
  artist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT,
  bio TEXT
);

-- Song_Artists Table
CREATE TABLE Song_Artists (
  song_id UUID REFERENCES Songs(song_id) ON DELETE CASCADE,
  artist_id UUID REFERENCES Artists(artist_id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, artist_id)
);

-- Song_Genres Table
CREATE TABLE Song_Genres (
  song_id UUID REFERENCES Songs(song_id) ON DELETE CASCADE,
  genre_id UUID REFERENCES Genres(genre_id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, genre_id)
);

-- Album_Artists Table
CREATE TABLE Album_Artists (
  album_id UUID REFERENCES Albums(album_id) ON DELETE CASCADE,
  artist_id UUID REFERENCES Artists(artist_id) ON DELETE CASCADE,
  PRIMARY KEY (album_id, artist_id)
);

-- Album_Genres Table
CREATE TABLE Album_Genres (
  album_id UUID REFERENCES Albums(album_id) ON DELETE CASCADE,
  genre_id UUID REFERENCES Genres(genre_id) ON DELETE CASCADE,
  PRIMARY KEY (album_id, genre_id)
);

-- Song_Albums Table
CREATE TABLE Song_Albums (
  song_id UUID REFERENCES Songs(song_id) ON DELETE CASCADE,
  album_id UUID REFERENCES Albums(album_id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, album_id)
);

-- Reviews Table
CREATE TABLE Reviews (
  review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES Users(user_id),
  timestamp DATE NOT NULL,
  favorited BOOLEAN NOT NULL,
  review_text TEXT,
  rating NUMERIC(3, 1),
  user_sent_by_id UUID,
  discord_url TEXT,
  discord_guild_id TEXT,
  discord_message_id TEXT,
  discord_channel_id TEXT
);

-- Comments Table
CREATE TABLE Comments (
  comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES Reviews(review_id) ON DELETE CASCADE,
  user_id UUID REFERENCES Users(user_id),
  comment_text TEXT NOT NULL,
  timestamp DATE NOT NULL
);

-- Mail Table
CREATE TABLE Mail (
  mail_id UUID PRIMARY KEY,
  sender_id UUID REFERENCES Users(user_id),
  receiver_id UUID REFERENCES Users(user_id),
  song_id UUID REFERENCES Songs(song_id),
  album_id UUID REFERENCES Albums(album_id),
  timestamp DATE NOT NULL,
  CONSTRAINT check_song_or_album CHECK (
    (song_id IS NOT NULL AND album_id IS NULL) OR
    (album_id IS NOT NULL AND song_id IS NULL)
  )
);

-- Discord_Server_Config Table
CREATE TABLE Discord_Server_Config (
  discord_server_id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  disable_ratings BOOLEAN NOT NULL,
  disable_global_reviews BOOLEAN NOT NULL
);

