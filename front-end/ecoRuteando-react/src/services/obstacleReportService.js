import api from "../api/api";

const obstacleReportService = {
  createReport: async ({ reportType, description, latitude, longitude, addressText }) => {
    const { data } = await api.post("/obstacle-reports", {
      reportType,
      description,
      latitude,
      longitude,
      addressText,
    });
    return data;
  },

  getMyReports: async () => {
    const { data } = await api.get("/obstacle-reports/mine");
    return data;
  },

  getReportsForAdmin: async (status) => {
    const { data } = await api.get("/obstacle-reports", {
      params: status ? { status } : {},
    });
    return data;
  },

  validateReport: async (reportId, { status, validationNote }) => {
    await api.patch(`/obstacle-reports/${reportId}/status`, {
      status,
      validationNote,
    });
  },

  getActiveReports: async ({ latitude, longitude, radiusKm } = {}) => {
    const params = {};
    if (latitude !== undefined && latitude !== null) params.latitude = latitude;
    if (longitude !== undefined && longitude !== null) params.longitude = longitude;
    if (radiusKm !== undefined && radiusKm !== null) params.radiusKm = radiusKm;
    const { data } = await api.get("/obstacle-reports/active", { params });
    return data;
  },

  voteReport: async (reportId, { confirms, latitude, longitude }) => {
    const { data } = await api.post(`/obstacle-reports/${reportId}/vote`, {
      confirms,
      latitude,
      longitude,
    });
    return data;
  },
};

export default obstacleReportService;