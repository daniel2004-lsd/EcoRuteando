import api from "../api/api";

const mapsService = {
  getDirections: async (originLat, originLng, destLat, destLng, travelMode) => {
    const { data } = await api.get("/maps/directions", {
      params: { originLat, originLng, destinationLat: destLat, destinationLng: destLng, travelMode },
    });
    return data;
  },

  geocode: async (address) => {
    const { data } = await api.get("/maps/geocode", {
      params: { address },
    });
    return data;
  },

  reverseGeocode: async (lat, lng) => {
    const { data } = await api.get("/maps/reverse-geocode", {
      params: { lat, lng },
    });
    return data;
  },
};

export default mapsService;