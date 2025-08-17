export const JIKAN_CONFIG = {
  BASE_URL: "https://api.jikan.moe/v4",
  headers: {
    accept: "application/json",
  },
};

export const fetchAnimes = async ({
  page = 1,
  limit = 10,
  keyword = "",
  orderBy,
  sortBy,
}: {
  page?: number;
  limit?: number;
  keyword?: string;
  orderBy?:
    | "title"
    | "start_date"
    | "end_date"
    | "episodes"
    | "score"
    | "scored_by"
    | "rank"
    | "popularity"
    | "members"
    | "favorites";
  sortBy?: "asc" | "desc";
}): Promise<any[]> => {
  try {
    // Parameters
    const params = new URLSearchParams({
      q: keyword,
      limit: limit.toString(),
      page: page.toString(),
      order_by: orderBy || "",
      sort: sortBy || "",
    });

    // Endpoint
    const endpoint = `${JIKAN_CONFIG.BASE_URL}/anime?${params.toString()}`;

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
