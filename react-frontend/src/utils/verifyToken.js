const verifyToken = async (accessToken) => {
  try {
    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://attendence.crshop.net/api'
        : 'http://127.0.0.1:8000/api';
    const response = await fetch(`${baseUrl}/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessToken }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.isValid;
  } catch (error) {
    return false; // Assume token is not valid in case of an error
  }
};

export default verifyToken;
