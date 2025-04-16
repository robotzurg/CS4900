let isDev = import.meta.env.VITE_IS_DEV;
const apiMainUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;
const apiUrl = isDev == 'true' ? apiDevUrl : apiMainUrl;

export const fetchById = async (entity: string, id: string, query: [string, string][] = []) => {
    try {
        const queryParams = query.length 
            ? `?${query.map(q => `${q[0]}=${encodeURIComponent(q[1])}`).join('&')}` 
            : '';
        
        const res = await fetch(`${apiUrl}/api/${entity}/${id}${queryParams}`);
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

        const res = await fetch(`${apiUrl}/api/${entity}${queryParams}`);
        return res.json();
    } catch (err) {
        return { error: `Error retrieving ${entity}: ${err}` };
    }
};

// Create a new entity
export const createItem = async (entity: string, data: any) => {
  try {
    const res = await fetch(
      `${apiUrl}/api/${entity}`, 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return res.json()
  } catch (err) {
    return { error: `Error creating ${entity}: ${err}` }
  }
}

// Update an existing entity
export const updateItem = async (entity: string, id: string, data: any) => {
  try {
    const res = await fetch(
      `${apiUrl}/api/${entity}/${id}`, 
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )
    return res.json()
  } catch (err) {
    return { error: `Error updating ${entity}: ${err}` }
  }
}

// Delete an entity
export const deleteItem = async (entity: string, id: string) => {
  try {
    const res = await fetch(
      `${apiUrl}/api/${entity}/${id}`, 
      { method: 'DELETE' }
    )
    return res.json()
  } catch (err) {
    return { error: `Error deleting ${entity}: ${err}` }
  }
}

export const searchByName = async (entity: string, query: string) => {
    try {
        if (!query || !entity) return []
        const response = await fetch(`${apiUrl}/api/${entity}?query=${query}`);
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
        const response = await fetch(`${apiUrl}/api/upload`, {
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