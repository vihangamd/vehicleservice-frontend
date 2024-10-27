// src/App.tsx
import React from "react";
import { CssBaseline } from "@mui/material";
import AppRoutes from "./AppRoutes";
import AuthLogin from "./components/authLogin";
import AuthLoginOut from "./components/authLogout";
import AuthProfile from "./components/authProfile";

const App: React.FC = () => {
  return (
    <>
      <AuthLogin />
      <AuthLoginOut />
      <AuthProfile />
      <CssBaseline />
      <AppRoutes />
    </>
  );
};

export default App;
