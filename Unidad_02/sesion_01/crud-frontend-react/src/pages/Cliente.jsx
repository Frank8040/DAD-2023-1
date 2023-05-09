import axios from "axios";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

import Modal from "react-modal";

const Cliente = () => {
  const API_URL = "http://localhost:9090";
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clientes, setClientes] = useState([]);
  const [clienteEditado, setClienteEditado] = useState({
    id: null,
    nombre: "",
    dni: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
  });

  const getClientes = () => {
    axios
      .get(`${API_URL}/cliente`)
      .then((response) => {
        // handle success
        setClientes(response.data);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  const editarCliente = (id) => {
    const cliente = clientes.find((p) => p.id === id);
    setClienteEditado({
      id: cliente.id,
      nombre: cliente.nombre,
      apellidoMaterno: cliente.apellidoMaterno,
      apellidoPaterno: cliente.apellidoPaterno,
      dni: cliente.dni,
    });
    setModalIsOpen(true);
  };

  const crearCliente = (event) => {
    event.preventDefault();
    if (!clienteEditado.nombre.trim()) {
      return; // do nothing if input is empty or only whitespace
    }
    axios
      .post(`${API_URL}/cliente`, clienteEditado)
      .then((response) => {
        setClienteEditado({
          id: null,
          nombre: "",
          dni: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
        });
        getClientes();
        setModalIsOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const actualizarCliente = (event) => {
    event.preventDefault();
    axios
      .put(`${API_URL}/cliente`, clienteEditado)
      .then((response) => {
        setClienteEditado({
          id: null,
          nombre: "",
          dni: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
        });
        getClientes();
        setModalIsOpen(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const eliminarCliente = (id) => {
    axios
      .delete(`${API_URL}/cliente/${id}`)
      .then((response) => {
        getClientes();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getClientes();
  }, []);

  const contenidoModal = (
    <div className="form-container">
      <h2 className="form-title">
        {clienteEditado.id ? "Editar Cliente" : "Crear Cliente"}
      </h2>
      <Button
        className="cerrar-modal"
        onClick={() => setModalIsOpen(false)}
        title="X"
      />
      <form onSubmit={clienteEditado.id ? actualizarCliente : crearCliente}>
        <div className="form-campos">
          <div className="form-input">
            <Input
              title="Nombre:"
              type="text"
              value={clienteEditado.nombre}
              onChange={(event) =>
                setClienteEditado({
                  ...clienteEditado,
                  nombre: event.target.value,
                })
              }
              className="input-name"
            />
            <Input
              title="Apellido Paterno:"
              type="text"
              value={clienteEditado.apellidoPaterno}
              onChange={(event) =>
                setClienteEditado({
                  ...clienteEditado,
                  apellidoPaterno: event.target.value,
                })
              }
              className="input-name"
            />
            <Input
              title="Apellido Materno:"
              type="text"
              value={clienteEditado.apellidoMaterno}
              onChange={(event) =>
                setClienteEditado({
                  ...clienteEditado,
                  apellidoMaterno: event.target.value,
                })
              }
              className="input-name"
            />
            <Input
              title="DNI:"
              type="text"
              value={clienteEditado.dni}
              onChange={(event) =>
                setClienteEditado({
                  ...clienteEditado,
                  dni: event.target.value,
                })
              }
              className="input-name"
            />
          </div>
        </div>
        <div className="btn-actualizar-crear">
          {clienteEditado.id ? (
            <Button
              onClick={actualizarCliente}
              className="actualizar-btn"
              title="Actualizar"
            />
          ) : (
            <Button
              onClick={crearCliente}
              className="crear-btn"
              title="Crear Cliente"
            />
          )}
        </div>
      </form>
    </div>
  );

  return (
    <div className="productos-container">
      <div className="productos-title">Lista de Clientes</div>
      <div className="btn_nuevo">
        <Button
          className="nuevo-btn"
          onClick={() => {
            setClienteEditado({
              id: null,
              nombre: "",
              apellidoMaterno: "",
              apellidoPaterno: "",
              dni: "",
            });
            setModalIsOpen(true);
          }}
          title="Nuevo"
        />
      </div>
      <Modal
        className="modal"
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
      >
        {contenidoModal}
      </Modal>
      <div className="encabezado-list">
        <p className="encabezado-title">Nombres</p>
        <p className="encabezado-title">Apellido Paterno</p>
        <p className="encabezado-title">Apellido Materno</p>
        <p className="encabezado-title">DNI</p>
        <p className="encabezado-title">Opciones</p>
      </div>
      <div className="container-List">
        {clientes.map((cliente) => (
          <div className="productos-list" key={cliente.id}>
            <h1 className="producto-name">{cliente.nombre}</h1>
            <h1 className="producto-name">{cliente.apellidoPaterno}</h1>
            <h1 className="producto-name">{cliente.apellidoMaterno}</h1>
            <h1 className="producto-name">{cliente.dni}</h1>
            <div className="btn-editar-eliminar">
              <Button
                className="editar-btn"
                onClick={() => editarCliente(cliente.id)}
                title="E"
              />
              <Button
                className="eliminar-btn"
                onClick={() => eliminarCliente(cliente.id)}
                title="E"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cliente;
