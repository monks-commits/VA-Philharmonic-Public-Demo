/*
  Philharmonic Platform — browser-safe configuration.

  SUPABASE_PUBLISHABLE_KEY is intentionally the only value to paste manually.
  A publishable key may be used in browser code together with RLS.
  Never place a secret/service-role key in this file.
*/
window.PHILHARMONIC_APP_CONFIG = Object.freeze({
  SUPABASE_URL: "https://lyvdrqilglqwkmajmbai.supabase.co",

  // Supabase Dashboard → Project Settings → API Keys → Publishable key
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_3iEjIeI5LxCq7kHdCQD_Iw_9nvFVMoU",

  VENUE_ID: "filarmoniya",

  LOGIN_PATH: "/VA-Philharmonic-Public-Demo/auth/login.html",
PLATFORM_ADMIN_PATH: "/VA-Philharmonic-Public-Demo/admin/platform-admin.html",
SEANCE_EDITOR_PATH: "/VA-Philharmonic-Public-Demo/admin/seance-editor.html"
});
