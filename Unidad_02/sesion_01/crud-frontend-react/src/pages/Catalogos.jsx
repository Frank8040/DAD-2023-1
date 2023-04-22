import axios from "axios";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";

import Modal from 'react-modal';

const Catalogos = () => {
  const API_URL = "http://localhost:8181";
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoEditado, setProductoEditado] = useState({
    id: null,
    nombre: "",
  });

  const getProductos = () => {
    axios
      .get(`${API_URL}/producto`)
      .then((response) => {
        // handle success
        setProductos(response.data);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  const editarProducto = (id) => {
    const producto = productos.find((p) => p.id === id);
    setProductoEditado({
      id: producto.id,
      nombre: producto.nombre,
    });
    setModalIsOpen(true)
  }

  const crearProducto = (event) => {
    event.preventDefault();
    if (!productoEditado.nombre.trim()) {
      return; // do nothing if input is empty or only whitespace
    }
    axios
      .post(`${API_URL}/producto`, productoEditado)
      .then((response) => {
        setProductoEditado({
          id: null,
          nombre: "",
        });
        getProductos();
        setModalIsOpen(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const actualizarProducto = (event) => {
    event.preventDefault();
    axios
      .put(`${API_URL}/producto`, productoEditado)
      .then((response) => {
        setProductoEditado({
          id: null,
          nombre: "",
        });
        getProductos();
        setModalIsOpen(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const eliminarProducto = (id) => {
    axios
      .delete(`${API_URL}/producto/${id}`)
      .then((response) => {
        getProductos();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getProductos();
  }, []);

  const contenidoModal = (
    <div className="form-container">
      <h2 className="form-title">{productoEditado.id ? 'Editar Producto' : 'Crear Producto'}</h2>
      <Button className="cerrar-modal" onClick={() => setModalIsOpen(false)} title="X" />
      <form onSubmit={productoEditado.id ? actualizarProducto : crearProducto}>
        <div className="form-campos">
          <div className="form-input">
            <Label className="label-name" title="Nombre:" />
            <Input
              type="text"
              value={productoEditado.nombre}
              onChange={(event) =>
                setProductoEditado({
                  ...productoEditado,
                  nombre: event.target.value,
                })
              }
              className="input-name"
            />
          </div>
        </div>
        <div className="btn-actualizar-crear">
          {productoEditado.id ? (
            <Button onClick={actualizarProducto} className="actualizar-btn" title="Actualizar" />
          ) : (
            <Button onClick={crearProducto} className="crear-btn" title="Crear Producto" />
          )}
        </div>
      </form>
    </div>
  );

  return (
    <div className="productos-container">
      <div className="productos-title">Lista de Productos</div>
      <div className="btn_nuevo">
        <Button className="nuevo-btn" onClick={() => {
          setProductoEditado({
            id: null,
            nombre: "",
          });
          setModalIsOpen(true);
        }} title="Nuevo" />
      </div>
      <Modal className="modal" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        {contenidoModal}
      </Modal>
      <div className="encabezado-list">
        <p className="encabezado-title" >Nombre</p>
        <p className="encabezado-title" >Opciones</p>
      </div>
      <div className="container-List">
        {productos.map((producto) => (
          <div className="productos-list" key={producto.id}>
            <h1 className="producto-name">{producto.nombre}</h1>
            <div className="btn-editar-eliminar">
              <Button
                className="editar-btn"
                onClick={() => editarProducto(producto.id)}
                title="E"
              />
              <Button
                className="eliminar-btn"
                onClick={() => eliminarProducto(producto.id)}
                title="E"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalogos;
