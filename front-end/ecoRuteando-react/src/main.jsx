import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";

import { ThemeProvider } from "./app/context/ThemeContext";
import { AuthProvider } from "./app/context/AuthContext";
import { Toaster } from "react-hot-toast";

import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
        <Toaster position="bottom-left" />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);