let isDev = import.meta.env.VITE_IS_DEV;
const apiUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

export const fetchUser = async () => {
    const res = await fetch(`${isDev === 'true' ? apiDevUrl : apiUrl}/api/me`, {
      credentials: 'include',
    });
  
    if (!res.ok) {
      throw new Error('User not authenticated');
    }
  
    return res.json();
};  

export const updateUser = async (userData) => {
    const url = `${isDev === 'true' ? apiDevUrl : apiUrl}/api/users/${userData.id}`;
  
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData), 
    });
  
    if (!res.ok) {
      throw new Error('Error updating user profile');
    }
  
    return res.json();
};

  