let isDev = import.meta.env.VITE_IS_DEV;
const apiUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

export const authLogin = () => {
    window.location.href = `${isDev === 'true' ? apiDevUrl : apiUrl}/login/federated/google/`;
};

export const authLogout = async () => {
    try {
        const response = await fetch(`${isDev === 'true' ? apiDevUrl : apiUrl}/logout`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Logout request failed');
        }
        
    } catch (error) {
        // Log the error with type-safe error handling
        if (error instanceof Error) {
            console.error('Logout failed:', error.message);
        } else {
            console.error('Logout failed:', error);
        }
    }
}

export const fetchUser = async () => {
    const response = await fetch(`${isDev === 'true' ? apiDevUrl : apiUrl}/api/me`, {
      credentials: 'include',
    });
  
    if (!response.ok) {
      throw new Error('User not authenticated');
    }
  
    return response.json();
};  

export const fetchById = async (entity: string, id: string) => {
    try {
        const res = await fetch(`${isDev == 'true' ? apiDevUrl : apiUrl}/api/${entity}/${id}`);
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