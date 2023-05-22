import React, { useEffect, useState } from "react";
import axios from "axios";

const Imagen = () => {
  const API_URL = "http://localhost:9090";
  const [imagenes, setImagenes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [productoEditado, setProductoEditado] = useState({
    id: null,
    type: "",
    url: "",
  });

  useEffect(() => {
    getImagenes();
  }, []);

  const getImagenes = () => {
    axios
      .get(`${API_URL}/imagen`)
      .then((response) => {
        setImagenes(response.data);
      })
      .catch((error) => {
        console.log(error);
        // Manejar el error apropiadamente (mostrar mensaje de error, etc.)
      });
  };

  const editarProducto = (id) => {
    const producto = imagenes.find((p) => p.id === id);
    setProductoEditado({
      id: producto.id,
      type: producto.type,
      url: producto.url,
    });
    setModalIsOpen(true);
  };

  const eliminarProducto = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then((response) => {
        getImagenes();
      })
      .catch((error) => {
        console.log(error);
        // Manejar el error apropiadamente (mostrar mensaje de error, etc.)
      });
  };

  return (
    <div>
      <div className="productos-container">
        <div className="productos-title">Lista de Imágenes</div>
        <div className="btn_nuevo">
          <button
            className="nuevo-btn"
            onClick={() => {
              setProductoEditado({
                id: null,
                type: "",
                url: "",
              });
              setModalIsOpen(true);
            }}
          >
            Nuevo
          </button>
        </div>
        <div className="encabezado-list">
          <p className="encabezado-title">Tipo</p>
          <p className="encabezado-title">Imagen</p>
          <p className="encabezado-title">Opciones</p>
        </div>
        <div className="container-List">
          {imagenes.map((imagen) => (
            <div className="productos-list" key={imagen.id}>
              <h1 className="producto-name">{imagen.type}</h1>
              <div>
                <img
                  style={{ width: "4rem" }}
                  src={imagen.url}
                  alt={imagen.type}
                />
              </div>
              <div className="btn-editar-eliminar">
                <button
                  className="editar-btn"
                  onClick={() => editarProducto(imagen.id)}
                >
                  Editar
                </button>
                <button
                  className="eliminar-btn"
                  onClick={() => eliminarProducto(imagen.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Imagen;
