import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { 
  LeafIcon, 
  ArrowLeft, 
  UserIcon, 
  LockIcon, 
  SettingsIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon, 
  EditIcon, 
  SaveIcon,
  ShieldIcon,
  HeartIcon
} from "../../../shared/components/Icons";

const UserProfile = ({ onNavigate, userRole }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "Daniel Salazar Vargas",
    email: "danielsalazarvargas953@gmail.com",
    phone: "3001234567",
    location: "Neiva, Colombia",
    birthday: "15/05/1995",
    bio: "🌿 Apasionado por la movilidad sostenible y el cuidado del medio ambiente. Cada día es una oportunidad para reducir mi huella de carbono y disfrutar de la naturaleza."
  });

  const [formData, setFormData] = useState(profile);

  // Estadísticas del usuario
  const userStats = {
    routes: 47,
    co2Saved: 32.5,
    treesEquivalent: 5,
    points: 1250
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    alert("🌱 ¡Tus cambios han sido guardados exitosamente!");
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const tabs = [
    { id: "personal", label: "Personal", icon: <UserIcon size={18} /> },
    { id: "security", label: "Seguridad", icon: <LockIcon size={18} /> },
    { id: "config", label: "Configuración", icon: <SettingsIcon size={18} /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      
      {/* HEADER CON HOJAS DECORATIVAS */}
      <header className="relative bg-gradient-to-r from-green-700 via-emerald-700 to-teal-700 shadow-lg overflow-hidden">
        {/* Círculos decorativos simples */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-48 translate-y-48" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
                <LeafIcon size={28} white={true} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
                <p className="text-green-100 text-sm flex items-center gap-2">
                  <MailIcon size={12} white={true} />
                  {profile.email}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onNavigate("dashboard")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-all border border-white/30"
            >
              <ArrowLeft size={16} />
              Volver al Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* TARJETAS DE ESTADÍSTICAS - IMPACTO AMBIENTAL */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <MapPinIcon size={20} white={true} />
              </div>
              <span className="text-2xl font-black">{userStats.routes}</span>
            </div>
            <p className="text-xs text-green-100 mt-2">Rutas Completadas</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <LeafIcon size={20} white={true} />
              </div>
              <span className="text-2xl font-black">{userStats.co2Saved} kg</span>
            </div>
            <p className="text-xs text-green-100 mt-2">CO₂ Ahorrado</p>
          </div>
          
          <div className="bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <LeafIcon size={20} white={true} />
              </div>
              <span className="text-2xl font-black">{userStats.treesEquivalent}</span>
            </div>
            <p className="text-xs text-green-100 mt-2">Árboles Equivalentes</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <HeartIcon size={20} white={true} />
              </div>
              <span className="text-2xl font-black">{userStats.points}</span>
            </div>
            <p className="text-xs text-green-100 mt-2">Puntos Eco</p>
          </div>
        </div>

        {/* TABS PERSONALIZADOS */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-1 mb-6 flex gap-1 border border-white/40 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                  : "text-gray-600 hover:bg-green-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* PANEL DE PERSONAL */}
        {activeTab === "personal" && (
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
            {/* Header decorativo */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-5 overflow-hidden">
              <div className="relative z-10 flex justify-between items-center flex-wrap gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">🌿 Información Personal</h2>
                  <p className="text-green-100 text-sm">Actualiza tu información personal y de contacto</p>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition-all shadow-md"
                  >
                    <EditIcon size={16} />
                    Editar Perfil
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-green-700 rounded-xl text-sm font-semibold hover:bg-green-50 transition-all shadow-md"
                    >
                      <SaveIcon size={16} />
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Formulario */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar / Foto de perfil */}
                <div className="md:col-span-2 flex justify-center mb-4">
                  <div className="relative">
                    <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                      <span className="text-4xl font-bold text-white">
                        {profile.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                      <EditIcon size={14} white={true} />
                    </div>
                  </div>
                </div>

                {/* Nombre Completo */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <UserIcon size={16} className="text-green-600" />
                    Nombre Completo
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-green-50/30"
                    />
                  ) : (
                    <p className="text-gray-800 py-3 px-4 bg-green-50/30 rounded-xl border border-green-100">
                      {profile.name}
                    </p>
                  )}
                </div>

                {/* Correo Electrónico */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MailIcon size={16} className="text-emerald-600" />
                    Correo Electrónico
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-green-50/30"
                    />
                  ) : (
                    <p className="text-gray-800 py-3 px-4 bg-green-50/30 rounded-xl border border-green-100">
                      {profile.email}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <PhoneIcon size={16} className="text-teal-600" />
                    Teléfono
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-green-50/30"
                    />
                  ) : (
                    <p className="text-gray-800 py-3 px-4 bg-green-50/30 rounded-xl border border-green-100">
                      {profile.phone}
                    </p>
                  )}
                </div>

                {/* Ubicación */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPinIcon size={16} className="text-green-600" />
                    Ubicación
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-green-50/30"
                    />
                  ) : (
                    <p className="text-gray-800 py-3 px-4 bg-green-50/30 rounded-xl border border-green-100">
                      {profile.location}
                    </p>
                  )}
                </div>

                {/* Fecha de Nacimiento */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <CalendarIcon size={16} className="text-emerald-600" />
                    Fecha de Nacimiento
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-green-50/30"
                      placeholder="dd/mm/aaaa"
                    />
                  ) : (
                    <p className="text-gray-800 py-3 px-4 bg-green-50/30 rounded-xl border border-green-100">
                      {profile.birthday}
                    </p>
                  )}
                </div>

                {/* Biografía */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <HeartIcon size={16} className="text-teal-600" />
                    Biografía
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-green-50/30 resize-none"
                      placeholder="Cuéntanos un poco sobre ti..."
                    />
                  ) : (
                    <p className="text-gray-600 py-3 px-4 bg-green-50/30 rounded-xl border border-green-100 leading-relaxed">
                      {profile.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL DE SEGURIDAD */}
        {activeTab === "security" && (
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5">
              <h2 className="text-xl font-bold text-white">🔒 Seguridad de la Cuenta</h2>
              <p className="text-green-100 text-sm">Administra tu contraseña y métodos de autenticación</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="border-b border-gray-100 pb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Cambiar Contraseña</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="Contraseña actual"
                    className="px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Nueva contraseña"
                    className="px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Confirmar nueva contraseña"
                    className="px-4 py-3 border-2 border-green-100 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  />
                </div>
                <button className="mt-4 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all">
                  Actualizar Contraseña
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800">Autenticación en dos pasos</h3>
                  <p className="text-xs text-gray-500">Añade una capa extra de seguridad a tu cuenta</p>
                </div>
                <button className="px-5 py-2 border-2 border-emerald-600 text-emerald-600 rounded-xl text-sm font-semibold hover:bg-emerald-600 hover:text-white transition-all">
                  Activar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PANEL DE CONFIGURACIÓN */}
        {activeTab === "config" && (
          <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-5">
              <h2 className="text-xl font-bold text-white">⚙️ Preferencias</h2>
              <p className="text-green-100 text-sm">Personaliza tu experiencia en EcoRuteando</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-800">Notificaciones por correo</h3>
                  <p className="text-xs text-gray-500">Recibe alertas sobre tus rutas y actividades</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <h3 className="font-semibold text-gray-800">Idioma</h3>
                  <p className="text-xs text-gray-500">Selecciona tu idioma preferido</p>
                </div>
                <select className="px-3 py-2 border-2 border-green-100 rounded-xl text-sm focus:border-green-500 outline-none bg-green-50/30">
                  <option>Español</option>
                  <option>English</option>
                  <option>Português</option>
                  <option>Français</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-semibold text-gray-800">Modo oscuro</h3>
                  <p className="text-xs text-gray-500">Cambia la apariencia de la aplicación</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* BADGE DE ADMIN */}
        {userRole === "admin" && (
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                <ShieldIcon size={22} white={true} />
              </div>
              <div>
                <p className="font-bold text-purple-800">Panel de Administración</p>
                <p className="text-xs text-purple-600">Tienes acceso a herramientas de gestión del sistema</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("admin")}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              Ir al Panel →
            </button>
          </div>
        )}

        {/* FRASE MOTIVACIONAL */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <LeafIcon size={14} className="text-green-500" />
            Cada pequeño cambio cuenta. ¡Sigue así!
            <LeafIcon size={14} className="text-green-500" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;