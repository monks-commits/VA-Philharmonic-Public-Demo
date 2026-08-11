PHILHARMONIC PUBLIC SALE DEMO V1

Purpose:
Public browser chain for the Philharmonic native sale demo:
Hall -> Order -> Demo confirmation -> Ticket/PDF.

Folder structure must remain unchanged:
/site/pages/hall.html
/site/pages/order.html
/site/pages/ticket.html
/shared/app-config.js
/shared/supabase-client.js
/data/hall/filarmoniya.json
/data/hall/filarmoniya-small.json

Open Hall with a real published seance id:
/site/pages/hall.html?seance=<SEANCE_ID>

Example from the current test environment:
/site/pages/hall.html?seance=jazz-2026-09-15-18-00

Important:
- app-config.js contains only the browser publishable Supabase key, never service-role secrets.
- demo-confirm-order is a server Edge Function and is not included in this public folder.
- DEMO_SALES_ENABLED=true is controlled in Supabase Secrets.
- LiqPay is not used by this presentation chain.
- Hall selects its geometry from the seance hall geometry_file, so Small and Large Hall use their own JSON files.
