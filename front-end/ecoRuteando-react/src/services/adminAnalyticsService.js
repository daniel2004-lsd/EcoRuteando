import api from "../api/api";

const adminAnalyticsService = {
  getDailyStatistics: async ({ from, to } = {}) => {
    const { data } = await api.get("/admin/statistics/daily", {
      params: { from, to },
    });
    return data;
  },

  getStatisticsSummary: async () => {
    const { data } = await api.get("/admin/statistics/summary");
    return data;
  },

  upsertDailyStatistic: async (statisticData) => {
    const { data } = await api.post("/admin/statistics/daily", statisticData);
    return data;
  },

  requestExport: async ({ exportType, format, filters = null }) => {
    const { data } = await api.post("/admin/exports", {
      exportType,
      format,
      filters,
    });
    return data;
  },

  getRecentExports: async ({ mineOnly = false, limit = 20 } = {}) => {
    const { data } = await api.get("/admin/exports", {
      params: { mineOnly, limit },
    });
    return data;
  },

  getExportById: async (id) => {
    const { data } = await api.get(`/admin/exports/${id}`);
    return data;
  },
};

export default adminAnalyticsService;
