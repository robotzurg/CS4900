let isDev = import.meta.env.VITE_IS_DEV;
const apiUrl = import.meta.env.VITE_API_URL;
const apiDevUrl = import.meta.env.VITE_API_DEV_URL;

export const getReview = async (reviewId: string) => {
  const url = `${isDev === 'true' ? apiDevUrl : apiUrl}/api/reviews/${reviewId}`;

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

  const review = await res.json();
  return review;
};

export const getMusicReviews = async (entity: string, musicId: string, query: any[] = []) => {

  console.log(entity, musicId, query);

  const queryParams = query.length 
            ? `?${query.map(q => `${q[0]}=${encodeURIComponent(q[1])}`).join('&')}` 
            : '';

  const url = `${isDev === 'true' ? apiDevUrl : apiUrl}/api/reviews/${entity}/${musicId}${queryParams}`;

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
  return reviews;
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
  console.log(reviewData);
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