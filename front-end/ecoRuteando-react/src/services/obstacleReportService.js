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
};

export default obstacleReportService;