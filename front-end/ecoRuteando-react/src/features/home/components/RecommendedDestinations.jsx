import React, { useState } from 'react';
import { RECOMMENDED_DESTINATIONS } from '../data/recommendedDestinations.js';

export { RECOMMENDED_DESTINATIONS };

const SparklesIcon = ({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    <path d="M20 3v4"/>
    <path d="M22 5h-4"/>
    <path d="M4 17v2"/>
    <path d="M5 18H3"/>
  </svg>
);

const EyeIcon = ({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const MapPinIcon = ({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const NavigationIcon = ({ className = "w-4 h-4", size = 16 }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
  </svg>
);

const FILTER_TAGS = [
  { id: 'all', label: 'Todos' },
  { id: 'ecoturismo', label: 'Ecoturismo' },
  { id: 'cultura', label: 'Cultura y Patrimonio' },
  { id: 'miradores', label: 'Miradores' },
];

export const RecommendedDestinations = ({
  onSelectDestination,
  onViewOnMap,
  isDarkMode = false,
  activeDestinationId = null,
}) => {
  const [selectedTag, setSelectedTag] = useState('all');
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const filtered = selectedTag === 'all'
    ? RECOMMENDED_DESTINATIONS
    : RECOMMENDED_DESTINATIONS.filter((d) => d.categoryTag === selectedTag);

  return (
    <div className="space-y-3">
      {/* ENCABEZADO DE LA SECCIÓN */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
            <SparklesIcon size={16} />
          </span>
          <div className="min-w-0">
            <h3 className={`text-xs sm:text-sm font-extrabold tracking-tight truncate ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Lugares recomendados para descubrir
            </h3>
            <p className={`text-[10px] sm:text-[11px] truncate ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Destinos verificados en Neiva y Huila para planear tu ruta
            </p>
          </div>
        </div>
      </div>

      {/* FILTROS POR CATEGORÍA RÁPIDA */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {FILTER_TAGS.map((tag) => {
          const isActive = selectedTag === tag.id;
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTag(tag.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                  : isDarkMode
                    ? 'bg-[#111C20] text-gray-300 border-[#26383D] hover:bg-[#162329]'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* LISTA DE TARJETAS DE DESTINOS */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar pr-0.5">
        {filtered.map((dest) => {
          const isSelected = activeDestinationId === dest.id;
          const hasImgError = imageErrors[dest.id];

          return (
            <div
              key={dest.id}
              className={`rounded-xl border overflow-hidden transition-all text-xs ${
                isSelected
                  ? isDarkMode
                    ? 'bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-md'
                    : 'bg-emerald-50/70 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                  : isDarkMode
                    ? 'bg-[#111C20] border-[#26383D] hover:border-[#3a5259]'
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
              }`}
            >
              {/* IMAGEN DE CABECERA CON BADGE DE CATEGORÍA */}
              <div className="relative h-28 w-full overflow-hidden bg-gray-900">
                {!hasImgError ? (
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    loading="lazy"
                    onError={() => handleImageError(dest.id)}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-3 text-white text-center"
                    style={{ background: `linear-gradient(135deg, ${dest.color}cc, #0B1215)` }}
                  >
                    <span className="text-2xl mb-1">{dest.categoryIcon}</span>
                    <span className="text-xs font-black tracking-wide">{dest.name}</span>
                  </div>
                )}
                {/* GRADIENTE SUPERIOR E INFERIOR */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* BADGE DE CATEGORÍA */}
                <div className="absolute top-2 left-2 z-10">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white bg-black/60 backdrop-blur-md border border-white/20">
                    <span>{dest.categoryIcon}</span>
                    <span>{dest.category}</span>
                  </span>
                </div>

                {/* NOMBRE Y MUNICIPIO SOBRE LA FOTO */}
                <div className="absolute bottom-2 left-2.5 right-2.5 z-10 text-white">
                  <h4 className="font-black text-sm drop-shadow-md leading-tight truncate">
                    {dest.name}
                  </h4>
                  <p className="text-[10px] text-white/90 drop-shadow flex items-center gap-1 font-medium">
                    <MapPinIcon size={11} className="text-emerald-400 shrink-0" />
                    <span className="truncate">{dest.location}</span>
                  </p>
                </div>
              </div>

              {/* CONTENIDO Y DESCRIPCIÓN */}
              <div className="p-2.5 space-y-2">
                <p className={`text-[11px] leading-relaxed line-clamp-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {dest.description}
                </p>

                {/* ACCIONES DEL DESTINO */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-inherit/10">
                  <button
                    type="button"
                    onClick={() => onViewOnMap?.(dest)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-all border ${
                      isDarkMode
                        ? 'bg-[#162329] text-gray-200 border-[#26383D] hover:bg-[#1f3037]'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                    title="Enfocar este lugar en el mapa"
                  >
                    <EyeIcon size={12} className="text-emerald-500" />
                    <span>Ver en el mapa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectDestination?.(dest)}
                    className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95"
                    title="Usar como destino para calcular ruta"
                  >
                    <NavigationIcon size={12} />
                    <span>Cómo llegar</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedDestinations;
