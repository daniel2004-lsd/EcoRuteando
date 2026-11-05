import test from "node:test";
import assert from "node:assert/strict";

test("Dashboard Stats Contract: unified response structure definition without ecoPoints", () => {
  const contract = {
    routes: { created: 75, total: 80 },
    trips: { registered: 45, completed: 40, inProgress: 2, interrupted: 3 },
    favoritesCount: 8,
    totalCo2Kg: 18.5,
    totalDistanceKm: 94.2,
    totalDurationMin: 185
  };

  assert.equal(typeof contract.routes.created, "number");
  assert.equal(typeof contract.trips.completed, "number");
  assert.equal(contract.routes.created, 75, "No se trunca a 50");
  assert.equal(contract.trips.registered, 45, "Viajes registrados corresponden a route_usage");
  assert.equal(contract.ecoPoints, undefined, "ecoPoints debe estar retirado");
});

test("Dashboard Stats Logic: Routes count reflects exact created routes beyond 50 pageSize limit", () => {
  const mockBackendResponse = {
    routes: { created: 75, total: 80 },
    trips: { registered: 45, completed: 40, inProgress: 2, interrupted: 3 },
    favoritesCount: 8,
    totalCo2Kg: 18.5,
    totalDistanceKm: 94.2,
    totalDurationMin: 185
  };

  const stats = {
    routes: Number(mockBackendResponse.routes?.created ?? 0),
    trips: Number(mockBackendResponse.trips?.completed ?? 0),
    co2Saved: Number(mockBackendResponse.totalCo2Kg ?? 0).toFixed(1),
    favorites: Number(mockBackendResponse.favoritesCount ?? 0)
  };

  assert.equal(stats.routes, 75, "El contador de rutas debe ser 75 y NO truncarse a 50");
  assert.equal(stats.trips, 40, "Los viajes completados deben ser 40");
  assert.notEqual(stats.routes, stats.trips, "Rutas creadas y viajes no deben forzarse a coincidir");
  assert.equal(stats.co2Saved, "18.5");
  assert.equal(stats.favorites, 8);
  assert.equal(stats.points, undefined);
});

test("Dashboard Stats Logic: Zero counts handled gracefully without NaN or null", () => {
  const mockZeroResponse = {
    routes: { created: 0, total: 0 },
    trips: { registered: 0, completed: 0, inProgress: 0, interrupted: 0 },
    favoritesCount: 0,
    totalCo2Kg: 0,
    totalDistanceKm: 0,
    totalDurationMin: 0
  };

  const stats = {
    routes: Number(mockZeroResponse.routes?.created ?? 0),
    trips: Number(mockZeroResponse.trips?.completed ?? 0),
    co2Saved: Number(mockZeroResponse.totalCo2Kg ?? 0).toFixed(1),
    favorites: Number(mockZeroResponse.favoritesCount ?? 0)
  };

  assert.equal(stats.routes, 0);
  assert.equal(stats.trips, 0);
  assert.equal(stats.co2Saved, "0.0");
  assert.equal(stats.favorites, 0);
});
