// src/index.tsx
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="vmd4.us.auth0.com"
        clientId="geV6N3jW7Ww8rBQQP4V9B6U0IBQxnC0z"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <App />
      </Auth0Provider>
      ,
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
