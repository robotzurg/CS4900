export const fetchSong = async (slug: string) => {
    try {
        const res = await fetch(`http://localhost:3000/api/songs/${slug}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving song: ${err}` };
    }
};
