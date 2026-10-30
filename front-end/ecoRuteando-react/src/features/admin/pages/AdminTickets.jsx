import { useState, useEffect, useCallback } from "react";
import {
  TicketIcon,
  ArrowLeft,
  SearchIcon,
  MailIcon,
  ClockIcon,
  CheckCircle,
  UsersIcon,
  CloseIcon
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import supportService from "../../../services/supportService";
import toast from "react-hot-toast";

const STATUS_CONFIG = {
  all: { label: "Todos", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  pending: { label: "Pendientes", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  in_progress: { label: "En Proceso", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  resolved: { label: "Resueltos / Respondidos", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  closed: { label: "Cerrados", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
};

const normalizeStatus = (st) => {
  if (!st) return "pending";
  const s = String(st).toLowerCase().replace("_", "");
  if (s === "open" || s === "pending") return "pending";
  if (s === "inprogress") return "in_progress";
  if (s === "resolved") return "resolved";
  if (s === "closed") return "closed";
  return s;
};

const AdminTickets = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");

  // Modal para ver y responder ticket
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await supportService.getAllTickets();
      const rawList = Array.isArray(data) ? data : (data?.items || []);
      const normalized = rawList.map((t) => ({
        ...t,
        status: normalizeStatus(t.status),
      }));
      setTickets(normalized);
    } catch (err) {
      console.error("Error cargando tickets de soporte:", err);
      setError("No se pudieron cargar las solicitudes de soporte.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      setUpdatingStatus(true);
      await supportService.updateStatus(ticketId, { status: newStatus, assignToMe: newStatus === "in_progress" });
      const label = STATUS_CONFIG[newStatus]?.label || newStatus;
      toast.success(`Estado actualizado a: ${label} ✓`);
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket((prev) => ({ ...prev, status: newStatus }));
      }
      await loadTickets();
    } catch (err) {
      console.error("Error actualizando estado del ticket:", err);
      toast.error(err?.response?.data?.message || "Error al actualizar estado.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;
    try {
      setSendingReply(true);
      await supportService.addMessage(selectedTicket.id, {
        message: replyMessage.trim(),
      });
      toast.success("¡Respuesta enviada! El ticket ha quedado Resuelto y enviado por correo al usuario ✉️");
      setReplyMessage("");
      // Recargar detalle y listado
      const updated = await supportService.getTicketById(selectedTicket.id);
      if (updated) {
        setSelectedTicket({
          ...updated,
          status: normalizeStatus(updated.status),
        });
      }
      setStatusFilter("resolved");
      await loadTickets();
    } catch (err) {
      console.error("Error enviando respuesta:", err);
      toast.error(err?.response?.data?.message || "No se pudo enviar la respuesta.");
    } finally {
      setSendingReply(false);
    }
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      (t.subject || "").toLowerCase().includes(q) ||
      (t.message || "").toLowerCase().includes(q) ||
      (t.userEmail || "").toLowerCase().includes(q) ||
      (t.userName || "").toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const pendingCount = tickets.filter((t) => t.status === "pending").length;
  const inProgressCount = tickets.filter((t) => t.status === "in_progress").length;
  const resolvedCount = tickets.filter((t) => t.status === "resolved").length;
  const _closedCount = tickets.filter((t) => t.status === "closed").length;

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-[#0B1215]" : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"}`}>
      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? "bg-[#162329] border-b border-emerald-500/30" : "bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700"} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? "bg-[#162329] border border-emerald-500/30" : "bg-white"}`}>
                <TicketIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gestión de Tickets de Soporte (PQRS)</h1>
                <p className={`text-sm ${isDarkMode ? "text-emerald-400" : "text-green-100"}`}>
                  Atención directa a preguntas y consultas de los usuarios
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isDarkMode ? "bg-[#162329]/50 text-emerald-400 border border-emerald-500/30 hover:bg-[#162329]" : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              <ArrowLeft size={16} />
              Volver al Panel
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* RESUMEN RÁPIDO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border shadow-sm transition-all ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Tickets Nuevos / Pendientes</span>
            <p className="text-2xl font-black text-blue-500 mt-1">{pendingCount}</p>
          </div>
          <div className={`p-4 rounded-2xl border shadow-sm transition-all ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-500">En Atención / Proceso</span>
            <p className="text-2xl font-black text-amber-500 mt-1">{inProgressCount}</p>
          </div>
          <div className={`p-4 rounded-2xl border shadow-sm transition-all ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">Resueltos / Cerrados</span>
            <p className="text-2xl font-black text-emerald-500 mt-1">{resolvedCount}</p>
          </div>
        </div>

        {/* FILTROS Y BUSCADOR */}
        <div className={`p-4 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 ${
          isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"
        }`}>
          {/* Pestañas de estado */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {Object.keys(STATUS_CONFIG).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                    : isDarkMode
                    ? "bg-[#111C20] text-gray-400 border-[#26383D] hover:bg-[#162329]"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {STATUS_CONFIG[status].label}
              </button>
            ))}
          </div>

          {/* Campo de búsqueda */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por asunto, texto o email..."
              className={`w-full pl-9 pr-3.5 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400"
              }`}
            />
            <SearchIcon size={14} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* LISTA DE TICKETS */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>Cargando tickets de soporte...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-center text-rose-600 text-sm">
            <p>{error}</p>
            <button onClick={loadTickets} className="mt-2 text-xs font-bold underline">Reintentar</button>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"}`}>
            <span className="text-4xl block mb-2">📬</span>
            <h3 className="text-base font-bold mb-1">No se encontraron tickets</h3>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              No hay solicitudes con los filtros aplicados actualmente.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTickets.map((ticket) => {
              const statusCfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.Open;
              return (
                <div
                  key={ticket.id}
                  className={`p-5 rounded-2xl border transition-all shadow-sm hover:shadow-md ${
                    isDarkMode ? "bg-[#162329] border-[#26383D] hover:border-emerald-500/50" : "bg-white border-gray-100 hover:border-emerald-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      <h4 className="text-sm font-bold">{ticket.subject || "Sin asunto"}</h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 shrink-0">
                      <ClockIcon size={13} />
                      <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ""}</span>
                    </div>
                  </div>

                  <p className={`text-xs line-clamp-2 mb-4 leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    {ticket.message || "Sin descripción proporcionada"}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-[#26383D]">
                    <div className="flex items-center gap-2 text-xs min-w-0 flex-1">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold text-xs shrink-0">
                        {(ticket.userName || ticket.userEmail || "U")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`font-semibold text-xs block truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                          {ticket.userName || "Usuario"}
                        </span>
                        <span className="text-[10px] text-gray-400 block truncate" title={ticket.userEmail}>
                          {ticket.userEmail || "Sin correo"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
                      >
                        {ticket.status === "resolved" ? "Ver Respuesta" : "Atender / Responder"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL DETALLE Y ATENCIÓN DEL TICKET */}
      {selectedTicket && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className={`w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl transition-all overflow-hidden ${
              isDarkMode ? "bg-[#162329] border-[#26383D] text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del modal */}
            <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? "border-[#26383D]" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
                  <TicketIcon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold">{selectedTicket.subject}</h3>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="font-semibold text-xs text-emerald-500">{selectedTicket.userName || "Usuario"}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-xs text-gray-400 underline">{selectedTicket.userEmail || "Sin correo"}</span>
                    <span className="text-gray-400 text-xs">•</span>
                    <span className="text-[11px] text-gray-400">{selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString("es-CO") : ""}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className={`p-2 rounded-xl transition-colors ${isDarkMode ? "hover:bg-[#111C20] text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Contenido del ticket */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
              <div>
                <span className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Consulta enviada por el usuario
                </span>
                <div className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                  isDarkMode ? "bg-[#111C20] border-[#26383D] text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
                }`}>
                  {selectedTicket.message}
                </div>
              </div>

              {/* Mensajes previos si existen */}
              {Array.isArray(selectedTicket.messages) && selectedTicket.messages.length > 0 && (
                <div className="space-y-3">
                  <span className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Historial de respuestas
                  </span>
                  {selectedTicket.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                        msg.isAdmin
                          ? isDarkMode ? "bg-emerald-950/40 border-emerald-800 text-emerald-200 ml-4" : "bg-emerald-50 border-emerald-200 text-emerald-900 ml-4"
                          : isDarkMode ? "bg-[#111C20] border-[#26383D] text-gray-300 mr-4" : "bg-gray-50 border-gray-200 text-gray-700 mr-4"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 font-semibold">
                        <span>{msg.isAdmin ? "🛡️ Soporte EcoRuteando" : `👤 ${selectedTicket.userName || selectedTicket.userEmail || "Usuario"}`}</span>
                        <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}</span>
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Cambiar estado */}
              <div>
                <span className={`block text-xs font-bold uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  Actualizar estado del ticket
                </span>
                <div className="flex flex-wrap gap-2">
                  {["pending", "in_progress", "resolved", "closed"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updatingStatus || selectedTicket.status === st}
                      onClick={() => handleUpdateStatus(selectedTicket.id, st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border disabled:opacity-40 ${
                        selectedTicket.status === st
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : isDarkMode
                          ? "bg-[#111C20] text-gray-300 border-[#26383D] hover:bg-[#162329]"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {STATUS_CONFIG[st]?.label || st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Formulario de respuesta */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2 border-t border-gray-100 dark:border-[#26383D]">
                <div className="flex items-center justify-between">
                  <label className={`block text-xs font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Responder al usuario
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✉️ Notificación por correo al enviar
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Escribe la orientación o respuesta oficial al ticket..."
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode ? "bg-[#111C20] border-[#26383D] text-white placeholder-gray-500" : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                  }`}
                />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-gray-400">
                    Al responder, pasará a <strong className="text-emerald-500">Resueltos / Respondidos</strong>.
                  </span>
                  <button
                    type="submit"
                    disabled={sendingReply || !replyMessage.trim()}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white transition-all shadow-md disabled:opacity-50"
                  >
                    {sendingReply ? "Enviando respuesta..." : "Enviar Respuesta"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTickets;
