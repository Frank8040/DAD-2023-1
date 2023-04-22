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
  const [categorias, setCategorias] = useState([]);
  const [productoEditado, setProductoEditado] = useState({
    productoId: null,
    productoName: "",
    categoria: {
      categoriaId: "",
    }
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

  const getCategorias = () => {
    axios
      .get(`${API_URL}/categoria`)
      .then((response) => {
        // handle success
        setCategorias(response.data);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  const editarProducto = (id) => {
    const producto = productos.find((p) => p.productoId === id);
    setProductoEditado({
      productoId: producto.productoId,
      productoName: producto.productoName,
      categoria: producto.categoria,
    });
    setModalIsOpen(true)
  }

  const crearProducto = (event) => {
    event.preventDefault();
    if (!productoEditado.productoName.trim() || !productoEditado.categoria.categoriaId.trim()) {
      return; // do nothing if input is empty or only whitespace
    }
    axios
      .post(`${API_URL}/producto`, productoEditado)
      .then((response) => {
        setProductoEditado({
          productoId: null,
          productoName: "",
          categoria: {
            categoriaId: "",
          }
        });
        getProductos();
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
      .put(`${API_URL}/producto`, productoEditado)
      .then((response) => {
        setProductoEditado({
          productoId: null,
          productoName: "",
          categoria: {
            categoriaId: "",
          }
        });
        getProductos();
        getCategorias()
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
        getCategorias()
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getProductos();
    getCategorias()
  }, []);

  const contenidoModal = (
    <div className="form-container">
      <h2 className="form-title">{productoEditado.productoId ? 'Editar Producto' : 'Crear Producto'}</h2>
      <Button className="cerrar-modal" onClick={() => setModalIsOpen(false)} title="X" />
      <form onSubmit={productoEditado.productoId ? actualizarProducto : crearProducto}>
        <div className="form-campos">
          <div className="form-input">
            <Label className="label-name" title="Nombre:" />
            <Input
              type="text"
              value={productoEditado.productoName}
              onChange={(event) =>
                setProductoEditado({
                  ...productoEditado,
                  productoName: event.target.value,
                })
              }
              className="input-name"
            />
          </div>
          <div className="form-select">
            <Label className="label-name" title="Categoría:" />
            <select
              value={productoEditado.categoria.categoriaId}
              onChange={(event) =>
                setProductoEditado({
                  ...productoEditado,
                  categoria: {
                    categoriaId: event.target.value,
                  }
                })
              }
              className="input-name"
            >
              <option value="">Seleccionar ... </option>
              {categorias.map((categoria) => (
                <option key={categoria.categoriaId} value={categoria.categoriaId}>
                  {categoria.categoriaName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="btn-actualizar-crear">
          {productoEditado.productoId ? (
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
            productoId: null,
            productoName: "",
            categoria: {
              categoriaId: "",
            }
          });
          setModalIsOpen(true);
        }} title="Nuevo" />
      </div>
      <Modal className="modal" isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        {contenidoModal}
      </Modal>
      <div className="encabezado-list">
        <p className="encabezado-title" >Nombre</p>
        <p className="encabezado-title" >Categoría</p>
        <p className="encabezado-title" >Opciones</p>
      </div>
      <div className="container-List">
        {productos.map((producto) => (
          <div className="productos-list" key={producto.productoId}>
            <h1 className="producto-name">{producto.productoName}</h1>
            <h1 className="producto-name">{producto.categoria.categoriaName}</h1>
            <div className="btn-editar-eliminar">
              <Button
                className="editar-btn"
                onClick={() => editarProducto(producto.productoId)}
                title="E"
              />
              <Button
                className="eliminar-btn"
                onClick={() => eliminarProducto(producto.productoId)}
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
