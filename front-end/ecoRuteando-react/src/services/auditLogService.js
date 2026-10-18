import api from "../api/api";

const auditLogService = {
  getAuditLogs: async (take = 200) => {
    const { data } = await api.get("/audit-logs", { params: { take } });
    return data;
  },
};

export default auditLogService;
