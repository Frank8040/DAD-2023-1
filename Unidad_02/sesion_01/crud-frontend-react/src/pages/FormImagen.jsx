import React, { useState, useEffect } from "react";
import axios from "axios";

const Formulario = () => {
  const [formulario, setFormulario] = useState({
    type: "",
    file: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario({ ...formulario, [name]: value });
  };
  

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormulario({ ...formulario, file });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("type", formulario.type);
    formData.append("file", formulario.file);

    axios
      .post("http://localhost:9090/imagen", formData)
      .then((response) => {
        console.log(response.data);
        // Realizar cualquier acción adicional después del envío exitoso
      })
      .catch((error) => {
        console.error(error);
        // Manejar errores de la solicitud
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Type:</label>
        <input
          type="text"
          name="type"
          value={formulario.type}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>file:</label>
        <input type="file" name="file" onChange={handleFileChange} />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

const Listado = () => {
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = () => {
    axios
      .get("http://localhost:9090/imagen")
      .then((response) => {
        setDatos(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const editarDato = (id) => {
    console.log(`Editar dato con ID ${id}`);
    // Implementa la lógica para editar el dato con el ID proporcionado
  };

  const eliminarDato = (id) => {
    console.log(`Eliminar dato con ID ${id}`);
    // Implementa la lógica para eliminar el dato con el ID proporcionado
    axios.delete(`http://localhost:9090/imagen/${id}`)
      .then((response) => {
        console.log(response.data);
        // Realizar cualquier acción adicional después de eliminar el dato exitosamente
        obtenerDatos(); // Actualizar el listado después de eliminar el dato
      })
      .catch((error) => {
        console.error(error);
        // Manejar errores de la solicitud
      });
  };

  return (
    <div>
      <h2>Listado</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipo</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((dato) => (
            <tr key={dato.id}>
              <td>{dato.id}</td>
              <td>{dato.type}</td>
              <td>
                {" "}
                <img
                  src={dato.url}
                  alt={dato.type}
                  className="shadow-2 border-round"
                  style={{ width: "64px" }}
                />
              </td>
              <td>
                <button onClick={() => editarDato(dato.id)}>Editar</button>
                <button onClick={() => eliminarDato(dato.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>
    </div>
  );
};



const App = () => {
  return (
    <div>
      <Formulario />
      <Listado />
    </div>
  );
};

export default App;

/*import React from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from "primereact/fileupload";

export const DialogCreateUpdate = (props) => {
  const { visible, header, footer, onHide, htmlFor_01, label_01, id_01, value_01, onChange_01, className_01, msgRequired_01, isCategory, id, name, mode, className, chooseLabel, uploadLabel, cancelLabel, uploadHandler, htmlForImage } = props;

  const inputs = [{
    input: htmlFor_01, label: label_01, id: id_01, value: value_01, onChange: onChange_01, autoFocus: 'autoFocus', className: className_01, msgRequired: msgRequired_01
  }
  ];

  return (
    <Dialog
      visible={visible}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={header}
      modal
      className="p-fluid"
      footer={footer}
      onHide={onHide}
    >
      {!isCategory && (
        <div className="p-col-12">
          <label htmlFor={htmlForImage}>Imagen</label>
          <FileUpload
            id={id}
            name={name}
            mode={mode}
            className={className}
            chooseLabel={chooseLabel}
            uploadLabel={uploadLabel}
            cancelLabel={cancelLabel}
            customUpload
            accept="url/*"
            uploadHandler={uploadHandler}
          />
        </div>
      )}
      {inputs.map((input, index) => (
        <div key={index} className="field">
          <label htmlFor={input.htmlFor} className="font-bold">
            {input.label}
          </label>
          <InputText
            id={input.id}
            value={input.value}
            onChange={input.onChange}
            required
            autoFocus={input.autoFocus}
            className={input.className}
          />
          {input.msgRequired}
        </div>
      ))}
    </Dialog>
  );
};

export const DialogDelete = (props) => {
  const { visible, footer, onHide, msgDialogModal } = props;
  return (
    <Dialog visible={visible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={footer} onHide={onHide}>
      <div className="confirmation-content">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
        {msgDialogModal}
      </div>
    </Dialog>
  )
}*/
