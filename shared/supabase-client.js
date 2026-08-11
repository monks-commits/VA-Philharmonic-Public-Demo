(() => {
  "use strict";

  const config = window.PHILHARMONIC_APP_CONFIG;

  if (!config) {
    throw new Error("PHILHARMONIC_APP_CONFIG is not loaded");
  }

  if (!window.supabase?.createClient) {
    throw new Error("Supabase JS library is not loaded");
  }

  if (
    !config.SUPABASE_PUBLISHABLE_KEY ||
    config.SUPABASE_PUBLISHABLE_KEY === "PASTE_PUBLISHABLE_KEY_HERE"
  ) {
    console.warn(
      "Paste the Supabase publishable key into shared/app-config.js before opening the platform."
    );
  }

  const client = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        headers: {
          "x-client-info": "philharmonic-platform-web/1.0"
        }
      }
    }
  );

  let cachedProfile = null;

  function currentRelativeUrl() {
    return `${location.pathname}${location.search}${location.hash}`;
  }

  function loginUrl(next = currentRelativeUrl()) {
    const url = new URL(config.LOGIN_PATH, location.origin);
    if (next) url.searchParams.set("next", next);
    return url.pathname + url.search;
  }

  async function getSession() {
    const { data, error } = await client.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session || null;
  }

  async function requireSession() {
    const session = await getSession();

    if (!session) {
      location.replace(loginUrl());
      throw new Error("authentication_required");
    }

    return session;
  }

  async function getAccessProfile({ refresh = false } = {}) {
    if (cachedProfile && !refresh) return cachedProfile;

    await requireSession();

    const { data, error } = await client.rpc(
      "get_my_access_profile",
      {
        p_venue_id: config.VENUE_ID
      }
    );

    if (error) {
      cachedProfile = null;

      if (
        String(error.message || "").includes("staff_profile_not_found") ||
        String(error.message || "").includes("active_staff_role_not_found") ||
        String(error.message || "").includes("venue_access_denied")
      ) {
        throw new Error("staff_access_denied");
      }

      throw error;
    }

    cachedProfile = data;
    return cachedProfile;
  }

  function hasPermission(profile, permissionCode) {
    return Array.isArray(profile?.permissions) &&
      profile.permissions.includes(permissionCode);
  }

  async function requirePermission(permissionCode) {
    const profile = await getAccessProfile();

    if (!hasPermission(profile, permissionCode)) {
      const error = new Error(`permission_denied:${permissionCode}`);
      error.code = "permission_denied";
      throw error;
    }

    return profile;
  }

  async function signOut() {
    cachedProfile = null;
    await client.auth.signOut();
    location.replace(config.LOGIN_PATH);
  }

  async function invoke(functionName, body) {
    await requireSession();

    const { data, error } = await client.functions.invoke(
      functionName,
      { body }
    );

    if (error) {
      let message = error.message || "function_error";

      try {
        if (error.context && typeof error.context.json === "function") {
          const details = await error.context.json();
          message =
            details?.error ||
            details?.message ||
            message;
        }
      } catch (_) {
        // The transport error itself remains useful.
      }

      const wrapped = new Error(message);
      wrapped.original = error;
      throw wrapped;
    }

    return data;
  }

  function clearCachedProfile() {
    cachedProfile = null;
  }

  window.PH_SUPABASE = client;

  window.PhAuth = Object.freeze({
    config,
    client,
    getSession,
    requireSession,
    getAccessProfile,
    hasPermission,
    requirePermission,
    invoke,
    signOut,
    loginUrl,
    clearCachedProfile
  });
})();
