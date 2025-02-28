const apiUrl = import.meta.env.VITE_API_URL;

export const fetchSong = async (slug: string) => {
    try {
        const res = await fetch(`${apiUrl}/api/songs/${slug}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving song: ${err}` };
    }
};
