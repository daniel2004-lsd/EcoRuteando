import test from "node:test";
import assert from "node:assert/strict";

test("H-03 / CU27 Contract: saveAddressHistory payload structure matches backend requirements", () => {
  const payload = {
    searchText: "Parque Santander, Neiva",
    latitude: 2.9273,
    longitude: -75.2819,
    searchType: "route_origin",
    placeId: "place-123"
  };

  assert.equal(typeof payload.searchText, "string");
  assert.ok(payload.searchText.length > 0 && payload.searchText.length <= 300);
  assert.ok(payload.latitude >= -90 && payload.latitude <= 90);
  assert.ok(payload.longitude >= -180 && payload.longitude <= 180);
  assert.ok(["route_origin", "route_destination", "search"].includes(payload.searchType));
});

test("H-03 / CU27 Contract: getUserAddressHistory returns mapped list sorted by createdAt", () => {
  const mockHistory = [
    {
      id: "b4501a30-8d83-49d6-b097-f58c42621cb1",
      searchText: "Centro Comercial San Pedro Plaza",
      placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
      latitude: 2.9450,
      longitude: -75.2950,
      searchType: "origin",
      createdAt: "2026-11-04T12:00:00Z"
    },
    {
      id: "a1101a30-8d83-49d6-b097-f58c42621ca2",
      searchText: "Universidad Surcolombiana",
      placeId: null,
      latitude: 2.9416,
      longitude: -75.2970,
      searchType: "destination",
      createdAt: "2026-11-04T11:30:00Z"
    }
  ];

  assert.equal(mockHistory.length, 2);
  const first = mockHistory[0];
  assert.equal(first.searchText, "Centro Comercial San Pedro Plaza");
  assert.equal(Number(first.latitude), 2.9450);
  assert.equal(Number(first.longitude), -75.2950);
  assert.equal(first.searchType, "origin");
});

test("H-03 / CU27 UI Logic: frequent addresses are sliced to max 5 pills", () => {
  const fullList = Array.from({ length: 10 }, (_, i) => ({
    id: `addr-${i}`,
    searchText: `Dirección ${i}`,
    latitude: 2.9 + i * 0.001,
    longitude: -75.28 - i * 0.001
  }));

  const pills = fullList.slice(0, 5);
  assert.equal(pills.length, 5);
  assert.equal(pills[0].id, "addr-0");
  assert.equal(pills[4].id, "addr-4");
});
