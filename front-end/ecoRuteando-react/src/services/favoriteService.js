import api from "../api/api";

const favoriteService = {
  getAll: async () => {
    const { data } = await api.get("/favorites");
    return data;
  },

  add: async (routeId, label = null) => {
    const payload = { routeId, ...(label ? { label } : {}) };
    await api.post("/favorites", payload);
  },

  remove: async (routeId) => {
    await api.delete(`/favorites/${routeId}`);
  },
};

export default favoriteService;
