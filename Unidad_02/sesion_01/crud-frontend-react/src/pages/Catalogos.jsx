import axios from "axios";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

import Modal from 'react-modal';

const Catalogos = () => {
  const API_URL = "http://localhost:9090";
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productoEditado, setProductoEditado] = useState({
    categoriaId: null,
    categoriaName: "",
    categoriaDescription: "",
  });

  const getCategorias = () => {
    axios
      .get(`${API_URL}/categoria`)
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
    const producto = productos.find((p) => p.categoriaId === id);
    setProductoEditado({
      categoriaId: producto.categoriaId,
      categoriaName: producto.categoriaName,
      categoriaDescription: producto.categoriaDescription,
    });
    setModalIsOpen(true)
  }

  const crearProducto = (event) => {
    event.preventDefault();
    axios
      .post(`${API_URL}/categoria`, productoEditado)
      .then((response) => {
        setProductoEditado({
          categoriaId: null,
          categoriaName: "",
          categoriaDescription: "",
        });
        getCategorias();
        setModalIsOpen(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const actualizarProducto = (event) => {
    event.preventDefault();
    axios
      .put(`${API_URL}/categoria`, productoEditado)
      .then((response) => {
        setProductoEditado({
          categoriaId: null,
          categoriaName: "",
          categoriaDescription: "",
        });
        getCategorias();
        setModalIsOpen(false)
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const eliminarProducto = (id) => {
    axios
      .delete(`${API_URL}/categoria/${id}`)
      .then((response) => {
        getCategorias();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getCategorias();
  }, []);

  const contenidoModal = (
    <div className="form-container">
      <h2 className="form-title">{productoEditado.categoriaId ? 'Editar Producto' : 'Crear Producto'}</h2>
      <Button className="cerrar-modal" onClick={() => setModalIsOpen(false)} title="X" />
      <form onSubmit={productoEditado.categoriaId ? actualizarProducto : crearProducto}>
        <div className="form-campos">
          <div className="form-input">
            <Input
              type="text"
              value={productoEditado.categoriaName}
              onChange={(event) =>
                setProductoEditado({
                  ...productoEditado,
                  categoriaName: event.target.value,
                })
              }
              className="input-name"
            />
            <Input
              type="text"
              value={productoEditado.categoriaDescription}
              onChange={(event) =>
                setProductoEditado({
                  ...productoEditado,
                  categoriaDescription: event.target.value,
                })
              }
              className="input-name"
            />
          </div>
        </div>
        <div className="btn-actualizar-crear">
          {productoEditado.categoriaId ? (
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
      <div className="productos-title">Lista de Categorías</div>
      <div className="btn_nuevo">
        <Button className="nuevo-btn" onClick={() => {
          setProductoEditado({
            categoriaId: null,
            categoriaName: "",
            categoriaDescription: "",
          });
          setModalIsOpen(true);
        }} title="Nuevo" />
      </div>
      <Modal className="modal" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        {contenidoModal}
      </Modal>
      <div className="encabezado-list">
        <p className="encabezado-title" >Nombre</p>
        <p className="encabezado-title" >Descripción</p>
        <p className="encabezado-title" >Opciones</p>
      </div>
      <div className="container-List">
        {productos.map((categoria) => (
          <div className="productos-list" key={categoria.categoriaId}>
            <h1 className="producto-name">{categoria.categoriaName}</h1>
            <h1 className="producto-name">{categoria.categoriaDescription}</h1>
            <div className="btn-editar-eliminar">
              <Button
                className="editar-btn"
                onClick={() => editarProducto(categoria.categoriaId)}
                title="E"
              />
              <Button
                className="eliminar-btn"
                onClick={() => eliminarProducto(categoria.categoriaId)}
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
