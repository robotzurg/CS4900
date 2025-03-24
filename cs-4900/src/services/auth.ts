let isDev = import.meta.env.VITE_IS_DEV;
const apiUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

export const authLogin = () => {
    window.location.href = `${isDev == 'true' ? apiDevUrl : apiUrl}/login/federated/google`;
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