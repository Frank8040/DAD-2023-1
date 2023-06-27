import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginUser from "./pages/Login";
import { ClientNavbar } from "./components/NavBar";
import Inicio from "./pages/client/Inicio";
import Nosotros from "./pages/client/Nosotros";
import Producto from "./pages/client/Producto";
import Admin from "./pages/client/Admin";
import { LogoutUser } from "./pages/Logout";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <ClientNavbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route path="/home" element={<Inicio />} />
        <Route path="/ous" element={<Nosotros />} />
        <Route path="/product" element={<Producto />} />
        {isAuthenticated && (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route
              path="/logout"
              element={<LogoutUser onLogout={handleLogout} />}
            />
          </>
        )}
        <Route path="/login" element={<LoginUser onLogin={handleLogin} />} />

        <Route path="/" element={<Navigate to="/home" />} />
      </Routes>
    </Router>
  );
};

export default App;
