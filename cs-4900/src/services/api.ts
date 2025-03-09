const isDev = false;
const apiUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

export const fetchById = async (entity: string, id: string) => {
    try {
        const res = await fetch(`${isDev ? apiUrl : apiDevUrl}/api/${entity}/${id}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};

export const fetchAll = async (entity: string) => {
    try {
        const res = await fetch(`${isDev ? apiUrl : apiDevUrl}/api/${entity}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};

export const searchByName = async (entity: string, query: string) => {
    try {
        if (!query || !entity) return []
        const response = await fetch(`${isDev ? apiUrl : apiDevUrl}/api/${entity}?query=${query}`);
        const data = await response.json();
        const results = data.map((value: any) => ({ id: value.id, name: value.name }));
        return results;
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};