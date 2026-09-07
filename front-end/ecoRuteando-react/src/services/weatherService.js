import api from "../api/api";

const weatherService = {
  getRouteWeather: async (originLat, originLng, destLat, destLng) => {
    const { data } = await api.get("/weather/route", {
      params: { originLat, originLng, destinationLat: destLat, destinationLng: destLng },
    });
    return data;
  },

  getCurrentWeather: async (lat, lng) => {
    const { data } = await api.get("/weather/current", {
      params: { lat, lng },
    });
    return data;
  },
};

// Neiva por defecto para la página de alertas del dashboard
export const NEIVA_COORDS = { lat: 2.9273, lng: -75.2819 };

export default weatherService;