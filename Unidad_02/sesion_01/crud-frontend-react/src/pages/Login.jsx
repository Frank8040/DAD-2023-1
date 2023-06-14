/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginUser = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [registerMode, setRegisterMode] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9090/auth/login", {
        userName: userName,
        password: password,
      });

      // Procesar la respuesta del backend, por ejemplo, guardar el token en el almacenamiento local
      const token = response.data.token;
      console.log("Guardado exitoso");
      console.log("token",token);

      // Almacenar el token en el almacenamiento local
      localStorage.setItem("token", token);

      // Redirigir a la página principal o hacer alguna otra acción
      navigate("/product");
    } catch (error) {
      console.error(error);
      // Mostrar un mensaje de error o realizar alguna otra acción
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:9090/auth/create", {
        userName: userName,
        password: password,
      });

      // Procesar la respuesta del backend, por ejemplo, mostrar un mensaje de éxito
      console.log("Registro exitoso");
      console.log(response);
      // ...

      // Cambiar al modo de inicio de sesión después del registro
      setRegisterMode(false);
    } catch (error) {
      console.error(error);
      // Mostrar un mensaje de error o realizar alguna otra acción
    }
  };

  return (
    <div>
      <h2>{registerMode ? "Registrarse" : "Iniciar sesión"}</h2>
      <form onSubmit={registerMode ? handleRegister : handleLogin}>
        <div>
          <label>Usuario:</label>
          <input
            type="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">
          {registerMode ? "Registrar" : "Iniciar sesión"}
        </button>
      </form>
      {!registerMode && (
        <p>
          ¿No tienes una cuenta?{" "}
          <a href="#" onClick={() => setRegisterMode(true)}>
            Registrarse
          </a>
        </p>
      )}
    </div>
  );
};

export default LoginUser;
