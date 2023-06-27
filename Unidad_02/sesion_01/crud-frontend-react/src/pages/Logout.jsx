import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const LogoutUser = ({ onLogout }) => {
  const navigate = useNavigate();

  const logout = () => {
    const token = localStorage.getItem("token");
    axios
      .post("http://localhost:9090/auth/logout", null, {
        params: {
          token: token,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 204) {
          const token = response.data.token;
          console.log("Guardado exitoso");
          console.log("token", token);
          localStorage.setItem("token", token);
          navigate("/home");
          onLogout();
        } else {
          console.error("Error al cerrar sesión");
        }
      })
      .catch((error) => {
        console.error(
          "Error al realizar la solicitud de cierre de sesión",
          error
        );
      });
  };

  return <button onClick={logout}>Logout</button>;
};
