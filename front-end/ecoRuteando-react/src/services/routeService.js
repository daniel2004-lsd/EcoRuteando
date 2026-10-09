import api from "../api/api";

const routeService = {
  // mine=true → solo las rutas creadas por el usuario autenticado («Mis rutas»).
  getAll: async (transportType = null, includeInactive = false, mine = false) => {
    const params = {};
    if (transportType) params.transportType = transportType;
    if (includeInactive) params.includeInactive = true;
    if (mine) params.mine = true;
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

  // HU-23: Obtiene el historial de direcciones guardadas del usuario
  getUserAddressHistory: async () => {
    const { data } = await api.get("/routes/history/addresses");
    return data;
  },
};

export default routeService;
