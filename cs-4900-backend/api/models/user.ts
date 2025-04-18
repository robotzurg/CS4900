export interface User {
    id: string;
    bio: string;
    username: string;
    discord_mailbox_dm: boolean;
    discord_review_ping: boolean;
    friends_list: Array<string>;
    role: string;
    profile_picture?: string | null;
    spotify_mailbox_playlist_id?: string | null;
    discord_user_id?: string | null;
    discord_username?: string | null;
    spotify_access_token?: string | null;
    spotify_refresh_token?: string | null;
    lfm_username?: string | null;
    discord_embed_color?: string | null;
}  