// src/AppRoutes.tsx
import { Route, Routes } from "react-router-dom";
import InvoicePage from "./pages/InvoicePage";
import NotFoundPage from "./pages/NotFoundPage";
import ServiceAdmin from "./pages/ServiceAdmin";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<InvoicePage />} />
      {/* <Route path="/customers/new" element={<CustomerPage />} /> */}
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/service-admin" element={<ServiceAdmin />} />
    </Routes>
  );
};

export default AppRoutes;
