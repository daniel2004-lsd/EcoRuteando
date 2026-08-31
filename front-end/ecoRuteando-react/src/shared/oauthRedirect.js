const GOOGLE_CLIENT_ID =
  "409005111991-f71o4co8afdi7235fk47odktqrmn4uh6.apps.googleusercontent.com";

const FACEBOOK_APP_ID = "1374060214876328";

// Flujo implícito: Google/Facebook devuelven el access_token en el
// fragmento de la URL (#access_token=...) y el backend lo valida
// contra su API de userinfo.
export function redirectToOAuth(provider) {
  const redirectUri = `${window.location.origin}/auth/callback`;

  if (provider === "google") {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: redirectUri,
      scope: "openid email profile",
      response_type: "token",
      state: "google",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/auth?${params}`;
    return;
  }

  if (provider === "facebook") {
    const params = new URLSearchParams({
      client_id: FACEBOOK_APP_ID,
      redirect_uri: redirectUri,
      scope: "email",
      response_type: "token",
      state: "facebook",
    });

    window.location.href = `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
  }
}
