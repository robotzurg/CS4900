let isDev = import.meta.env.VITE_IS_DEV;
const apiUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

export const onSearch = async(searchTerm: string, type: string | null = null) => {
    try {
        const res = await fetch(`${isDev === 'true' ? apiDevUrl : apiUrl}/api/search${type != null ? `/${type}` : ''}?q=${searchTerm}`);
        return res.json();
    } catch (err) {
        return { error: `Error searching: ${err}` };
    }
}