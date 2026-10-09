import { useState, useEffect } from "react";
import {
  MapPinIcon,
  LeafIcon,
  ArrowLeft,
  EditIcon,
  AlertTriangleIcon,
} from "../../../shared/components/Icons";
import { useTheme } from "../../../app/context/ThemeContext";
import poiService from "../../../services/poiService";

const EMPTY_FORM = {
  name: "",
  poiType: "",
  lat: "",
  lng: "",
  description: "",
  address: "",
  iconUrl: "",
  source: "",
};

const PoiManage = ({ onNavigate }) => {
  const { isDarkMode, toggleTheme } = useTheme();

  const [pois, setPois] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    loadPois();
  }, []);

  const loadPois = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await poiService.getAll(filter || null);
      setPois(data);
    } catch (err) {
      console.error("Error cargando puntos de interés:", err);
      setError("No se pudieron cargar los puntos de interés");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (poi) => {
    setEditingId(poi.id);
    setForm({
      name: poi.name,
      poiType: poi.poiType,
      lat: poi.lat,
      lng: poi.lng,
      description: poi.description || "",
      address: poi.address || "",
      iconUrl: poi.iconUrl || "",
      source: poi.source || "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.poiType.trim()) {
      setError("El nombre y el tipo son obligatorios");
      return;
    }

    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (isNaN(lat) || isNaN(lng)) {
      setError("Debe indicar una ubicación válida (latitud y longitud)");
      return;
    }

    const payload = {
      name: form.name.trim(),
      poiType: form.poiType.trim(),
      lat,
      lng,
      description: form.description?.trim() || null,
      address: form.address?.trim() || null,
      iconUrl: form.iconUrl?.trim() || null,
      source: form.source?.trim() || null,
    };

    setSaving(true);
    setError(null);
    try {
      if (editingId) {
        await poiService.update(editingId, payload);
      } else {
        await poiService.create(payload);
      }
      setModalOpen(false);
      loadPois();
    } catch (err) {
      console.error("Error guardando punto de interés:", err);
      setError("No se pudo guardar el punto de interés");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeactivate = (poi) => {
    setConfirmDelete(poi);
  };

  const handleDeactivate = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      await poiService.deactivate(confirmDelete.id);
      setConfirmDelete(null);
      loadPois();
    } catch (err) {
      console.error("Error desactivando punto de interés:", err);
      setError("No se pudo desactivar el punto de interés");
    } finally {
      setSaving(false);
    }
  };

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
                <MapPinIcon size={24} className="text-emerald-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Gestión de Puntos de Interés</h1>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-green-100'}`}>Crear, editar y administrar lugares para las rutas</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.("/admin")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${isDarkMode ? 'bg-gray-700/50 text-emerald-400 border border-emerald-500/30 hover:bg-gray-700' : 'bg-white/20 text-white hover:bg-white/30 border border-white/30'}`}
            >
              <ArrowLeft size={16} />
              Volver al Panel
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
              placeholder="Filtrar por tipo (park, restaurant, station...)"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadPois()}
              className={`px-4 py-2.5 rounded-lg text-sm border transition-all focus:outline-none w-full md:w-80 ${
                isDarkMode ? 'bg-gray-800 border-gray-700 text-white focus:border-emerald-500' : 'bg-white border-gray-300 text-gray-800 focus:border-emerald-500'
              }`}
            />
            <button
              onClick={loadPois}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${isDarkMode ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'}`}
            >
              Buscar
            </button>
          </div>

          <button
            onClick={openCreate}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center gap-2 justify-center"
          >
            <span className="text-base">＋</span>
            Nuevo Punto de Interés
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
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cargando puntos de interés...</p>
          </div>
        )}

        {/* Lista */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pois.map((poi) => (
              <div
                key={poi.id}
                className={`rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-300 border ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-emerald-500/50' : 'bg-white border-gray-100 hover:border-emerald-200'}`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                      <MapPinIcon size={20} className="text-emerald-500" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{poi.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                        {poi.poiType}
                      </span>
                    </div>
                  </div>
                </div>

                {poi.description && (
                  <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{poi.description}</p>
                )}

                <div className={`text-xs space-y-1 mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {poi.address && (
                    <div className="flex items-center gap-1">
                      <span>📍</span>
                      <span>{poi.address}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span>🌐</span>
                    <span>{poi.lat?.toFixed?.(5) ?? poi.lat}, {poi.lng?.toFixed?.(5) ?? poi.lng}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(poi)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDarkMode ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200'}`}
                  >
                    <EditIcon size={14} />
                    Editar
                  </button>
                  <button
                    onClick={() => confirmDeactivate(poi)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isDarkMode ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/30' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}
                  >
                    <AlertTriangleIcon size={14} />
                    Desactivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!loading && !error && pois.length === 0 && (
          <div className={`text-center py-16 rounded-2xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <MapPinIcon size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No hay puntos de interés registrados</p>
            <button
              onClick={openCreate}
              className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all"
            >
              Crear el primero
            </button>
          </div>
        )}

        {/* Frase motivacional */}
        <div className="mt-8 text-center">
          <p className={`text-sm flex items-center justify-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <LeafIcon size={14} className="text-emerald-500" />
            Cada lugar relevante conecta mejores rutas
            <LeafIcon size={14} className="text-emerald-500" />
          </p>
        </div>
      </div>

      {/* MODAL CREAR/EDITAR */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setModalOpen(false)} />
          <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {editingId ? "Editar Punto de Interés" : "Nuevo Punto de Interés"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nombre *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Parque Santander"
                    className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tipo *</label>
                  <input
                    name="poiType"
                    value={form.poiType}
                    onChange={handleChange}
                    placeholder="park, restaurant, station..."
                    className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Latitud *</label>
                  <input
                    name="lat"
                    type="number"
                    step="any"
                    value={form.lat}
                    onChange={handleChange}
                    placeholder="2.9273"
                    className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Longitud *</label>
                  <input
                    name="lng"
                    type="number"
                    step="any"
                    value={form.lng}
                    onChange={handleChange}
                    placeholder="-75.2819"
                    className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Dirección</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Centro, Neiva"
                  className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Breve descripción del lugar"
                  className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>URL del icono</label>
                <input
                  name="iconUrl"
                  value={form.iconUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none ${isDarkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDarkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMAR DESACTIVACIÓN */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setConfirmDelete(null)} />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 text-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
              <AlertTriangleIcon size={28} className="text-red-500" />
            </div>
            <h2 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Desactivar punto de interés</h2>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              ¿Desea desactivar <strong>{confirmDelete.name}</strong>? Dejará de mostrarse en el mapa y las rutas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${isDarkMode ? 'border-gray-700 text-gray-400 hover:bg-gray-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeactivate}
                disabled={saving}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all ${saving ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {saving ? "Desactivando..." : "Desactivar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoiManage;