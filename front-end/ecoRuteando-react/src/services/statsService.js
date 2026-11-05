import api from "../api/api";

const statsService = {
  getStats: async (from = null, to = null) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const { data } = await api.get("/admin/stats", { params });
    return data;
  },

  // Obtiene las estadísticas oficiales unificadas del usuario autenticado (CU08/Dashboard)
  // Sin truncamiento por paginación en rutas creadas.
  getUserDashboardStats: async () => {
    const { data } = await api.get("/users/me/dashboard-stats");
    return data;
  },
};

export default statsService;
