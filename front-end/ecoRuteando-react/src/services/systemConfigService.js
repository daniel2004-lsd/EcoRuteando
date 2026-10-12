import api from "../api/api";

const systemConfigService = {
  getSystemConfiguration: async () => {
    const { data } = await api.get("/admin/system-configuration");
    return data;
  },

  updateSystemConfiguration: async (configData) => {
    const { data } = await api.put("/admin/system-configuration", configData);
    return data;
  },

  getActiveTransportFactors: async () => {
    const { data } = await api.get("/admin/transport-factors/active");
    return data;
  },

  getAllTransportFactors: async ({ onlyActive = false } = {}) => {
    const { data } = await api.get("/admin/transport-factors", {
      params: { onlyActive },
    });
    return data;
  },

  createTransportFactor: async (factorData) => {
    const { data } = await api.post("/admin/transport-factors", factorData);
    return data;
  },

  updateTransportFactor: async (id, factorData) => {
    const { data } = await api.put(`/admin/transport-factors/${id}`, factorData);
    return data;
  },
};

export default systemConfigService;
