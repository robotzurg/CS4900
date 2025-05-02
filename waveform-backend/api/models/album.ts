export interface Album {
    id: string;
    name: string;
    release_date: string;
    image_url: string;
    slug: string;
    category: string;
    spotify_url?: string | null;
    spotify_uri?: string | null;
    soundcloud_url?: string | null;
    apple_url?: string | null;
    youtube_url?: string | null;
}