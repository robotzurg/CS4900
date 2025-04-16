let isDev = import.meta.env.VITE_IS_DEV;
const apiMainUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;
const apiUrl = isDev == 'true' ? apiDevUrl : apiMainUrl;

export const fetchCommentsForReview = async (reviewId: string) => {
    const res = await fetch(`${apiUrl}/api/comments/review/${reviewId}`);
    if (!res.ok) throw new Error('Failed to fetch comments');
    return await res.json();
};