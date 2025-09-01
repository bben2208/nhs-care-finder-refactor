import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import PlacePage from "./PlacePage";
import GuidancePage from "./GuidancePage";

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