import api from "../api/api";

const poiService = {
  getAll: async (poiType = null) => {
    const params = {};
    if (poiType) params.poiType = poiType;
    const { data } = await api.get("/pois", { params });
    return data;
  },

  getById: async (id) => {
    const { data } = await api.get(`/pois/${id}`);
    return data;
  },

  create: async (poi) => {
    const { data } = await api.post("/pois", poi);
    return data;
  },

  update: async (id, poi) => {
    await api.put(`/pois/${id}`, { id, ...poi });
  },

  deactivate: async (id) => {
    await api.delete(`/pois/${id}`);
  },

  getRoutePois: async (routeId) => {
    const { data } = await api.get(`/routes/${routeId}`);
    return data.routePois || [];
  },

  addToRoute: async (routeId, poiId, sortOrder = null) => {
    const params = {};
    if (sortOrder != null) params.sortOrder = sortOrder;
    await api.post(`/routes/${routeId}/pois/${poiId}`, null, { params });
  },

  removeFromRoute: async (routeId, poiId) => {
    await api.delete(`/routes/${routeId}/pois/${poiId}`);
  },
};

export default poiService;