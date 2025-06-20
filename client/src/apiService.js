const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://lawatch.vercel.app' 
  : 'http://localhost:5000';

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', 
    mode: 'cors' 
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
