import dotenv from 'dotenv';

dotenv.config();

export const fetchSong = async (slug: string) => {
    try {
        //const devApiUrl = process.env.VITE_API_DEV_URL
        const apiUrl = process.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/api/songs/${slug}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving song: ${err}` };
    }
};
