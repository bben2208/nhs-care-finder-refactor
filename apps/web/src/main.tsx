import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import PlacePage from "./PlacePage";
/** Temporary stub if GuidancePage isn't implemented yet */
function GuidancePage() {
  return (
    <div style={{ padding: 16, fontFamily: "system-ui, sans-serif" }}>
      Guidance page coming soon.
    </div>
  );
}
const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/place/:id", element: <PlacePage /> },
  { path: "/guidance", element: <GuidancePage /> }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);