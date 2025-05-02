export interface Mail {
    id: string;
    sender_id: string;
    receiver_id: string;
    timestamp: string;
    song_id?: string;
    album_id?: string;
}  