export const parseCoord = (c) => {
  if (c == null) return null;
  if (typeof c === "function") {
    try {
      const val = c();
      const n = Number(val);
      return Number.isFinite(n) ? n : null;
    } catch {
      return null;
    }
  }
  const n = Number(c);
  return Number.isFinite(n) ? n : null;
};

export const computeHaversineDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
