import { useState, useEffect } from "react";
import {
  RouteIcon,
  LeafIcon,
  ArrowLeft,
  EditIcon,
  AlertTriangleIcon,
  MapPinIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import routeService from "../../../services/routeService";

const EMPTY_FORM = {
  name: "",
  description: "",
  transportType: "walking",
  startName: "",
  destinationName: "",
  startLat: "",
  startLng: "",
  endLat: "",
  endLng: "",
  distanceKm: "",
  estimatedTimeMin: "",
  co2SavedKg: "",
  estimatedCalories: "",
  difficultyLevel: "1",
  photoUrl: "",
  availableDate: "",
};

const TRANSPORT_TYPES = ["walking", "bike", "public_transport", "mixed"];

const STATUS_BADGES = {
  active: "bg-emerald-500/20 text-emerald-500",
  inactive: "bg-gray-500/20 text-gray-400",
  under_review: "bg-amber-500/20 text-amber-500",
  archived: "bg-red-500/20 text-red-400",
};

const RouteManage = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const [routes, setRoutes] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setLoading(true);
    setError(null);
    try {
      // includeInactive = true: la gestión debe listar todas las rutas,
      // incluidas las inactivas, en revisión o archivadas (CU03).
      const data = await routeService.getAll(null, true);
      setRoutes(data);
    } catch (err) {
      console.error("Error cargando rutas:", err);
      setError(t("routeManage.loadError", "No se pudieron cargar las rutas"));
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = async (route) => {
    setEditingId(route.id);
    setLoadingDetail(true);
    setModalOpen(true);
    try {
      const detail = await routeService.getById(route.id);
      setForm({
        name: detail.name || "",
        description: detail.description || "",
        transportType: detail.transportType || "walking",
        startName: detail.startName || "",
        destinationName: detail.destinationName || "",
        startLat: detail.startLocation?.latitude ?? "",
        startLng: detail.startLocation?.longitude ?? "",
        endLat: detail.endLocation?.latitude ?? "",
        endLng: detail.endLocation?.longitude ?? "",
        distanceKm: detail.distanceKm ?? "",
        estimatedTimeMin: detail.estimatedTimeMin ?? "",
        co2SavedKg: detail.co2SavedKg ?? "",
        estimatedCalories: detail.estimatedCalories ?? "",
        difficultyLevel: detail.difficultyLevel ?? "1",
        photoUrl: detail.photoUrl || "",
        availableDate: detail.availableDate || "",
      });
    } catch (err) {
      console.error("Error cargando detalle de la ruta:", err);
      setError(t("routeManage.loadError", "No se pudieron cargar las rutas"));
      setModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toNumberOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError(t("routeManage.errors.nameRequired", "El nombre de la ruta es obligatorio"));
      return;
    }
    if (!form.startName.trim()) {
      setError(t("routeManage.errors.startRequired", "El punto de origen es obligatorio"));
      return;
    }
    if (!form.destinationName.trim()) {
      setError(t("routeManage.errors.destinationRequired", "El punto de destino es obligatorio"));
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description?.trim() || null,
      transportType: form.transportType,
      startName: form.startName.trim(),
      destinationName: form.destinationName.trim(),
      startLat: toNumberOrNull(form.startLat),
      startLng: toNumberOrNull(form.startLng),
      endLat: toNumberOrNull(form.endLat),
      endLng: toNumberOrNull(form.endLng),
      distanceKm: toNumberOrNull(form.distanceKm),
      estimatedTimeMin: toNumberOrNull(form.estimatedTimeMin),
      co2SavedKg: toNumberOrNull(form.co2SavedKg),
      estimatedCalories: toNumberOrNull(form.estimatedCalories),
      difficultyLevel: toNumberOrNull(form.difficultyLevel),
      photoUrl: form.photoUrl?.trim() || null,
      availableDate: form.availableDate || null,
    };

    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await routeService.update(editingId, payload);
      } else {
        await routeService.create(payload);
      }
      setModalOpen(false);
      loadRoutes();
    } catch (err) {
      console.error("Error guardando ruta:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        t("routeManage.errors.saveFailed", "No se pudo guardar la ruta");
      setError(message);
      // Si es error de duplicados el modal queda abierto para corregir el nombre.
      if (!/duplicada|Ya existe una ruta/i.test(message)) {
        setModalOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteRoute = (route) => {
    setConfirmDelete(route);
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      await routeService.delete(confirmDelete.id);
      setConfirmDelete(null);
      loadRoutes();
    } catch (err) {
      console.error("Error eliminando ruta:", err);
      setError(t("routeManage.errors.deleteFailed", "No se pudo eliminar la ruta"));
    } finally {
      setSaving(false);
    }
  };

  const filteredRoutes = routes.filter((r) =>
    r.name?.toLowerCase().includes(filter.trim().toLowerCase())
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* Botón modo oscuro */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* HEADER */}
      <header className={`relative ${isDarkMode ? 'bg-gray-800 border-b border-emerald-500/30' : 'bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700'} shadow-lg overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl ${isDarkMode ? 'bg-gray-700 border border-emerald-500/30' : 'bg-white'}`}>
                <RouteIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t("routeManage.title", "Gestión de Rutas")}</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>{t("routeManage.subtitle", "Crear, editar y administrar las rutas del sistema")}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("/dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              {t("routeManage.backToDashboard", "Volver al Dashboard")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Barra de acciones */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={t("routeManage.filterPlaceholder", "Filtrar por nombre...")}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-4 py-2.5 rounded-lg text-sm border transition-all focus:outline-none w-full md:w-80 ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500' : 'bg-white border-gray-300 text-gray-800 focus:border-emerald-500'
              }`}
            />
          </div>

          <button
            onClick={openCreate}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 justify-center"
          >
            <span className="text-base">＋</span>
            {t("routeManage.newRoute", "Nueva Ruta")}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-4 font-bold">✕</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.loading", "Cargando rutas...")}</p>
          </div>
        )}

        {/* Lista */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoutes.map((route) => (
              <div
                key={route.id}
                className={`rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                      <RouteIcon size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{route.name}</h3>
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${STATUS_BADGES[route.status] || STATUS_BADGES.inactive}`}>
                        {t(`routeManage.status.${route.status}`, route.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`text-xs space-y-1 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="flex items-center gap-1">
                    <MapPinIcon size={14} className="text-emerald-500" />
                    <span>{route.startName} → {route.destinationName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>🚲</span>
                    <span>{t(`routeManage.transport.${route.transportType}`, route.transportType)}</span>
                  </div>
                  {route.distanceKm != null && (
                    <div className="flex items-center gap-1">
                      <span>📏</span>
                      <span>{route.distanceKm} km</span>
                    </div>
                  )}
                  {route.estimatedTimeMin != null && (
                    <div className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{route.estimatedTimeMin} min</span>
                    </div>
                  )}
                  {route.difficultyLevel != null && (
                    <div className="flex items-center gap-1">
                      <span>🎯</span>
                      <span>{t("routeManage.difficulty", "Dificultad")}: {"★".repeat(route.difficultyLevel)}{"☆".repeat(5 - route.difficultyLevel)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(route)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDarkMode ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'}`}
                  >
                    <EditIcon size={14} />
                    {t("routeManage.edit", "Editar")}
                  </button>
                  <button
                    onClick={() => confirmDeleteRoute(route)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDarkMode ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}
                  >
                    <AlertTriangleIcon size={14} />
                    {t("routeManage.delete", "Eliminar")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && filteredRoutes.length === 0 && (
          <div className={`text-center py-16 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <RouteIcon size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filter.trim() ? t("routeManage.noResults", "No hay rutas que coincidan con la búsqueda") : t("routeManage.empty", "No hay rutas registradas")}
            </p>
            {!filter.trim() && (
              <button
                onClick={openCreate}
                className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all"
              >
                {t("routeManage.createFirst", "Crear la primera")}
              </button>
            )}
          </div>
        )}

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            {t("routeManage.footer", "Cada ruta ecológica es un paso hacia un futuro más verde")}
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>

      {/* MODAL CREAR/EDITAR */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {editingId ? t("routeManage.editRoute", "Editar Ruta") : t("routeManage.newRoute", "Nueva Ruta")}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            {loadingDetail ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.loadingDetail", "Cargando detalle...")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.name", "Nombre")} *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ruta ecológica del centro"
                    className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.transportType", "Tipo de transporte")} *</label>
                    <select
                      name="transportType"
                      value={form.transportType}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      {TRANSPORT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {t(`routeManage.transport.${type}`, type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.difficulty", "Dificultad (1-5)")}</label>
                    <select
                      name="difficultyLevel"
                      value={form.difficultyLevel}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>{"★".repeat(level)}{"☆".repeat(5 - level)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.startName", "Origen")} *</label>
                    <input
                      name="startName"
                      value={form.startName}
                      onChange={handleChange}
                      placeholder="Parque Santander"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.destinationName", "Destino")} *</label>
                    <input
                      name="destinationName"
                      value={form.destinationName}
                      onChange={handleChange}
                      placeholder="Universidad Surcolombiana"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.startLat", "Lat. origen")}</label>
                    <input
                      name="startLat"
                      type="number"
                      step="any"
                      value={form.startLat}
                      onChange={handleChange}
                      placeholder="2.9273"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.startLng", "Lng. origen")}</label>
                    <input
                      name="startLng"
                      type="number"
                      step="any"
                      value={form.startLng}
                      onChange={handleChange}
                      placeholder="-75.2819"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.endLat", "Lat. destino")}</label>
                    <input
                      name="endLat"
                      type="number"
                      step="any"
                      value={form.endLat}
                      onChange={handleChange}
                      placeholder="2.9904"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.endLng", "Lng. destino")}</label>
                    <input
                      name="endLng"
                      type="number"
                      step="any"
                      value={form.endLng}
                      onChange={handleChange}
                      placeholder="-75.2989"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.distanceKm", "Distancia (km)")}</label>
                    <input
                      name="distanceKm"
                      type="number"
                      min="0"
                      step="any"
                      value={form.distanceKm}
                      onChange={handleChange}
                      placeholder="3.5"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.estimatedTimeMin", "Tiempo (min)")}</label>
                    <input
                      name="estimatedTimeMin"
                      type="number"
                      min="0"
                      step="any"
                      value={form.estimatedTimeMin}
                      onChange={handleChange}
                      placeholder="25"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.co2SavedKg", "CO₂ ahorrado (kg)")}</label>
                    <input
                      name="co2SavedKg"
                      type="number"
                      min="0"
                      step="any"
                      value={form.co2SavedKg}
                      onChange={handleChange}
                      placeholder="0.8"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.estimatedCalories", "Calorías")}</label>
                    <input
                      name="estimatedCalories"
                      type="number"
                      min="0"
                      step="any"
                      value={form.estimatedCalories}
                      onChange={handleChange}
                      placeholder="120"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.photoUrl", "URL de la foto")}</label>
                    <input
                      name="photoUrl"
                      value={form.photoUrl}
                      onChange={handleChange}
                      placeholder="https://..."
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.availableDate", "Disponible desde")}</label>
                    <input
                      name="availableDate"
                      type="date"
                      value={form.availableDate}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{t("routeManage.description", "Descripción")}</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="2"
                    placeholder={t("routeManage.descriptionPlaceholder", "Breve descripción de la ruta")}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>
              </div>
            )}

            {!loadingDetail && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDarkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                >
                  {t("routeManage.cancel", "Cancelar")}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                >
                  {saving ? t("routeManage.saving", "Guardando...") : editingId ? t("routeManage.saveChanges", "Guardar cambios") : t("routeManage.create", "Crear")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR ELIMINACIÓN */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
              <AlertTriangleIcon size={28} className="text-red-500" />
            </div>
            <h2 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{t("routeManage.confirmDeleteTitle", "Eliminar ruta")}</h2>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {t("routeManage.confirmDeleteMessage", "¿Desea eliminar la ruta {{name}}? Esta acción no se puede deshacer.", { name: confirmDelete.name })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDarkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                {t("routeManage.cancel", "Cancelar")}
              </button>
              <button
                onClick={handleDelete}
                disabled={saving}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {saving ? t("routeManage.deleting", "Eliminando...") : t("routeManage.deleteConfirm", "Eliminar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManage;