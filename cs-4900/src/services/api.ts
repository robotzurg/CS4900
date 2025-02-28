const apiUrl = import.meta.env.VITE_API_DEV_URL;

export const fetchBySlug = async (entity: string, slug: string) => {
    try {
        const res = await fetch(`${apiUrl}/api/${entity}/${slug}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};
