import api from "../api/api";

const supportService = {
  createTicket: async ({ subject, message, priority = 2, attachmentUrl = null }) => {
    const { data } = await api.post("/support/tickets", {
      subject,
      message,
      priority,
      attachmentUrl,
    });
    return data;
  },

  getMyTickets: async () => {
    const { data } = await api.get("/support/tickets/mine");
    return data;
  },

  getAllTickets: async ({ status, priority } = {}) => {
    const { data } = await api.get("/support/tickets", {
      params: { status, priority },
    });
    return data;
  },

  getTicketById: async (id) => {
    const { data } = await api.get(`/support/tickets/${id}`);
    return data;
  },

  addMessage: async (ticketId, { message, attachmentUrl = null }) => {
    const { data } = await api.post(`/support/tickets/${ticketId}/messages`, {
      message,
      attachmentUrl,
    });
    return data;
  },

  updateStatus: async (ticketId, { status, assignToMe = false }) => {
    await api.patch(`/support/tickets/${ticketId}/status`, {
      status,
      assignToMe,
    });
  },
};

export default supportService;
