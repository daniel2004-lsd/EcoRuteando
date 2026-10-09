import api from "../api/api";

const tripService = {
  getAll: async () => {
    const { data } = await api.get("/trips");
    return data;
  },

  getById: async (usageId) => {
    const { data } = await api.get(`/trips/${usageId}`);
    return data;
  },

  start: async (payload) => {
    const { data } = await api.post("/trips", payload);
    return data;
  },

  complete: async (usageId, payload) => {
    const { data } = await api.post(`/trips/${usageId}/complete`, {
      usageId,
      ...payload,
    });
    return data;
  },
};

export default tripService;
