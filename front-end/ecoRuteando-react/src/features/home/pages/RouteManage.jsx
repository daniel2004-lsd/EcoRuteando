import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  RouteIcon,
  LeafIcon,
  ArrowLeft,
  EditIcon,
  AlertTriangleIcon,
  MapPinIcon,
  HeartIcon,
  ClockIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import { useTranslation } from "react-i18next";
import routeService from "../../../services/routeService";
import favoriteService from "../../../services/favoriteService";
import ratingService from "../../../services/ratingService";
import MapViewGoogle from "../../auth/components/MapViewGoogle";
import toast from "react-hot-toast";

const StarIcon = ({ filled = true, size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const MapPreviewIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const getTransportInfo = (type) => {
  switch (type?.toLowerCase()) {
    case "car":
      return { icon: "🚗", label: "Automóvil", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
    case "walking":
      return { icon: "🚶", label: "A pie", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
    case "bike":
      return { icon: "🚲", label: "Bicicleta", color: "bg-teal-500/10 text-teal-500 border-teal-500/20" };
    case "public_transport":
      return { icon: "🚌", label: "Transp. Público", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" };
    default:
      return { icon: "📍", label: type || "Ruta", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
  }
};

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

const TRANSPORT_TYPES = ["walking", "car"];

const STATUS_BADGES = {
  active: "bg-emerald-500/20 text-emerald-500",
  inactive: "bg-gray-500/20 text-gray-400",
  under_review: "bg-amber-500/20 text-amber-500",
  archived: "bg-red-500/20 text-red-400",
};

const RouteManage = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.initialTab === "favorites" ? "favorites" : "all");
  const [routes, setRoutes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Estados para valoración directa
  const [ratingsMap, setRatingsMap] = useState({});
  const [ratingModalRoute, setRatingModalRoute] = useState(null);
  const [ratingScore, setRatingScore] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  // Estados para previsualización de mapa y trazado
  const [previewMapRoute, setPreviewMapRoute] = useState(null);
  const [loadingMap, setLoadingMap] = useState(false);

  useEffect(() => {
    if (location.state?.initialTab === "favorites") {
      setActiveTab("favorites");
    } else if (location.state?.initialTab === "all") {
      setActiveTab("all");
    }
  }, [location.state]);

  useEffect(() => {
    loadData();

    // Sincronización en tiempo real: actualiza automáticamente rutas creadas en el móvil sin recargar
    const interval = setInterval(() => {
      loadData(true);
    }, 3000);

    const handleSync = () => {
      loadData(true);
    };

    window.addEventListener("focus", handleSync);
    document.addEventListener("visibilitychange", handleSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleSync);
      document.removeEventListener("visibilitychange", handleSync);
    };
  }, []);

  const loadData = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);
    try {
      const [routesData, favsData] = await Promise.allSettled([
        routeService.getAll(null, true, true),
        favoriteService.getAll()
      ]);

      const allRoutes = routesData.status === "fulfilled" && Array.isArray(routesData.value) ? routesData.value : [];
      const userSavedRoutes = allRoutes.filter(
        (r) => r.status !== "archived" && !r.description?.includes("[trip_transient]")
      );
      setRoutes(userSavedRoutes);

      const allFavs = favsData.status === "fulfilled" && Array.isArray(favsData.value) ? favsData.value : [];
      setFavorites(allFavs);

      // Cargar valoraciones en segundo plano
      loadRatingsForRoutes(userSavedRoutes);
    } catch (err) {
      console.error("Error cargando rutas y favoritos:", err);
      if (!isSilent) setError(t("routeManage.loadError", "No se pudieron cargar las rutas"));
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  const loadRatingsForRoutes = async (routeList) => {
    if (!Array.isArray(routeList) || routeList.length === 0) return;
    try {
      const results = await Promise.allSettled(
        routeList.map(async (r) => {
          const [summary, mine] = await Promise.all([
            ratingService.getByRoute(r.id).catch(() => null),
            ratingService.getMine(r.id).catch(() => null),
          ]);
          return {
            id: r.id,
            average: summary?.averageRating ?? summary?.average ?? null,
            count: summary?.totalRatings ?? summary?.count ?? 0,
            myRating: mine?.ratingValue ?? null,
          };
        })
      );
      const newMap = {};
      results.forEach((res) => {
        if (res.status === "fulfilled" && res.value) {
          newMap[res.value.id] = res.value;
        }
      });
      setRatingsMap((prev) => ({ ...prev, ...newMap }));
    } catch (err) {
      console.warn("Error cargando valoraciones:", err);
    }
  };

  const handleOpenRatingModal = (route, e) => {
    e?.stopPropagation();
    const existing = ratingsMap[route.id];
    setRatingModalRoute(route);
    setRatingScore(existing?.myRating || 5);
    setHoverRating(0);
    setRatingComment("");
  };

  const handleSubmitRating = async (e) => {
    e?.preventDefault();
    if (!ratingModalRoute || ratingScore < 1) {
      toast.error("Por favor selecciona una puntuación de 1 a 5 estrellas.");
      return;
    }
    setSubmittingRating(true);
    try {
      await ratingService.rate(ratingModalRoute.id, ratingScore, ratingComment.trim());
      toast.success("¡Calificación guardada con éxito! ⭐");
      const updatedSummary = await ratingService.getByRoute(ratingModalRoute.id).catch(() => null);
      setRatingsMap((prev) => ({
        ...prev,
        [ratingModalRoute.id]: {
          average: updatedSummary?.averageRating ?? updatedSummary?.average ?? ratingScore,
          count: updatedSummary?.totalRatings ?? (prev[ratingModalRoute.id]?.count || 0) + 1,
          myRating: ratingScore,
        },
      }));
      setRatingModalRoute(null);
    } catch (err) {
      console.error("Error al guardar calificación:", err);
      toast.error(err?.response?.data?.message || "No se pudo guardar la calificación.");
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleOpenMapModal = async (route) => {
    setPreviewMapRoute(route);
    setLoadingMap(true);
    try {
      const detail = await routeService.getById(route.id);
      setPreviewMapRoute((prev) => ({
        ...prev,
        ...detail,
        startLat: detail?.startLocation?.latitude ?? detail?.startLat ?? prev?.startLat,
        startLng: detail?.startLocation?.longitude ?? detail?.startLng ?? prev?.startLng,
        endLat: detail?.endLocation?.latitude ?? detail?.endLat ?? prev?.endLat,
        endLng: detail?.endLocation?.longitude ?? detail?.endLng ?? prev?.endLng,
        encodedPolyline: detail?.encodedPolyline || prev?.encodedPolyline,
      }));
    } catch (err) {
      console.warn("Error cargando detalle para mapa:", err);
    } finally {
      setLoadingMap(false);
    }
  };

  const isFavorite = (routeId) => {
    if (!routeId) return false;
    return favorites.some(
      (f) => String(f.routeId || f.id) === String(routeId)
    );
  };

  const toggleFavorite = async (route) => {
    const routeId = route.id;
    const isFav = isFavorite(routeId);
    if (isFav) {
      try {
        await favoriteService.remove(routeId);
        setFavorites((prev) =>
          prev.filter((f) => String(f.routeId || f.id) !== String(routeId))
        );
        toast.success(t("favorites.removedSuccess", "Ruta quitada de Favoritos."));
      } catch (err) {
        toast.error(t("favorites.errorRemove", "Error al quitar de favoritos."));
      }
    } else {
      try {
        await favoriteService.add(routeId, route.name);
        setFavorites((prev) => [
          ...prev,
          { routeId: routeId, routeName: route.name, ...route }
        ]);
        toast.success(t("favorites.addedSuccess", "Ruta añadida a Favoritos ❤️"));
      } catch (err) {
        toast.error(err?.response?.data?.message || t("favorites.errorAdd", "Error al añadir a favoritos."));
      }
    }
  };

  const handleUseRoute = async (route) => {
    let startLat = route.startLocation?.latitude ?? route.startLat;
    let startLng = route.startLocation?.longitude ?? route.startLng;
    let endLat = route.endLocation?.latitude ?? route.endLat;
    let endLng = route.endLocation?.longitude ?? route.endLng;

    // Si la ruta viene del listado resumen y no tiene coordenadas directas, pedimos el detalle
    if (startLat == null || endLat == null) {
      try {
        const detail = await routeService.getById(route.id);
        startLat = detail?.startLocation?.latitude ?? detail?.startLat;
        startLng = detail?.startLocation?.longitude ?? detail?.startLng;
        endLat = detail?.endLocation?.latitude ?? detail?.endLat;
        endLng = detail?.endLocation?.longitude ?? detail?.endLng;
      } catch (err) {
        console.warn("No se pudo obtener detalle de coordenadas:", err);
      }
    }

    onNavigate?.("/user/plan-route", {
      state: {
        favoriteRoute: {
          routeId: route.id,
          routeName: route.name,
          startName: route.startName || "Mi ubicación",
          destinationName: route.destinationName || "Destino",
          startLat,
          startLng,
          endLat,
          endLng,
          transportMode: route.transportType || "walking",
        }
      }
    });
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
      loadData();
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
      loadData();
    } catch (err) {
      console.error("Error eliminando ruta:", err);
      setError(t("routeManage.errors.deleteFailed", "No se pudo eliminar la ruta"));
    } finally {
      setSaving(false);
    }
  };

  // Combinar rutas guardadas con rutas que estén en favoritos pero no creadas por el usuario
  const allCombinedRoutes = [...routes];
  favorites.forEach((fav) => {
    const fId = fav.routeId || fav.id;
    if (fId && !allCombinedRoutes.some((r) => r.id === fId)) {
      allCombinedRoutes.push({
        id: fId,
        name: fav.routeName || fav.name || t("favorites.defaultName", "Ruta favorita"),
        startName: fav.originAddress || fav.startName || "",
        destinationName: fav.destinationAddress || fav.destinationName || "",
        transportType: fav.transportMode || fav.transportType || "walking",
        status: "active",
        distanceKm: fav.distanceKm ?? null,
        estimatedTimeMin: fav.estimatedTimeMin ?? null,
        co2SavedKg: fav.co2SavedKg ?? null,
        difficultyLevel: fav.difficultyLevel ?? 1,
        startLat: fav.startLat ?? null,
        startLng: fav.startLng ?? null,
        endLat: fav.endLat ?? null,
        endLng: fav.endLng ?? null,
      });
    }
  });

  const displayedRoutes = allCombinedRoutes.filter((r) => {
    const matchesQuery =
      !filter.trim() ||
      r.name?.toLowerCase().includes(filter.trim().toLowerCase()) ||
      r.startName?.toLowerCase().includes(filter.trim().toLowerCase()) ||
      r.destinationName?.toLowerCase().includes(filter.trim().toLowerCase());

    if (!matchesQuery) return false;
    if (activeTab === "favorites") {
      return isFavorite(r.id);
    }
    return true;
  });

  const favoritesCount = allCombinedRoutes.filter((r) => isFavorite(r.id)).length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B1215]' : 'bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50'}`}>

      {/* Botón modo oscuro */}
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
                <RouteIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{t("routeManage.title", "Mis Rutas y Favoritas")}</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>{t("routeManage.subtitle", "Tus trayectos guardados y favoritos en un solo lugar")}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("/dashboard")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-[#162329]/50 text-emerald-400 border border-emerald-500/30 hover:bg-[#1e293b]' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              {t("routeManage.backToDashboard", "Volver al Dashboard")}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* PESTAÑAS ESTILO GOOGLE MAPS */}
        <div className="flex items-center gap-2 mb-6 p-1.5 rounded-2xl border max-w-md w-full bg-inherit">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "all"
                ? "bg-emerald-600 text-white shadow-md"
                : isDarkMode
                  ? "text-gray-300 hover:bg-[#162329]"
                  : "text-gray-600 hover:bg-white/70"
            }`}
          >
            <RouteIcon size={16} />
            <span>{t("routeManage.allRoutes", "Todas mis rutas")}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${
              activeTab === "all" ? "bg-white/20 text-white" : "bg-emerald-500/10 text-emerald-500"
            }`}>
              {routes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === "favorites"
                ? "bg-rose-600 text-white shadow-md"
                : isDarkMode
                  ? "text-gray-300 hover:bg-[#162329]"
                  : "text-gray-600 hover:bg-white/70"
            }`}
          >
            <HeartIcon size={16} />
            <span>{t("favorites.title", "Favoritas")}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${
              activeTab === "favorites" ? "bg-white/20 text-white" : "bg-rose-500/10 text-rose-500"
            }`}>
              {favoritesCount}
            </span>
          </button>
        </div>

        {/* Barra de acciones */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder={t("routeManage.filterPlaceholder", "Filtrar por nombre o dirección...")}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`px-4 py-2.5 rounded-lg text-sm border transition-all focus:outline-none w-full md:w-80 ${
                isDarkMode ? 'bg-[#162329] border-emerald-800/20 text-[#e2e8f0] focus:border-emerald-500' : 'bg-white border-gray-300 text-gray-800 focus:border-emerald-500'
              }`}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openCreate}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 justify-center"
            >
              <span className="text-base">＋</span>
              {t("routeManage.newRoute", "Nueva Ruta")}
            </button>
          </div>
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
            <p className={`${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.loading", "Cargando rutas...")}</p>
          </div>
        )}

        {/* Lista */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedRoutes.map((route) => {
              const fav = isFavorite(route.id);
              const transport = getTransportInfo(route.transportType);
              const ratingData = ratingsMap[route.id];
              const avgRating = ratingData?.average != null ? Number(ratingData.average).toFixed(1) : null;
              const ratingCount = ratingData?.count || 0;

              return (
                <div
                  key={route.id}
                  className={`rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border flex flex-col justify-between group ${
                    isDarkMode
                      ? 'bg-[#162329] border-emerald-800/20 hover:border-emerald-500/50'
                      : 'bg-white border-gray-100 hover:border-emerald-200'
                  }`}
                >
                  <div>
                    {/* MINIMAPA EN LA PARTE SUPERIOR DE CADA CUADRO */}
                    <div
                      className="relative w-full h-44 bg-slate-900 overflow-hidden cursor-pointer group/map"
                      onClick={() => handleOpenMapModal(route)}
                      title="Clic para ampliar el mapa y ver el recorrido completo"
                    >
                      <MapViewGoogle
                        height="176px"
                        center={
                          route.startLat != null && route.startLng != null
                            ? { lat: Number(route.startLat), lng: Number(route.startLng) }
                            : { lat: 2.9273, lng: -75.2819 }
                        }
                        zoom={13}
                        showUserLocation={false}
                        routeGeometry={route.encodedPolyline}
                        markers={[
                          ...(route.startLat != null ? [{
                            lat: Number(route.startLat),
                            lng: Number(route.startLng),
                            type: 'origin',
                            popup: route.startName || 'Origen'
                          }] : []),
                          ...(route.endLat != null ? [{
                            lat: Number(route.endLat),
                            lng: Number(route.endLng),
                            type: 'destination',
                            popup: route.destinationName || 'Destino'
                          }] : [])
                        ]}
                      />

                      {/* Capa transparente para scroll fluido sin capturar gestos */}
                      <div className="absolute inset-0 bg-transparent transition-colors group-hover/map:bg-black/10" />

                      {/* Badges superiores sobre el mapa */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md backdrop-blur-md ${STATUS_BADGES[route.status] || STATUS_BADGES.inactive}`}>
                          {t(`routeManage.status.${route.status}`, route.status)}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center gap-1 shadow-md">
                          <span>{transport.icon}</span>
                          <span>{transport.label}</span>
                        </span>
                      </div>

                      {/* Botón de favorito flotante */}
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(route);
                          }}
                          title={fav ? t("favorites.remove", "Quitar de favoritos") : t("favorites.add", "Añadir a favoritos")}
                          aria-label="Toggle Favorito"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md hover:scale-110 ${
                            fav
                              ? "bg-rose-500/90 text-white hover:bg-rose-600"
                              : "bg-black/50 text-white hover:text-rose-400 border border-white/20"
                          }`}
                        >
                          <HeartIcon size={16} />
                        </button>
                      </div>

                      {/* Pill flotante inferior con distancia y tiempo */}
                      <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
                        <div className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/70 text-white backdrop-blur-md border border-white/20 shadow-md flex items-center gap-1.5">
                          <span>📏 {route.distanceKm != null ? `${Number(route.distanceKm).toFixed(1)} km` : '--'}</span>
                          <span>•</span>
                          <span>⏱️ {route.estimatedTimeMin != null ? `${route.estimatedTimeMin} min` : '--'}</span>
                        </div>
                      </div>

                      {/* Indicador flotante para ampliar */}
                      <div className="absolute bottom-2.5 left-2.5 z-10 opacity-0 group-hover/map:opacity-100 transition-opacity pointer-events-none">
                        <span className="px-2 py-1 rounded-md text-[10px] font-semibold bg-emerald-600/90 text-white backdrop-blur-sm shadow flex items-center gap-1">
                          <MapPreviewIcon size={12} />
                          <span>Ampliar mapa</span>
                        </span>
                      </div>
                    </div>

                    {/* CUERPO DE LA TARJETA */}
                    <div className="p-5">
                      <div className="mb-3">
                        <h3 className={`font-bold text-base truncate ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`} title={route.name}>
                          {route.name}
                        </h3>
                      </div>

                    {/* Origen y Destino destacados (Clickeables para ver mapa) */}
                    <div
                      onClick={() => handleOpenMapModal(route)}
                      className={`p-3 rounded-xl mb-3 text-xs space-y-1.5 border cursor-pointer group/route transition-all ${
                        isDarkMode
                          ? 'bg-[#0B1215]/60 border-[#26383D] hover:border-emerald-500/50 hover:bg-[#0B1215]'
                          : 'bg-slate-50 border-gray-100 hover:border-emerald-300 hover:bg-slate-100'
                      }`}
                      title="Clic para ver el recorrido marcado de origen a destino en el mapa"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 shrink-0 group-hover/route:scale-125 transition-transform" />
                        <div className="min-w-0 flex-1">
                          <span className={`text-[10px] block font-semibold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>ORIGEN (Partida)</span>
                          <p className={`truncate font-medium ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>{route.startName || "Mi ubicación"}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-1 border-t border-inherit/20">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-1 shrink-0 group-hover/route:scale-125 transition-transform" />
                        <div className="min-w-0 flex-1">
                          <span className={`text-[10px] block font-semibold ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>DESTINO (Llegada)</span>
                          <p className={`truncate font-medium ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>{route.destinationName || "Destino seleccionado"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Grilla de Métricas Enriquecidas */}
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                        isDarkMode ? 'bg-[#162329] border-[#26383D]' : 'bg-white border-gray-100 shadow-sm'
                      }`}>
                        <span className="text-base">📏</span>
                        <div className="min-w-0">
                          <span className={`text-[10px] block ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>Distancia</span>
                          <p className={`font-bold truncate ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                            {route.distanceKm != null ? `${Number(route.distanceKm).toFixed(1)} km` : '--'}
                          </p>
                        </div>
                      </div>

                      <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                        isDarkMode ? 'bg-[#162329] border-[#26383D]' : 'bg-white border-gray-100 shadow-sm'
                      }`}>
                        <span className="text-base">⏱️</span>
                        <div className="min-w-0">
                          <span className={`text-[10px] block ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>Tiempo</span>
                          <p className={`font-bold truncate ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                            {route.estimatedTimeMin != null ? `${route.estimatedTimeMin} min` : '--'}
                          </p>
                        </div>
                      </div>

                      <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                        isDarkMode ? 'bg-emerald-950/20 border-emerald-800/30' : 'bg-emerald-50 border-emerald-100'
                      }`}>
                        <span className="text-base">🌱</span>
                        <div className="min-w-0">
                          <span className={`text-[10px] block ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>CO₂ Ahorrado</span>
                          <p className={`font-bold truncate text-emerald-600 dark:text-emerald-400`}>
                            {route.co2SavedKg != null ? `${Number(route.co2SavedKg).toFixed(2)} kg` : '0.00 kg'}
                          </p>
                        </div>
                      </div>

                      <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                        isDarkMode ? 'bg-orange-950/20 border-orange-800/30' : 'bg-orange-50 border-orange-100'
                      }`}>
                        <span className="text-base">🔥</span>
                        <div className="min-w-0">
                          <span className={`text-[10px] block ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>Calorías</span>
                          <p className={`font-bold truncate text-orange-600 dark:text-orange-400`}>
                            {route.estimatedCalories != null
                              ? `${Math.round(Number(route.estimatedCalories))} kcal`
                              : route.distanceKm != null
                                ? `${Math.round(Number(route.distanceKm) * (route.transportType === 'car' ? 0 : 45))} kcal`
                                : '--'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Calificación directa en la tarjeta */}
                    <div className={`p-2.5 rounded-xl mb-4 flex items-center justify-between border ${
                      isDarkMode ? 'bg-[#0B1215]/40 border-[#26383D]' : 'bg-amber-50/60 border-amber-100'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              size={14}
                              filled={avgRating ? star <= Math.round(avgRating) : false}
                              className={avgRating && star <= Math.round(avgRating) ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-bold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-700'}`}>
                          {avgRating ? `${avgRating} (${ratingCount})` : "Sin calificar"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleOpenRatingModal(route, e)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                          ratingData?.myRating
                            ? "bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 border border-amber-500/30"
                            : "bg-amber-500 text-white hover:bg-amber-600 shadow-sm"
                        }`}
                        title="Calificar esta ruta directamente sin salir"
                      >
                        <StarIcon size={12} filled={true} />
                        <span>{ratingData?.myRating ? `Mi nota: ${ratingData.myRating}★` : "Calificar"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                  {/* Acciones principales */}
                  <div>
                    <div className="flex items-center gap-2 pt-2 border-t border-inherit/10">
                      <button
                        onClick={() => handleUseRoute(route)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-center text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <span>🚀</span>
                        <span>{t("favorites.useRoute", "Usar ruta")}</span>
                      </button>

                      <button
                        onClick={() => handleOpenMapModal(route)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                          isDarkMode
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title="Ver mapa con la ruta calculada y marcada"
                      >
                        <MapPreviewIcon size={14} />
                        <span>Mapa</span>
                      </button>

                      <button
                        onClick={() => openEdit(route)}
                        className={`p-2 rounded-xl text-xs font-medium transition-all ${
                          isDarkMode
                            ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                        }`}
                        title={t("routeManage.edit", "Editar")}
                      >
                        <EditIcon size={14} />
                      </button>

                      <button
                        onClick={() => confirmDeleteRoute(route)}
                        className={`p-2 rounded-xl text-xs font-medium transition-all ${
                          isDarkMode
                            ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30'
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        }`}
                        title={t("routeManage.delete", "Eliminar")}
                      >
                        <AlertTriangleIcon size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && displayedRoutes.length === 0 && (
          <div className={`text-center py-16 rounded-2xl ${isDarkMode ? 'bg-[#162329]' : 'bg-white'}`}>
            {activeTab === "favorites" ? (
              <>
                <HeartIcon size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                  {filter.trim()
                    ? t("routeManage.noResults", "No hay rutas que coincidan con la búsqueda")
                    : t("favorites.emptyHint", "Aún no tienes rutas favoritas guardadas. Presiona el corazón en cualquier ruta para marcarla como favorita.")}
                </p>
                {!filter.trim() && (
                  <button
                    onClick={() => setActiveTab("all")}
                    className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all"
                  >
                    {t("routeManage.viewAllRoutes", "Ver todas mis rutas")}
                  </button>
                )}
              </>
            ) : (
              <>
                <RouteIcon size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <p className={`${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
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
              </>
            )}
          </div>
        )}

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
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
          <div className={`relative w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] ${isDarkMode ? 'bg-[#162329]' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                {editingId ? t("routeManage.editRoute", "Editar Ruta") : t("routeManage.newRoute", "Nueva Ruta")}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            {loadingDetail ? (
              <div className="text-center py-10">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className={`text-sm ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.loadingDetail", "Cargando detalle...")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.name", "Nombre")} *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ruta ecológica del centro"
                    className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.transportType", "Tipo de transporte")} *</label>
                    <select
                      name="transportType"
                      value={form.transportType}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      {TRANSPORT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {t(`routeManage.transport.${type}`, type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.difficulty", "Dificultad (1-5)")}</label>
                    <select
                      name="difficultyLevel"
                      value={form.difficultyLevel}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <option key={level} value={level}>{"★".repeat(level)}{"☆".repeat(5 - level)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.startName", "Origen")} *</label>
                    <input
                      name="startName"
                      value={form.startName}
                      onChange={handleChange}
                      placeholder="Parque Santander"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.destinationName", "Destino")} *</label>
                    <input
                      name="destinationName"
                      value={form.destinationName}
                      onChange={handleChange}
                      placeholder="Universidad Surcolombiana"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.startLat", "Lat. origen")}</label>
                    <input
                      name="startLat"
                      type="number"
                      step="any"
                      value={form.startLat}
                      onChange={handleChange}
                      placeholder="2.9273"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.startLng", "Lng. origen")}</label>
                    <input
                      name="startLng"
                      type="number"
                      step="any"
                      value={form.startLng}
                      onChange={handleChange}
                      placeholder="-75.2819"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.endLat", "Lat. destino")}</label>
                    <input
                      name="endLat"
                      type="number"
                      step="any"
                      value={form.endLat}
                      onChange={handleChange}
                      placeholder="2.9904"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.endLng", "Lng. destino")}</label>
                    <input
                      name="endLng"
                      type="number"
                      step="any"
                      value={form.endLng}
                      onChange={handleChange}
                      placeholder="-75.2989"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.distanceKm", "Distancia (km)")}</label>
                    <input
                      name="distanceKm"
                      type="number"
                      min="0"
                      step="any"
                      value={form.distanceKm}
                      onChange={handleChange}
                      placeholder="3.5"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.estimatedTimeMin", "Tiempo (min)")}</label>
                    <input
                      name="estimatedTimeMin"
                      type="number"
                      min="0"
                      step="any"
                      value={form.estimatedTimeMin}
                      onChange={handleChange}
                      placeholder="25"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.co2SavedKg", "CO₂ ahorrado (kg)")}</label>
                    <input
                      name="co2SavedKg"
                      type="number"
                      min="0"
                      step="any"
                      value={form.co2SavedKg}
                      onChange={handleChange}
                      placeholder="0.8"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.estimatedCalories", "Calorías")}</label>
                    <input
                      name="estimatedCalories"
                      type="number"
                      min="0"
                      step="any"
                      value={form.estimatedCalories}
                      onChange={handleChange}
                      placeholder="120"
                      className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.availableDate", "Disponible desde")}</label>
                  <input
                    name="availableDate"
                    type="date"
                    value={form.availableDate}
                    onChange={handleChange}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>{t("routeManage.description", "Descripción")}</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="2"
                    placeholder={t("routeManage.descriptionPlaceholder", "Breve descripción de la ruta")}
                    className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-[#0B1215] border-emerald-800/20 text-[#e2e8f0]' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>
              </div>
            )}

            {!loadingDetail && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModalOpen(false)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDarkMode ? 'border-emerald-800/20 text-[#94a3b8] hover:bg-[#1e293b]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
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
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 text-center ${isDarkMode ? 'bg-[#162329]' : 'bg-white'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
              <AlertTriangleIcon size={28} className="text-red-500" />
            </div>
            <h2 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>{t("routeManage.confirmDeleteTitle", "Eliminar ruta")}</h2>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
              {t("routeManage.confirmDeleteMessage", "¿Desea eliminar la ruta {{name}}? Esta acción no se puede deshacer.", { name: confirmDelete.name })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDarkMode ? 'border-emerald-800/20 text-[#94a3b8] hover:bg-[#1e293b]' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
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

      {/* MODAL DE MAPA DE RUTA Y TRAZADO CALCULADO */}
      {previewMapRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewMapRoute(null)} />
          <div className={`relative w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border ${
            isDarkMode ? 'bg-[#162329] border-emerald-500/30' : 'bg-white border-gray-100'
          }`}>
            {/* Header del modal */}
            <div className={`p-5 border-b ${
              isDarkMode ? 'bg-[#111C20] border-[#26383D]' : 'bg-emerald-50/80 border-emerald-100'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                    isDarkMode ? 'bg-emerald-500/20' : 'bg-white shadow-sm'
                  }`}>
                    {getTransportInfo(previewMapRoute.transportType).icon}
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-900'}`}>
                      {previewMapRoute.name}
                    </h2>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span>🗺️</span>
                      <span>Trazado del recorrido de origen a destino</span>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewMapRoute(null)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-base transition-all ${
                    isDarkMode ? 'text-gray-400 hover:bg-[#1e293b]' : 'text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  ✕
                </button>
              </div>

              {/* Banner visual: Origen ──> Destino */}
              <div className={`p-3.5 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border ${
                isDarkMode ? 'bg-[#0B1215] border-[#26383D]' : 'bg-white border-emerald-100 shadow-sm'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    A
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">PUNTO DE PARTIDA (ORIGEN)</span>
                    <p className={`text-xs sm:text-sm font-semibold truncate ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                      {previewMapRoute.startName || "Mi ubicación"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 px-2 text-xs font-bold text-emerald-500">
                  <span className="hidden sm:inline">─────────</span>
                  <span className="text-base">{getTransportInfo(previewMapRoute.transportType).icon}</span>
                  <span className="hidden sm:inline">────────▶</span>
                </div>

                <div className="flex items-center gap-2.5 min-w-0 flex-1 justify-start sm:justify-end sm:text-right">
                  <div className="min-w-0 order-2 sm:order-1">
                    <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">PUNTO DE LLEGADA (DESTINO)</span>
                    <p className={`text-xs sm:text-sm font-semibold truncate ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                      {previewMapRoute.destinationName || "Destino seleccionado"}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm order-1 sm:order-2">
                    B
                  </div>
                </div>
              </div>
            </div>

            {/* Métricas destacadas */}
            <div className={`px-6 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b ${
              isDarkMode ? 'bg-[#0B1215]/60 border-[#26383D]' : 'bg-slate-50 border-gray-100'
            }`}>
              <div>
                <span className={`text-[10px] block ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>Distancia</span>
                <span className={`font-bold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                  {previewMapRoute.distanceKm != null ? `${Number(previewMapRoute.distanceKm).toFixed(1)} km` : '--'}
                </span>
              </div>
              <div>
                <span className={`text-[10px] block ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-400'}`}>Tiempo estimado</span>
                <span className={`font-bold ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
                  {previewMapRoute.estimatedTimeMin != null ? `${previewMapRoute.estimatedTimeMin} min` : '--'}
                </span>
              </div>
              <div>
                <span className={`text-[10px] block text-emerald-500 font-semibold`}>CO₂ Ahorrado</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {previewMapRoute.co2SavedKg != null ? `${Number(previewMapRoute.co2SavedKg).toFixed(2)} kg` : '0.00 kg'}
                </span>
              </div>
              <div>
                <span className={`text-[10px] block text-orange-500 font-semibold`}>Calorías</span>
                <span className="font-bold text-orange-600 dark:text-orange-400">
                  {previewMapRoute.estimatedCalories != null
                    ? `${Math.round(Number(previewMapRoute.estimatedCalories))} kcal`
                    : previewMapRoute.distanceKm != null
                      ? `${Math.round(Number(previewMapRoute.distanceKm) * 45)} kcal`
                      : '--'}
                </span>
              </div>
            </div>

            {/* Contenedor del Mapa con Polyline y Marcadores */}
            <div className="relative w-full h-[420px] bg-slate-900">
              {loadingMap && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm text-white">
                  <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
                  <span className="text-xs font-semibold">Cargando trazado de la ruta...</span>
                </div>
              )}

              <MapViewGoogle
                height="420px"
                routeGeometry={previewMapRoute.encodedPolyline}
                markers={[
                  ...(previewMapRoute.startLat != null ? [{
                    lat: Number(previewMapRoute.startLat),
                    lng: Number(previewMapRoute.startLng),
                    type: 'origin',
                    popup: previewMapRoute.startName || 'Punto de partida'
                  }] : []),
                  ...(previewMapRoute.endLat != null ? [{
                    lat: Number(previewMapRoute.endLat),
                    lng: Number(previewMapRoute.endLng),
                    type: 'destination',
                    popup: previewMapRoute.destinationName || 'Punto de destino'
                  }] : [])
                ]}
              />
            </div>

            {/* Footer con botones de acción rápida */}
            <div className={`p-4 flex items-center justify-between gap-3 flex-wrap ${
              isDarkMode ? 'bg-[#111C20] border-t border-[#26383D]' : 'bg-white border-t border-gray-100'
            }`}>
              <button
                type="button"
                onClick={() => handleOpenRatingModal(previewMapRoute)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center gap-1.5"
              >
                <StarIcon size={14} filled={true} />
                <span>Calificar esta ruta</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewMapRoute(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    isDarkMode ? 'border-[#26383D] text-[#94a3b8] hover:bg-[#162329]' : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const r = previewMapRoute;
                    setPreviewMapRoute(null);
                    handleUseRoute(r);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>🚀</span>
                  <span>Usar esta ruta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CALIFICACIÓN RÁPIDA 1-CLICK */}
      {ratingModalRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRatingModalRoute(null)} />
          <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 text-center border ${
            isDarkMode ? 'bg-[#162329] border-emerald-500/30' : 'bg-white border-gray-100'
          }`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
              isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
            }`}>
              <StarIcon size={30} filled={true} />
            </div>

            <h2 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-[#e2e8f0]' : 'text-gray-800'}`}>
              Calificar Ruta
            </h2>
            <p className={`text-xs mb-4 font-medium truncate ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
              {ratingModalRoute.name}
            </p>

            {/* Estrellas interactivas */}
            <div className="flex justify-center items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRatingScore(star)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  aria-label={`Calificar con ${star} estrellas`}
                >
                  <StarIcon
                    size={34}
                    filled={star <= (hoverRating || ratingScore)}
                    className={
                      star <= (hoverRating || ratingScore)
                        ? "text-amber-400 drop-shadow-md"
                        : "text-gray-300 dark:text-gray-600"
                    }
                  />
                </button>
              ))}
            </div>

            <p className="text-xs font-bold text-amber-500 mb-4 h-4">
              {(hoverRating || ratingScore) === 1 && "⭐ 1/5 - Muy deficiente"}
              {(hoverRating || ratingScore) === 2 && "⭐⭐ 2/5 - Regular"}
              {(hoverRating || ratingScore) === 3 && "⭐⭐⭐ 3/5 - Buena"}
              {(hoverRating || ratingScore) === 4 && "⭐⭐⭐⭐ 4/5 - Muy buena"}
              {(hoverRating || ratingScore) === 5 && "⭐⭐⭐⭐⭐ 5/5 - ¡Excelente ruta!"}
            </p>

            {/* Comentario opcional */}
            <div className="mb-5 text-left">
              <label className={`block text-xs font-medium mb-1.5 ${isDarkMode ? 'text-[#94a3b8]' : 'text-gray-600'}`}>
                Comentario u opinión (opcional)
              </label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="¿Qué te pareció la seguridad, el estado de la vía o la comodidad de esta ruta?"
                rows="3"
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none ${
                  isDarkMode
                    ? 'bg-[#0B1215] border-[#26383D] text-[#e2e8f0] focus:border-amber-500'
                    : 'bg-slate-50 border-gray-200 text-gray-800 focus:border-amber-500'
                }`}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRatingModalRoute(null)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  isDarkMode ? 'border-[#26383D] text-[#94a3b8] hover:bg-[#1e293b]' : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmitRating}
                disabled={submittingRating}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                  submittingRating ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600'
                }`}
              >
                {submittingRating ? "Guardando..." : "Enviar Calificación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteManage;