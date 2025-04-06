let isDev = import.meta.env.VITE_IS_DEV;
const apiUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

export const getReviewByUserId = async (musicId: string, userId: string) => {
  const url = `${isDev === 'true' ? apiDevUrl : apiUrl}/api/reviews/${musicId}?user_id=${userId}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Error fetching review');
  }

  const reviews = await res.json();
  return reviews.length > 0 ? reviews[0] : null;
};


export const addReview = async (reviewData) => {
    const url = `${isDev === 'true' ? apiDevUrl : apiUrl}/api/reviews`;
  
    const res = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reviewData), 
    });
  
    if (!res.ok) {
      throw new Error('Error adding review');
    }
  
    return res.json();
};

export const updateReview = async (reviewData) => {
  const url = `${isDev === 'true' ? apiDevUrl : apiUrl}/api/reviews/${reviewData.id}`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(reviewData), 
  });

  if (!res.ok) {
    throw new Error('Error updating review');
  }

  return res.json();
};