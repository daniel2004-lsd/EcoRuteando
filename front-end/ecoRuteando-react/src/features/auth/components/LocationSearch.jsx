// features/auth/components/LocationSearch.jsx
import { useState, useEffect, useRef } from 'react';

const LocationSearch = ({ placeholder, onSelect, isDarkMode }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);

  // Buscar lugares mientras escribe
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            query + ', Neiva, Huila, Colombia'
          )}&format=json&limit=5&addressdetails=1`
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error buscando lugares:', error);
      }
      setIsLoading(false);
    }, 500);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.display_name.split(',')[0]);
    setSuggestions([]);
    onSelect({
      name: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
    });
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all focus:outline-none ${
          isDarkMode 
            ? 'bg-gray-700 border border-gray-600 text-white focus:border-emerald-500' 
            : 'bg-gray-50 border border-gray-200 text-gray-800 focus:border-emerald-400'
        }`}
      />
      
      {isLoading && (
        <div className="absolute right-3 top-3">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {suggestions.length > 0 && (
        <div className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg overflow-hidden ${
          isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          {suggestions.map((place, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(place)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="font-medium">{place.display_name.split(',')[0]}</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {place.display_name.split(',').slice(1, 4).join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;