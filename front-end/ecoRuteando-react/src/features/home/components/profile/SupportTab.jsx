import React from "react";

const SupportTab = ({
  isDarkMode,
  openFaq,
  setOpenFaq,
  ticketForm,
  setTicketForm,
  submittingTicket,
  handleTicketSubmit,
  supportTickets,
  loadingTickets,
  loadSupportTickets,
  t
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HERO DEL CENTRO DE AYUDA */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${
        isDarkMode
          ? "bg-gradient-to-br from-[#162329] to-[#111C20] border-[#26383D]"
          : "bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border-emerald-100"
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                {t("support.title", "Centro de Ayuda y Soporte Técnico")}
              </h3>
            </div>
            <p className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {t("support.subtitle", "¿Tienes dudas, preguntas frecuentes o inconvenientes con la plataforma? Nuestro equipo está para orientarte.")}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Atención Activa</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN 1: PREGUNTAS FRECUENTES (FAQ) */}
      <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
        isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100 shadow-sm"
      }`}>
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-[#26383D]">
          <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-500 flex items-center justify-center font-bold">
            ❓
          </div>
          <div>
            <h4 className="text-sm font-bold">
              {t("support.faqTitle", "Preguntas Frecuentes de la Comunidad")}
            </h4>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              Respuestas rápidas a las consultas más habituales de los usuarios.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {[
            {
              q: "¿Cómo se calculan las estimaciones de CO₂ y el impacto ambiental?",
              a: "EcoRuteando calcula el impacto estimando factores de emisión oficiales basados en la distancia (km) recorrida y el tipo de transporte: automóvil a combustión vs desplazamiento peatonal o bicicleta. Al elegir caminar o usar bicicleta, todo el CO₂ que se habría emitido en vehículo se registra como CO₂ evitado."
            },
            {
              q: "¿Por qué en la plataforma web solo puedo calcular rutas y no iniciar viajes?",
              a: "La plataforma web está pensada para la planificación, trazabilidad, visualización estadística y gestión de tu cuenta en pantalla amplia. El inicio activo de viajes, navegación paso a paso con GPS en tiempo real y detección de obstáculos en movimiento se realiza de forma exclusiva y segura a través de la aplicación móvil de EcoRuteando."
            },
            {
              q: "¿Cómo se sincronizan las rutas que realizo en la app móvil con la web?",
              a: "Cada vez que finalizas un viaje o guardas una ruta en la app móvil con tu cuenta iniciada, los datos se sincronizan automáticamente en la nube. Puedes consultar todos tus trayectos, origen de registro (App Móvil vs Web) y estadísticas en tu Historial y Dashboard de Usuario."
            },
            {
              q: "¿Cómo reportar un incidente, obstáculo o vía cerrada?",
              a: "Desde la aplicación móvil o la sección de reportes ciudadanos de la plataforma, puedes marcar un punto en el mapa y seleccionar el tipo de incidencia (obras, accidente, cierre o vía en mal estado). Nuestro sistema alertará a otros usuarios en sus rutas calculadas."
            },
            {
              q: "¿Cómo puedo proteger mi cuenta o cambiar mi contraseña?",
              a: "En la pestaña 'Seguridad y Acceso' de este mismo perfil, puedes activar la Autenticación en Dos Pasos (2FA) escaneando el código QR con Google Authenticator o Authy, o cambiar tu contraseña en cualquier momento."
            }
          ].map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isDarkMode ? "border-[#26383D] bg-[#111C20]/50" : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                    {faq.q}
                  </span>
                  <span className={`transform transition-transform text-emerald-500 font-bold ${isOpen ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className={`px-4 pb-4 pt-1 text-xs leading-relaxed border-t ${
                    isDarkMode ? "border-[#26383D] text-gray-400" : "border-gray-100 text-gray-600"
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* SECCIÓN 2: FORMULARIO DE CONSULTA / TICKET DE SOPORTE */}
      <div className={`p-6 sm:p-7 rounded-3xl border transition-all space-y-5 ${
        isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100 shadow-sm"
      }`}>
        <div className="flex items-center gap-2.5 pb-2 border-b border-gray-100 dark:border-[#26383D]">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            ✍️
          </div>
          <div>
            <h4 className="text-sm font-bold">
              {t("support.formTitle", "Enviar una Consulta o Pregunta al Equipo")}
            </h4>
            <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              ¿No encontraste lo que buscabas? Escríbenos y un asesor te responderá.
            </p>
          </div>
        </div>

        <form onSubmit={handleTicketSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Categoría
              </label>
              <select
                value={ticketForm.category}
                onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isDarkMode
                    ? "bg-[#111C20] border-[#26383D] text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                <option value="general">Duda General</option>
                <option value="rutas">Cálculo de Rutas / Mapas</option>
                <option value="tecnico">Problema Técnico / Bug</option>
                <option value="seguridad">Cuenta y Acceso</option>
                <option value="sugerencia">Sugerencia de Mejora</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Asunto de la consulta *
              </label>
              <input
                type="text"
                value={ticketForm.subject}
                onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                placeholder="Ej: Inquietud con el cálculo de ruta a pie..."
                required
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isDarkMode
                    ? "bg-[#111C20] border-[#26383D] text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-bold uppercase tracking-wider mb-1.5 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              Mensaje / Detalle de la pregunta *
            </label>
            <textarea
              rows={4}
              value={ticketForm.message}
              onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
              placeholder="Describe con claridad tu duda, pregunta o el inconveniente presentado..."
              required
              className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-y ${
                isDarkMode
                  ? "bg-[#111C20] border-[#26383D] text-white placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
              }`}
            />
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submittingTicket}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition-all disabled:opacity-50"
            >
              {submittingTicket ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Enviando consulta...</span>
                </>
              ) : (
                <>
                  <span>✉️ Enviar Consulta</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN 3: MIS CONSULTAS ENVIADAS */}
      <div className={`p-6 rounded-3xl border transition-all space-y-4 ${
        isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100 shadow-sm"
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#26383D]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold">
              📋
            </div>
            <div>
              <h4 className="text-sm font-bold">
                {t("support.myTicketsTitle", "Mis Solicitudes de Soporte")}
              </h4>
              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                Historial y seguimiento de tus preguntas enviadas.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={loadSupportTickets}
            className="text-xs text-emerald-500 hover:underline font-semibold"
          >
            Actualizar
          </button>
        </div>

        {loadingTickets ? (
          <div className="py-8 text-center text-xs text-gray-400">
            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando tus solicitudes...
          </div>
        ) : supportTickets.length === 0 ? (
          <div className={`p-6 rounded-2xl text-center border ${
            isDarkMode ? "bg-[#111C20]/40 border-[#26383D]/40 text-gray-400" : "bg-gray-50/70 border-gray-100 text-gray-500"
          }`}>
            <p className="text-sm font-semibold mb-1">Aún no has registrado solicitudes</p>
            <p className="text-xs">Usa el formulario superior si tienes cualquier inquietud sobre la plataforma.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {supportTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDarkMode ? "bg-[#111C20] border-[#26383D]" : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {ticket.subject || "Sin asunto"}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ticket.status === "Resolved" || ticket.status === "Closed"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : ticket.status === "InProgress"
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                    }`}>
                      {ticket.status === "Resolved" ? "Resuelto" : ticket.status === "InProgress" ? "En Proceso" : ticket.status === "Closed" ? "Cerrado" : "Pendiente"}
                    </span>
                  </div>
                  <p className={`text-xs line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {ticket.message || "Sin descripción"}
                  </p>
                </div>
                <div className="text-[11px] text-gray-400 sm:text-right shrink-0">
                  {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTab;
