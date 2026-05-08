import React from "react";
import ReactDOM from "react-dom/client";
import App from './app/App'
import { ThemeProvider } from "./app/context/ThemeContext";

import "./index.css";

// Importa i18n para inicializar traducciones
import "./i18n"; // <-- asegúrate de que este archivo exista y tenga la configuración que te mostré

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
    <App />  
    </ThemeProvider>
  </React.StrictMode>
);