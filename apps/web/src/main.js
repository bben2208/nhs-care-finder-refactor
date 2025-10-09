import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import PlacePage from "./PlacePage";
/** Temporary stub if GuidancePage isn't implemented yet */
function GuidancePage() {
    return (_jsx("div", { style: { padding: 16, fontFamily: "system-ui, sans-serif" }, children: "Guidance page coming soon." }));
}
const router = createBrowserRouter([
    { path: "/", element: _jsx(App, {
        // Pick a rough coordinate for the supplied postcode prefix
        loc: approxCoordsForPostcode("SW1")
    }) },

    { path: "/place/:id", element: _jsx(PlacePage, {}) },
    { path: "/guidance", element: _jsx(GuidancePage, {}) }
]);

// Pick a rough coordinate for the supplied postcode prefix
function approxCoordsForPostcode(pc) {
    if (!pc) return { lat: 51.501, lon: -0.142 }; // London fallback
    const p = pc.trim().toUpperCase();
  
    // very rough centroids by area prefix; add/adjust as you like
    if (p.startsWith("BN")) return { lat: 50.768, lon: 0.284 };  // Eastbourne
    if (p.startsWith("SW1")) return { lat: 51.501, lon: -0.142 }; // Westminster
    if (p.startsWith("EC")) return { lat: 51.515, lon: -0.091 };  // City
    if (p.startsWith("E"))  return { lat: 51.536, lon: -0.050 };
    if (p.startsWith("W"))  return { lat: 51.514, lon: -0.202 };
    if (p.startsWith("N"))  return { lat: 51.570, lon: -0.106 };
    if (p.startsWith("S"))  return { lat: 51.420, lon: -0.190 };
    // default
    return { lat: 51.501, lon: -0.142 };
  }

ReactDOM.createRoot(document.getElementById("root")).render(_jsx(React.StrictMode, { children: _jsx(RouterProvider, { router: router }) }));
