import { useState, useEffect, useCallback } from "react";
import {
  UsersIcon,
  ArrowLeft,
  SearchIcon,
  XIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import userService from "../../../services/userService";

const AdminUsers = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  const [modalUser, setModalUser] = useState(null); // usuario seleccionado
  const [userRoles, setUserRoles] = useState([]);   // roles del usuario en el modal
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersData, rolesData] = await Promise.all([
        userService.getUsers(),
        userService.getRoles(),
      ]);
      setUsers(Array.isArray(usersData) ? usersData : []);
      setRoles(Array.isArray(rolesData) ? rolesData : []);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError(t("adminUsers.loadError", "No se pudieron cargar los usuarios."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const openRoles = async (user) => {
    setActionError(null);
    setModalUser(user);
    setUserRoles([]);
    try {
      const data = await userService.getUserRoles(user.id);
      setUserRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando roles:", err);
      setActionError(t("adminUsers.rolesError", "No se pudieron cargar los roles."));
    }
  };

  const hasRole = (roleId) => userRoles.some((r) => r.roleId === roleId);

  const toggleRole = async (role) => {
    if (!modalUser || acting) return;
    setActing(true);
    setActionError(null);
    try {
      if (hasRole(role.id)) {
        await userService.removeRole(modalUser.id, role.id);
        setUserRoles((prev) => prev.filter((r) => r.roleId !== role.id));
      } else {
        await userService.assignRole(modalUser.id, role.id);
        setUserRoles((prev) => [...prev, { roleId: role.id, roleName: role.name }]);
      }
      // Refrescar lista principal (la columna de rol puede cambiar)
      const refreshed = await userService.getUsers();
      setUsers(Array.isArray(refreshed) ? refreshed : []);
    } catch (err) {
      console.error("Error actualizando rol:", err);
      setActionError(t("adminUsers.actionError", "No se pudo actualizar el rol."));
    } finally {
      setActing(false);
    }
  };

  const filtered = users.filter((user) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (user.firstName || "").toLowerCase().includes(q) ||
      (user.lastName || "").toLowerCase().includes(q) ||
      (user.email || "").toLowerCase().includes(q) ||
      (user.role || "").toLowerCase().includes(q)
    );
  });

  const cardBg = isDarkMode ? 'bg-[#162329] border-[#26383D]' : 'bg-white border-gray-100';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B1215]' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? '☀️' : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? 'bg-[#162329] border-b border-emerald-500/30' : 'bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700'} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? 'bg-[#162329] border border-emerald-500/30' : 'bg-white'}`}>
                <UsersIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t("adminUsers.title", "Gestión de Usuarios")}</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>{t("adminUsers.subtitle", "Consulta y asigna roles de los usuarios")}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("/admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-[#162329]/50 text-emerald-400 border border-emerald-500/30 hover:bg-[#162329]' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              {t("adminUsers.backToPanel", "Volver al Panel")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Buscador */}
        <div className={`rounded-2xl p-4 mb-8 shadow-md border flex items-center gap-3 ${cardBg}`}>
          <SearchIcon size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("adminUsers.searchPlaceholder", "Buscar por nombre, email o rol...")}
            className={`flex-1 bg-transparent text-sm outline-none ${isDarkMode ? 'text-[#e2e8f0] placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'}`}
          />
          <span className={`text-xs font-semibold ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
            {filtered.length} / {users.length}
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={loadUsers} className="font-semibold underline">{t("adminUsers.retry", "Reintentar")}</button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className={`${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("adminUsers.loading", "Cargando usuarios...")}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-20 rounded-2xl ${cardBg}`}>
            <span className={`block mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}><UsersIcon size={48} /></span>
            <p className={`${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("adminUsers.empty", "Sin usuarios")}</p>
          </div>
        ) : (
          <div className={`rounded-2xl shadow-md border overflow-hidden ${cardBg}`}>
            {/* Cabecera tabla */}
            <div className={`hidden md:grid grid-cols-12 gap-4 px-5 py-3 text-xs font-semibold uppercase border-b ${isDarkMode ? 'bg-[#0B1215] border-[#26383D] text-[#94a3b8]' : 'bg-gray-50 border-gray-100 text-gray-500'}`}>
              <div className="col-span-4">{t("adminUsers.col.name", "Nombre")}</div>
              <div className="col-span-4">{t("adminUsers.col.email", "Email")}</div>
              <div className="col-span-2">{t("adminUsers.col.role", "Rol")}</div>
              <div className="col-span-2 text-right">{t("adminUsers.col.actions", "Acciones")}</div>
            </div>

            {filtered.map((user) => (
              <div
                key={user.id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-1 md:gap-4 px-5 py-4 border-b last:border-b-0 items-center ${isDarkMode ? 'border-[#26383D]' : 'border-gray-100'}`}
              >
                <div className={`md:col-span-4 text-sm font-semibold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                  {[user.firstName, user.lastName].filter(Boolean).join(" ") || "—"}
                </div>
                <div className={`md:col-span-4 text-sm break-all ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {user.email}
                </div>
                <div className="md:col-span-2">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    user.role === "Admin"
                      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/40"
                      : "bg-blue-500/15 text-blue-600 border-blue-500/40"
                  }`}>
                    {user.role || "—"}
                  </span>
                </div>
                <div className="md:col-span-2 md:text-right">
                  <button
                    onClick={() => openRoles(user)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${isDarkMode
                      ? 'border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10'
                      : 'border-emerald-600 text-emerald-700 hover:bg-emerald-50'}`}
                  >
                    {t("adminUsers.manageRoles", "Roles")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL de roles */}
      {modalUser && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setModalUser(null)}
        >
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border ${cardBg}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                {t("adminUsers.rolesTitle", "Roles del usuario")}
              </h3>
              <button
                onClick={() => setModalUser(null)}
                className={`p-1 rounded-lg ${isDarkMode ? 'text-gray-400 hover:bg-[#26383D]' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                <XIcon size={18} />
              </button>
            </div>
            <p className={`text-sm mb-5 break-all ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
              {modalUser.email}
            </p>

            {actionError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm">
                {actionError}
              </div>
            )}

            <div className="space-y-3">
              {roles.map((role) => {
                const assigned = hasRole(role.id);
                return (
                  <div
                    key={role.id}
                    className={`flex items-center justify-between rounded-xl p-4 border ${isDarkMode ? 'border-[#26383D] bg-[#0B1215]' : 'border-gray-100 bg-gray-50'}`}
                  >
                    <div>
                      <p className={`text-sm font-bold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>{role.name}</p>
                      {role.description && (
                        <p className={`text-xs ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{role.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleRole(role)}
                      disabled={acting}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border disabled:opacity-50 ${
                        assigned
                          ? 'bg-red-500/10 text-red-600 border-red-500/40 hover:bg-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/40 hover:bg-emerald-500/20'
                      }`}
                    >
                      {assigned
                        ? t("adminUsers.remove", "Quitar")
                        : t("adminUsers.assign", "Asignar")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
