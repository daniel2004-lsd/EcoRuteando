import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  HeartIcon,
  LeafIcon,
  ArrowLeft,
  ClockIcon,
  MapIcon,
  RouteIcon,
  AwardIcon
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { me } from "../../../services/authService";
import favoriteService from "../../../services/favoriteService";
import routeService from "../../../services/routeService";

// Componente principal — Mis rutas favoritas (CU11)
const Favorites = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { isDarkMode, toggleTheme } = useTheme();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  // Modal para añadir una ruta a favoritos
  const [showAddModal, setShowAddModal] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(false);

  const loadFavorites = async () => {
    setLoading(true);
    setError(null);
    try {
      // Verificar sesión activa (CU11: precondición sesión activa)
      try {
        await me();
      } catch (authErr) {
        setNeedsLogin(true);
        setLoading(false);
        setFavorites([]);
        return;
      }
      const data = await favoriteService.getAll();
      setFavorites(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
      setError(err?.response?.data?.detail || err?.message || t("favorites.errorLoad", "Error cargando los favoritos"));
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAddModal = async () => {
    setShowAddModal(true);
    setRoutesLoading(true);
    try {
      const routes = await routeService.getAll();
      const favoriteIds = new Set(favorites.map((f) => f.routeId));
      // No mostrar rutas ya favoritas
      setAvailableRoutes(Array.isArray(routes) ? routes.filter((r) => !favoriteIds.has(r.id)) : []);
    } catch (err) {
      console.error("Error cargando rutas disponibles:", err);
      setAvailableRoutes([]);
    } finally {
      setRoutesLoading(false);
    }
  };

  const handleAddFavorite = async (routeId) => {
    try {
      await favoriteService.add(routeId);
      setShowAddModal(false);
      await loadFavorites();
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || t("favorites.errorAdd", "Error al guardar la ruta en favoritos"));
    }
  };

  const handleRemoveFavorite = async (routeId) => {
    try {
      await favoriteService.remove(routeId);
      setFavorites((prev) => prev.filter((f) => f.routeId !== routeId));
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || t("favorites.errorRemove", "Error al quitar la ruta de favoritos"));
    }
  };

  const openAddModalButton = () => {
    setError(null);
    openAddModal();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"}`}>
      {/* Botón modo oscuro/claro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? "bg-gray-800 border-b border-emerald-500/30" : "bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700"} shadow-xl overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-full bg-white blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-7">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl ring-4 bg-white/20 backdrop-blur-sm ring-white/30">
                <HeartIcon size={26} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  {t("favorites.title", "Mis rutas favoritas")}
                </h1>
                <p className={`text-sm font-medium ${isDarkMode ? "text-emerald-400" : "text-emerald-100"}`}>
                  {t("favorites.subtitle", "Accede rápido a tus rutas para futuros trayectos")}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("/dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md hover:shadow-lg ${isDarkMode ? "bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700" : "bg-white/15 text-white hover:bg-white/25 border border-white/40 backdrop-blur-sm"}`}
            >
              <ArrowLeft />
              {t("favorites.back", "Volver")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {error && (
          <div className={`mb-6 p-4 rounded-xl border ${isDarkMode ? "bg-red-500/10 border-red-500/30 text-red-300" : "bg-red-50 border-red-200 text-red-700"}`}>
            {error}
          </div>
        )}

        {needsLogin ? (
          <div className={`rounded-3xl p-10 text-center shadow-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <HeartIcon size={40} className="mx-auto text-emerald-500 mb-4" />
            <h2 className={`text-2xl font-black mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {t("favorites.needLoginTitle", "Inicia sesión para ver tus favoritos")}
            </h2>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {t("favorites.needLoginHint", "Debes tener una sesión activa para guardar y consultar tus rutas favoritas.")}
            </p>
            <button
              onClick={() => onNavigate("/login")}
              className="px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {t("favorites.goLogin", "Iniciar sesión")} →
            </button>
          </div>
        ) : loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className={`mt-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{t("favorites.loading", "Cargando favoritos...")}</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className={`rounded-3xl p-10 text-center shadow-xl border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
            <HeartIcon size={40} className="mx-auto text-emerald-500 mb-4" />
            <h2 className={`text-2xl font-black mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {t("favorites.empty", "Sin información disponible")}
            </h2>
            <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {t("favorites.emptyHint", "Aún no tienes rutas favoritas guardadas. Añade una ruta para acceder rápido a ella.")}
            </p>
            <button
              onClick={openAddModalButton}
              className="px-7 py-3 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {t("favorites.addFirst", "Añadir ruta a favoritos")} +
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
              <h2 className={`text-2xl font-black ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {t("favorites.listTitle", "Tus rutas favoritas")} <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>({favorites.length})</span>
              </h2>
              <button
                onClick={openAddModalButton}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg ${isDarkMode ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
              >
                {t("favorites.add", "Añadir favorita")} +
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => (
                <div
                  key={fav.routeId}
                  className={`group relative rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border overflow-hidden ${isDarkMode ? "bg-gray-800 border-gray-700 hover:border-emerald-500/50" : "bg-white border-gray-100 hover:border-emerald-300"}`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mt-10 -mr-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-100"}`}></div>

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${isDarkMode ? "bg-emerald-500/20" : "bg-gradient-to-br from-emerald-500 to-teal-500"}`}>
                        <RouteIcon size={24} className={isDarkMode ? "text-emerald-400" : "text-white"} />
                      </div>
                      <button
                        onClick={() => handleRemoveFavorite(fav.routeId)}
                        title={t("favorites.remove", "Quitar de favoritos")}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 ${isDarkMode ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-red-50 text-red-500 hover:bg-red-100"}`}
                      >
                        <HeartIcon size={20} />
                      </button>
                    </div>

                    <h3 className={`text-lg font-bold mb-1.5 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                      {fav.routeName}
                    </h3>
                    {fav.description && (
                      <p className={`text-sm leading-relaxed mb-3 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        {fav.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 text-xs font-medium mb-4">
                      {fav.distanceKm != null && (
                        <span className={`inline-flex items-center gap-1 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                          <MapIcon size={14} /> {fav.distanceKm} km
                        </span>
                      )}
                      {fav.estimatedTimeMin != null && (
                        <span className={`inline-flex items-center gap-1 ${isDarkMode ? "text-gray-300" : "text-gray-500"}`}>
                          <ClockIcon size={14} /> {fav.estimatedTimeMin} min
                        </span>
                      )}
                      {fav.co2SavedKg != null && (
                        <span className={`inline-flex items-center gap-1 ${isDarkMode ? "text-teal-400" : "text-teal-600"}`}>
                          <LeafIcon size={14} /> {fav.co2SavedKg} kg CO₂
                        </span>
                      )}
                      {fav.difficultyLevel != null && (
                        <span className={`inline-flex items-center gap-1 ${isDarkMode ? "text-amber-400" : "text-amber-600"}`}>
                          <AwardIcon size={14} /> {fav.difficultyLevel}/5
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onNavigate("/user/plan-route", { state: { favoriteRoute: fav } })}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow-md ${isDarkMode ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}
                      >
                        {t("favorites.useRoute", "Usar ruta")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* MODAL: añadir ruta a favoritos */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={() => setShowAddModal(false)}>
          <div className={`max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden my-8 ${isDarkMode ? "bg-gray-800" : "bg-white"}`} onClick={(e) => e.stopPropagation()}>
            <div className={`p-5 border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"} flex items-center justify-between`}>
              <h3 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                {t("favorites.addTitle", "Añadir ruta a favoritos")}
              </h3>
              <button onClick={() => setShowAddModal(false)} className={`w-9 h-9 rounded-full flex items-center justify-center ${isDarkMode ? "bg-gray-700 text-gray-200 hover:bg-gray-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>✕</button>
            </div>
            <div className="p-5 max-h-[55vh] overflow-y-auto custom-scrollbar">
              {routesLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : availableRoutes.length === 0 ? (
                <p className={`text-sm text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                  {t("favorites.noAvailable", "No hay rutas disponibles para añadir. Todas tus rutas ya están en favoritos.")}
                </p>
              ) : (
                <div className="space-y-3">
                  {availableRoutes.map((route) => (
                    <button
                      key={route.id}
                      onClick={() => handleAddFavorite(route.id)}
                      className={`w-full flex items-center justify-between gap-3 p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5 ${isDarkMode ? "bg-gray-700/40 border-gray-600 hover:border-emerald-500/50" : "bg-gray-50 border-gray-100 hover:border-emerald-300"}`}
                    >
                      <div className="min-w-0">
                        <p className={`font-bold text-sm truncate ${isDarkMode ? "text-white" : "text-gray-800"}`}>{route.name}</p>
                        <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          {route.startName} → {route.destinationName}
                        </p>
                      </div>
                      <span className={`shrink-0 text-2xl ${isDarkMode ? "text-red-400" : "text-red-500"}`}>♥</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
