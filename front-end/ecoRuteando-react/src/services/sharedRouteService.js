import api from "../api/api";

const sharedRouteService = {
  share: async (usageId, { socialNetwork, sharedData } = {}) => {
    const payload = {
      usageId,
      ...(socialNetwork ? { socialNetwork } : {}),
      ...(sharedData ? { sharedData } : {}),
    };
    const { data } = await api.post("/shared-routes", payload);
    return data;
  },

  getAll: async () => {
    const { data } = await api.get("/shared-routes");
    return data;
  },
};

export default sharedRouteService;