import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { NEIVA_LAT, NEIVA_LON } from "../constants/mapConstants";

export const LocationSearch = ({ placeholder, onSelect, onClear, isDarkMode, externalValue }) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState(externalValue || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hint, setHint] = useState("");
  const debounceRef = useRef(null);
  const skipNextSearchRef = useRef(false);
  const serviceHostRef = useRef(null);
  const placesServiceRef = useRef(null);

  const [prevExternalValue, setPrevExternalValue] = useState(externalValue);
  if (externalValue !== prevExternalValue) {
    setPrevExternalValue(externalValue);
    setQuery(externalValue || "");
  }

  const getPlacesService = () => {
    if (!placesServiceRef.current && serviceHostRef.current) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(serviceHostRef.current);
    }
    return placesServiceRef.current;
  };

  const searchPredictions = (text) => {
    if (!text || text.length < 1) {
      setSuggestions([]);
      setHint("");
      return;
    }

    if (!window.google?.maps?.places) {
      setSuggestions([]);
      setHint(t("planRoute.search.mapsLoading"));
      return;
    }

    setIsLoading(true);
    setHint("");

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions(
      {
        input: text,
        types: ["geocode", "establishment"],
        componentRestrictions: { country: "CO" },
        locationBias: new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(NEIVA_LAT - 0.25, NEIVA_LON - 0.25),
          new window.google.maps.LatLng(NEIVA_LAT + 0.25, NEIVA_LON + 0.25)
        ),
      },
      (predictions, status) => {
        setIsLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions?.length) {
          setSuggestions(
            predictions.map((p) => ({
              placeId: p.place_id,
              name: p.structured_formatting?.main_text || p.description,
              address: p.structured_formatting?.secondary_text || "",
              matched: (p.matched_substrings || []).filter((ms) => ms.offset < (p.structured_formatting?.main_text || p.description).length),
            }))
          );
        } else {
          setSuggestions([]);
          setHint(
            status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS
              ? t("planRoute.search.noResults")
              : t("planRoute.search.failed")
          );
        }
      }
    );
  };

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchPredictions(query.trim()), 250);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const selectPlace = (suggestion) => {
    setShowDropdown(false);
    setIsLoading(true);
    setHint("");

    const service = getPlacesService();
    if (!service) {
      setIsLoading(false);
      return;
    }

    service.getDetails(
      {
        placeId: suggestion.placeId,
        fields: ["name", "formatted_address", "geometry"],
      },
      (place, status) => {
        setIsLoading(false);
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          place?.geometry?.location
        ) {
          const location = place.geometry.location;
          const selected = {
            name: place.name || suggestion.name,
            address: place.formatted_address || suggestion.address,
            lat: location.lat(),
            lng: location.lng(),
            placeId: suggestion.placeId,
          };
          skipNextSearchRef.current = true;
          onSelect(selected);
          setQuery(selected.name);
          setSuggestions([]);
        } else {
          setHint(t("planRoute.search.detailFailed"));
        }
      }
    );
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setHint("");
    if (onClear) onClear();
  };

  const renderName = (suggestion) => {
    const main = suggestion.name || "";
    const match = suggestion.matched?.[0];
    if (!match || match.offset >= main.length) {
      return <span className="font-medium text-sm">{main}</span>;
    }
    const prefix = main.slice(0, match.offset);
    const matched = main.slice(match.offset, match.offset + (match.length || 0));
    const suffix = main.slice(match.offset + (match.length || 0));
    return (
      <span className="font-medium text-sm">
        {prefix}
        <strong>{matched}</strong>
        {suffix}
      </span>
    );
  };

  return (
    <div className="relative w-full" ref={serviceHostRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 220)}
          className={`w-full py-2 pl-2 pr-7 text-xs sm:text-sm font-medium rounded-lg bg-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!isLoading && query && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
              isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-700/60" : "text-gray-400 hover:text-gray-700 hover:bg-gray-200"
            }`}
            title="Borrar"
          >
            ✕
          </button>
        )}
      </div>

      {showDropdown && (suggestions.length > 0 || hint) && (
        <div className={`absolute z-50 left-0 right-0 top-full mt-1.5 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto ${
          isDarkMode ? "bg-[#162329] border border-[#26383D]" : "bg-white border border-gray-200"
        }`}>
          {suggestions.map((suggestion, idx) => (
            <button
              key={`${suggestion.placeId}-${idx}`}
              onClick={() => selectPlace(suggestion)}
              className={`w-full text-left px-3.5 py-2.5 text-xs sm:text-sm transition-colors border-b last:border-b-0 ${
                isDarkMode ? "hover:bg-[#111C20] text-[#e2e8f0] border-[#26383D]" : "hover:bg-gray-50 text-gray-800 border-gray-100"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-xs select-none">📍</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate">{renderName(suggestion)}</div>
                  {suggestion.address && (
                    <div className={`text-[11px] mt-0.5 truncate ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {suggestion.address}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          {suggestions.length === 0 && hint && (
            <div className={`px-3.5 py-2.5 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
              {hint}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
