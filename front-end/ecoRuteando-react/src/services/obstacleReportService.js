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
};

export default obstacleReportService;