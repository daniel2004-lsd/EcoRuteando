import api from "../api/api";

const environmentalDataService = {
  getAirQuality: async ({ latitude, longitude, maxDistanceMeters = 50000 }) => {
    const { data } = await api.get("/integrations/air-quality", {
      params: { latitude, longitude, maxDistanceMeters },
    });
    return data;
  },

  ingestAirQuality: async (airQualityData) => {
    const { data } = await api.post("/integrations/air-quality/ingest", airQualityData);
    return data;
  },

  getWeather: async ({ latitude, longitude, maxDistanceMeters = 50000 }) => {
    const { data } = await api.get("/integrations/weather", {
      params: { latitude, longitude, maxDistanceMeters },
    });
    return data;
  },

  ingestWeather: async (weatherData) => {
    const { data } = await api.post("/integrations/weather/ingest", weatherData);
    return data;
  },
};

export default environmentalDataService;
