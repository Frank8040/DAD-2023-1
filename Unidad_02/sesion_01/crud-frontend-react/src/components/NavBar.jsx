import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export const ClientNavbar = ({ isAuthenticated }) => {
  return (
    <nav className="navbar navbar-user">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          Logo
        </Link>
        <div className="navbar-links">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/home" className="nav-link">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/ous" className="nav-link">
                Nosotros
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/product" className="nav-link">
                Productos
              </Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">
                    Administrador
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/logout" className="nav-link">
                    Cerrar sesión
                  </Link>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Iniciar sesión
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
