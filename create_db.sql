-- NOTE: The site uses NeonDB, which already creates a database for me.
-- As a result, you may not need the CREATE DATABASE and \c commands if you have something like that.

-- Create a New Database
CREATE DATABASE waveform_db;

-- Connect to the new database
\c waveform_db;

-- Users Table
CREATE TABLE Users (
  user_id UUID PRIMARY KEY,
  spotify_access_token TEXT,
  spotify_refresh_token TEXT,
  lfm_username TEXT,
  discord_embed_color TEXT,
  discord_mailbox_dm BOOLEAN DEFAULT FALSE,
  discord_review_ping BOOLEAN DEFAULT FALSE,
  bio TEXT,
  spotify_mailbox_playlist_id TEXT,
  username TEXT UNIQUE,
  password TEXT,
  email TEXT UNIQUE,
  discord_user_id TEXT UNIQUE,
  discord_username TEXT,
  friends_list UUID[]
);

-- Songs Table
CREATE TABLE Songs (
  song_id UUID PRIMARY KEY,
  title TEXT,
  release_date DATE,
  image_url TEXT,
  spotify_link TEXT,
  spotify_uri TEXT,
  soundcloud_link TEXT,
  apple_link TEXT,
  youtube_link TEXT
);

-- Albums Table
CREATE TABLE Albums (
  album_id UUID PRIMARY KEY,
  title TEXT,
  release_date DATE,
  image_url TEXT,
  spotify_link TEXT,
  spotify_uri TEXT,
  soundcloud_link TEXT,
  apple_link TEXT,
  youtube_link TEXT
);

-- Genres Table
CREATE TABLE Genres (
  genre_id UUID PRIMARY KEY,
  name TEXT UNIQUE
);

-- Artists Table
CREATE TABLE Artists (
  artist_id UUID PRIMARY KEY,
  name TEXT,
  image_url TEXT,
  bio TEXT
);

-- Music_Artists Table
CREATE TABLE Music_Artists (
  music_id UUID REFERENCES Songs(song_id) ON DELETE CASCADE,
  artist_id UUID REFERENCES Artists(artist_id) ON DELETE CASCADE,
  PRIMARY KEY (music_id, artist_id)
);

-- Music_Genres Table
CREATE TABLE Music_Genres (
  music_id UUID REFERENCES Songs(song_id) ON DELETE CASCADE,
  genre_id UUID REFERENCES Genres(genre_id) ON DELETE CASCADE,
  PRIMARY KEY (music_id, genre_id)
);

-- Song_Albums Table
CREATE TABLE Song_Albums (
  song_id UUID REFERENCES Songs(song_id) ON DELETE CASCADE,
  album_id UUID REFERENCES Albums(album_id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, album_id)
);

-- Reviews Table
CREATE TABLE Reviews (
  review_id UUID PRIMARY KEY,
  user_id UUID REFERENCES Users(user_id),
  timestamp DATE,
  favorited BOOLEAN,
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
  comment_id UUID PRIMARY KEY,
  review_id UUID REFERENCES Reviews(review_id) ON DELETE CASCADE,
  user_id UUID REFERENCES Users(user_id),
  comment_text TEXT,
  timestamp DATE
);

-- Mail Table
CREATE TABLE Mail (
  mail_id UUID PRIMARY KEY,
  sender_id UUID REFERENCES Users(user_id),
  receiver_id UUID REFERENCES Users(user_id),
  song_id UUID REFERENCES Songs(song_id),
  album_id UUID REFERENCES Albums(album_id),
  timestamp DATE,
  CONSTRAINT check_song_or_album CHECK (
    (song_id IS NOT NULL AND album_id IS NULL) OR
    (album_id IS NOT NULL AND song_id IS NULL)
  )
);

-- Discord_Server_Config Table
CREATE TABLE Discord_Server_Config (
  discord_server_id TEXT PRIMARY KEY,
  disable_ratings BOOLEAN,
  disable_global_reviews BOOLEAN
);
