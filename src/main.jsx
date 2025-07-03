import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/Login";
import ClientsList from "./components/client/ClientsList";
import ClientRegister from "./components/client/ClientRegister";
import UsersList from "./components/user/UsersList";
import UserRegister from "./components/user/UserRegister";
import MaterialsList from "./components/material/MaterialsList";
import MaterialRegister from "./components/material/MaterialRegister";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import SideMenu from "./components/shared/menu/SideMenu";
import "./components/shared/menu/SideMenu.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div style={{ display: "flex", minHeight: "100vh" }}>
                <SideMenu />
                <div style={{ flex: 1, marginLeft: 210 }}>
                  <Routes>                    <Route path="/clientes" element={<ClientsList />} />
                    <Route path="/cadastro-cliente" element={<ClientRegister />} />
                    <Route path="/editar-cliente/:id" element={<ClientRegister />} />
                    <Route path="/usuarios" element={<UsersList />} />
                    <Route path="/register-user" element={<UserRegister />} />
                    <Route path="/editar-usuario/:id" element={<UserRegister />} />
                    <Route path="/materiais" element={<MaterialsList />} />
                    <Route path="/cadastrar-material" element={<MaterialRegister />} />
                    <Route path="/editar-material/:id" element={<MaterialRegister />} />
                    {/* Redireciona qualquer rota desconhecida para a listagem */}
                    <Route path="*" element={<Navigate to="/clientes" />} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
