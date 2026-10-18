import api from "../api/api";

const userService = {
  getUsers: async () => {
    const { data } = await api.get("/users");
    return data;
  },

  getRoles: async () => {
    const { data } = await api.get("/roles");
    return data;
  },

  getUserRoles: async (userId) => {
    const { data } = await api.get(`/userroles/${userId}`);
    return data;
  },

  assignRole: async (userId, roleId) => {
    await api.post("/userroles", { userId, roleId });
  },

  removeRole: async (userId, roleId) => {
    await api.delete(`/userroles/${userId}/${roleId}`);
  },
};

export default userService;
