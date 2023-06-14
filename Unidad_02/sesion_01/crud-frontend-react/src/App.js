import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginUser from "./pages/Login";
import Product from "./pages/Producto";

//IMPORTACIONES DE AUTH
import * as AuthService from "./services/auth.service";
import Category from "./pages/Categoria";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logout = () => {
    AuthService.logout();
  };

  return (
    <>
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to="/" className="navbar-brand">
              FrankyDJ
            </Link>
            <div>
              <li>
                <Link to="/home">Home</Link>
              </li>
              {showModeratorBoard && (
                <li>
                  <Link to="/mod">Moderador</Link>
                </li>
              )}
              {showAdminBoard && (
                <li>
                  <Link to="/admin">Administrador</Link>
                </li>
              )}
              {currentUser === true && (
                <li>
                  <Link to="/user">Usuario</Link>
                </li>
              )}
            </div>
            {currentUser ? (
              <li>
                <Link to="/user">Usuario</Link>
              </li>
            ) : (
              <div></div>
            )}
          </nav>
        </div>
        <Routes>
          <Route path="/login" element={<LoginUser />} />
          <Route path="/product" element={<Category />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
      {/** 
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginUser />} />
        <Route path="/product" element={<Product />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
    */}
    </>
  );
};

export default App;
