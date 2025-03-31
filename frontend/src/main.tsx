// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>,
  // </StrictMode>,
);
