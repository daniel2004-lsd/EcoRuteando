import api from "../api/api";

const statsService = {
  getStats: async (from = null, to = null) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const { data } = await api.get("/admin/stats", { params });
    return data;
  },
};

export default statsService;