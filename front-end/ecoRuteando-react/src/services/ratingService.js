import api from "../api/api";

const ratingService = {
  rate: async (routeId, ratingValue, comment = "") => {
    const payload = {
      routeId,
      ratingValue,
      ...(comment !== "" ? { comment } : {}),
    };
    const { data } = await api.post("/ratings", payload);
    return data;
  },

  getByRoute: async (routeId) => {
    const { data } = await api.get(`/ratings/route/${routeId}`);
    return data;
  },

  getMine: async (routeId) => {
    const { data } = await api.get(`/ratings/route/${routeId}/mine`);
    return data;
  },
};

export default ratingService;