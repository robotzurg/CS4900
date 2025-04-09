let isDev = import.meta.env.VITE_IS_DEV;
const apiUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

export const fetchById = async (entity: string, id: string, query: [string, string][] = []) => {
    try {
        const queryParams = query.length 
            ? `?${query.map(q => `${q[0]}=${encodeURIComponent(q[1])}`).join('&')}` 
            : '';
        
        const res = await fetch(`${isDev == 'true' ? apiDevUrl : apiUrl}/api/${entity}/${id}${queryParams}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};

export const fetchAll = async (entity: string, query: [string, string][] = []) => {
    try {
        const queryParams = query.length 
            ? `?${query.map(q => `${q[0]}=${encodeURIComponent(q[1])}`).join('&')}` 
            : '';

        const res = await fetch(`${isDev == 'true' ? apiDevUrl : apiUrl}/api/${entity}${queryParams}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};

export const searchByName = async (entity: string, query: string) => {
    try {
        if (!query || !entity) return []
        const response = await fetch(`${isDev == 'true' ? apiUrl : apiDevUrl}/api/${entity}?query=${query}`);
        const data = await response.json();
        const results = data.map((value: any) => ({ id: value.id, name: value.name }));
        return results;
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};

export const uploadImage = async (imageFile: File): Promise<{ url?: string; error?: string }> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await fetch(`${isDev == 'true' ? apiDevUrl : apiUrl}/api/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errMsg = await response.text();
            return { error: `Upload failed: ${errMsg}` };
        }

        const data = await response.json();
        return { url: data.url };
    } catch (err) {
        return { error: `Error uploading image: ${err}` };
    }
};