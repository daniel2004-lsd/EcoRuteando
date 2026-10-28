import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";

// Mock web storage before importing module
const mockLocalStorageStore = new Map();
const mockSessionStorageStore = new Map();

const mockLocalStorage = {
    getItem: (key) => mockLocalStorageStore.get(key) || null,
    setItem: (key, value) => mockLocalStorageStore.set(key, String(value)),
    removeItem: (key) => mockLocalStorageStore.delete(key),
    clear: () => mockLocalStorageStore.clear(),
};

const mockSessionStorage = {
    getItem: (key) => mockSessionStorageStore.get(key) || null,
    setItem: (key, value) => mockSessionStorageStore.set(key, String(value)),
    removeItem: (key) => mockSessionStorageStore.delete(key),
    clear: () => mockSessionStorageStore.clear(),
};

global.window = {
    localStorage: mockLocalStorage,
    sessionStorage: mockSessionStorage,
};
global.localStorage = mockLocalStorage;
global.sessionStorage = mockSessionStorage;

const { tokenStorage } = await import("../src/services/tokenStorage.js");

beforeEach(() => {
    tokenStorage.clearTokens();
    mockLocalStorageStore.clear();
    mockSessionStorageStore.clear();
});

test("H-40: access and refresh tokens are stored purely in memory, never in localStorage/sessionStorage", () => {
    tokenStorage.setTokens("mock-access-token-123", "mock-refresh-token-456");

    // In-memory verification
    assert.equal(tokenStorage.getAccessToken(), "mock-access-token-123");
    assert.equal(tokenStorage.getRefreshToken(), "mock-refresh-token-456");

    // Web storage verification: tokens MUST NOT be stored in localStorage or sessionStorage
    assert.equal(mockLocalStorageStore.has("accessToken"), false, "accessToken must NOT exist in localStorage");
    assert.equal(mockLocalStorageStore.has("refreshToken"), false, "refreshToken must NOT exist in localStorage");
    assert.equal(mockSessionStorageStore.has("accessToken"), false, "accessToken must NOT exist in sessionStorage");
    assert.equal(mockSessionStorageStore.has("refreshToken"), false, "refreshToken must NOT exist in sessionStorage");
});

test("H-40: 2FA temporary tokens are stored in memory and strictly isolated from session access tokens", () => {
    tokenStorage.setTokens("normal-session-token", "normal-refresh-token");
    tokenStorage.setTwoFactorToken("temp-2fa-token-xyz");

    // 2FA token is available in its dedicated slot
    assert.equal(tokenStorage.getTwoFactorToken(), "temp-2fa-token-xyz");

    // Strict isolation: 2FA temporary token does not overwrite or mix with access token
    assert.equal(tokenStorage.getAccessToken(), "normal-session-token");
    assert.notEqual(tokenStorage.getAccessToken(), tokenStorage.getTwoFactorToken());

    // Never stored in sessionStorage or localStorage
    assert.equal(mockSessionStorageStore.has("twoFactorToken"), false, "twoFactorToken must NOT exist in sessionStorage");
    assert.equal(mockLocalStorageStore.has("twoFactorToken"), false, "twoFactorToken must NOT exist in localStorage");

    // Clear 2FA token without affecting session
    tokenStorage.clearTwoFactorToken();
    assert.equal(tokenStorage.getTwoFactorToken(), null);
    assert.equal(tokenStorage.getAccessToken(), "normal-session-token");
});

test("H-40: trustedDeviceToken is stored in memory and never in localStorage", () => {
    tokenStorage.setTrustedDeviceToken("trusted-dev-token-999");
    assert.equal(tokenStorage.getTrustedDeviceToken(), "trusted-dev-token-999");

    assert.equal(mockLocalStorageStore.has("trustedDeviceToken"), false, "trustedDeviceToken must NOT exist in localStorage");
});

test("H-40: clearTokens removes all memory tokens and cleans residual legacy keys", () => {
    // Simulate residual legacy tokens left by older app versions
    mockLocalStorageStore.set("accessToken", "legacy-access");
    mockLocalStorageStore.set("refreshToken", "legacy-refresh");
    mockLocalStorageStore.set("userRole", "legacy-role");
    mockLocalStorageStore.set("trustedDeviceToken", "legacy-device");
    mockSessionStorageStore.set("twoFactorToken", "legacy-2fa");

    tokenStorage.setTokens("mem-access", "mem-refresh");
    tokenStorage.setTwoFactorToken("mem-2fa");
    tokenStorage.setTrustedDeviceToken("mem-device");

    tokenStorage.clearTokens();

    // Memory tokens cleared
    assert.equal(tokenStorage.getAccessToken(), null);
    assert.equal(tokenStorage.getRefreshToken(), null);
    assert.equal(tokenStorage.getTwoFactorToken(), null);
    assert.equal(tokenStorage.getTrustedDeviceToken(), null);

    // Legacy storage purged
    assert.equal(mockLocalStorageStore.has("accessToken"), false);
    assert.equal(mockLocalStorageStore.has("refreshToken"), false);
    assert.equal(mockLocalStorageStore.has("userRole"), false);
    assert.equal(mockLocalStorageStore.has("trustedDeviceToken"), false);
    assert.equal(mockSessionStorageStore.has("twoFactorToken"), false);
});

test("H-40: subscribe listener notifies React context of token changes without Web Storage", () => {
    let notifiedState = null;
    const unsubscribe = tokenStorage.subscribe((state) => {
        notifiedState = state;
    });

    tokenStorage.setTokens("new-access-abc", "new-refresh-def");
    assert.deepEqual(notifiedState, {
        accessToken: "new-access-abc",
        refreshToken: "new-refresh-def",
    });

    tokenStorage.clearTokens();
    assert.deepEqual(notifiedState, {
        accessToken: null,
        refreshToken: null,
    });

    unsubscribe();
    tokenStorage.setTokens("after-unsub-access", "after-unsub-refresh");
    assert.deepEqual(notifiedState, {
        accessToken: null,
        refreshToken: null,
    });
});

test("H-40 Fase 2: web client supports in-memory access token with null in-memory refresh token (HttpOnly cookie mode)", () => {
    // When backend returns { accessToken } and sets HttpOnly cookie for refresh token
    tokenStorage.setAccessToken("cookie-paired-access-token");

    assert.equal(tokenStorage.getAccessToken(), "cookie-paired-access-token");
    assert.equal(tokenStorage.getRefreshToken(), null, "in-memory refresh token remains null when managed by HttpOnly cookie");

    // Still completely absent from web storage
    assert.equal(mockLocalStorageStore.has("accessToken"), false);
    assert.equal(mockLocalStorageStore.has("refreshToken"), false);
    assert.equal(mockSessionStorageStore.has("accessToken"), false);
    assert.equal(mockSessionStorageStore.has("refreshToken"), false);
});
