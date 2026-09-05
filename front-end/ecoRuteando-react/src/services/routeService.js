import api from "../api/api";

const routeService = {
  getAll: async (transportType = null, includeInactive = false) => {
    const params = {};
    if (transportType) params.transportType = transportType;
    if (includeInactive) params.includeInactive = true;
    const { data } = await api.get("/routes", { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/routes/${id}`);
    return data;
  },

  create: async (route) => {
    const { data } = await api.post("/routes", route);
    return data;
  },

  update: async (id, route) => {
    await api.put(`/routes/${id}`, { id, ...route });
  },

  delete: async (id) => {
    await api.delete(`/routes/${id}`);
  },
};

export default routeService;
