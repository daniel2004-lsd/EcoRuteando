import api from "../api/api";

const apiCacheAdminService = {
  getRecentCacheEntries: async ({ provider, limit = 20 } = {}) => {
    const { data } = await api.get("/integrations/cache", {
      params: { provider, limit },
    });
    return data;
  },

  setCacheEntry: async (cacheData) => {
    const { data } = await api.post("/integrations/cache/set", cacheData);
    return data;
  },

  invalidateCache: async ({ entryId = null, provider = null } = {}) => {
    const { data } = await api.post("/integrations/cache/invalidate", {
      entryId,
      provider,
    });
    return data;
  },

  purgeExpiredCache: async () => {
    const { data } = await api.post("/integrations/cache/purge-expired");
    return data;
  },
};

export default apiCacheAdminService;
