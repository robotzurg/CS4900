export interface Review {
    id: string;
    user_id: string;
    timestamp: string;
    favorited: boolean;
    song_id?: string | null;
    album_id?: string | null;
    review_text?: string | null;
    rating?: number | null;
    user_sent_by_id?: string | null;
    discord_url?: string | null;
    discord_guild_id?: string | null;
    discord_message_id?: string | null;
    discord_channel_id?: string | null;
}  