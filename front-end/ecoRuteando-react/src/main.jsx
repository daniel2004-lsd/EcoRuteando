import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import { Toaster } from "react-hot-toast";

import "./index.css";
import "./i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <App />
        <Toaster position="bottom-left" />
    </React.StrictMode>
);
