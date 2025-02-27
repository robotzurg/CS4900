export interface Song {
    id: string;
    name: string;
    release_date: string;
    image_url: string;
    spotify_link?: string | null;
    spotify_uri?: string | null;
    soundcloud_link?: string | null;
    apple_link?: string | null;
    youtube_link?: string | null;
}  