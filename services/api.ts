export const JIKAN_CONFIG = {
  BASE_URL: "https://api.jikan.moe/v4",
  headers: {
    accept: "application/json",
  },
};

export const fetchAnimes = async ({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}): Promise<any[]> => {
  try {
    const endpoint = `${JIKAN_CONFIG.BASE_URL}/top/anime?limit=${limit}&page=${page}`;

    const response = await fetch(endpoint, {
      method: "GET",
      headers: JIKAN_CONFIG.headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText); // Debug log
      throw new Error(
        `Failed to fetch animes: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Fetch error:", error); // Debug log
    throw error;
  }
};
