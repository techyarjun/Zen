import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "animate.css";
import { UserProvider } from "./landing_page/UserContext/usercontext";
import App from "./landing_page/App";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
