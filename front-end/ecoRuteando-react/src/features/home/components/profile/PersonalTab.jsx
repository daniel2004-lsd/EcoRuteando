import React from "react";
import {
  EditIcon,
  SaveIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  HeartIcon
} from "../../../../shared/components/Icons";

const PersonalTab = ({
  isDarkMode,
  isEditing,
  formData,
  profile,
  handleChange,
  handleStartEdit,
  handleCancelEdit,
  handleSaveClick,
  t
}) => {
  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all shadow-md ${
      isDarkMode ? "bg-[#162329] border-[#26383D]" : "bg-white border-gray-100"
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b gap-4 border-gray-200 dark:border-[#26383D]">
        <div>
          <h3 className="text-lg font-bold">
            {t("profile.personal.title", "Datos Personales")}
          </h3>
          <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            {t("profile.personal.subtitle", "Administra tu información de cuenta y contacto")}
          </p>
        </div>

        {!isEditing ? (
          <button
            type="button"
            onClick={handleStartEdit}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all self-start sm:self-auto"
          >
            <EditIcon size={16} />
            <span>{t("profile.personal.edit", "Editar Perfil")}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleCancelEdit}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                isDarkMode
                  ? "border-[#26383D] text-gray-300 hover:bg-[#111C20]"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {t("profile.personal.cancel", "Cancelar")}
            </button>
            <button
              type="button"
              onClick={handleSaveClick}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md transition-all"
            >
              <SaveIcon size={16} />
              <span>{t("profile.personal.save", "Guardar Cambios")}</span>
            </button>
          </div>
        )}
      </div>

      {/* FORMULARIO DE CAMPOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre Completo */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <UserIcon size={14} className="text-emerald-500" />
            {t("profile.fields.fullName", "Nombre Completo")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          ) : (
            <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
              isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
            }`}>
              {profile.name || "—"}
            </div>
          )}
        </div>

        {/* Correo Electrónico */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <MailIcon size={14} className="text-emerald-500" />
            {t("profile.fields.email", "Correo Electrónico")}
          </label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          ) : (
            <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
              isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
            }`}>
              {profile.email || "—"}
            </div>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <PhoneIcon size={14} className="text-emerald-500" />
            {t("profile.fields.phone", "Teléfono")}
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+57 300 123 4567"
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          ) : (
            <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
              isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
            }`}>
              {profile.phone || "—"}
            </div>
          )}
        </div>

        {/* Ubicación */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <MapPinIcon size={14} className="text-emerald-500" />
            {t("profile.fields.location", "Ciudad / Ubicación")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          ) : (
            <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
              isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
            }`}>
              {profile.location || "—"}
            </div>
          )}
        </div>

        {/* Fecha de Cumpleaños */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <CalendarIcon size={14} className="text-emerald-500" />
            {t("profile.fields.birthday", "Fecha de Cumpleaños")}
          </label>
          {isEditing ? (
            <input
              type="text"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          ) : (
            <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
              isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
            }`}>
              {profile.birthday || "—"}
            </div>
          )}
        </div>

        {/* Biografía */}
        <div className="md:col-span-2">
          <label className={`block text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2 ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            <HeartIcon size={14} className="text-emerald-500" />
            {t("profile.fields.bio", "Sobre Mí")}
          </label>
          {isEditing ? (
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode ? "bg-[#111C20] border-[#26383D] text-white" : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          ) : (
            <div className={`px-4 py-2.5 rounded-xl text-sm border font-medium ${
              isDarkMode ? "bg-[#111C20]/60 border-[#26383D]/60 text-gray-200" : "bg-gray-50 border-gray-200 text-gray-800"
            }`}>
              {profile.bio || "—"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalTab;
