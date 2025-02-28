const isDev = true;
const apiUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

export const fetchBySlug = async (entity: string, slug: string) => {
    try {
        const res = await fetch(`${isDev ? apiUrl : apiDevUrl}/api/${entity}/${slug}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};

export const fetchByName = async (entity: string, query: string) => {
    try {
        if (!query || !entity) return []
        const response = await fetch(`/api/${entity}?query=${query}`);
        const data = await response.json();
        return data.map((artist: any) => artist.name);
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};