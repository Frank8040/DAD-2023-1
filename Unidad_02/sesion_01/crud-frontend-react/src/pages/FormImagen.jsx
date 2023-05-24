import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  createContext,
} from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";

const ModalContext = createContext();

const useFormulario = () => {
  const [formulario, setFormulario] = useState({
    type: "",
    file: null,
    preview: null, // Vista previa de la imagen
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const preview = URL.createObjectURL(file); // Crear la URL de la vista previa
    setFormulario({ ...formulario, file, preview });
  };

  return { formulario, handleChange, handleFileChange };
};

const Formulario = () => {
  const { formulario, handleChange, handleFileChange } = useFormulario();
  const modalContext = useContext(ModalContext);

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

    modalContext.setShowDialog(false);
  };

  const renderFileUpload = () => {
    const fileInputRef = React.createRef();

    const handleClick = () => {
      fileInputRef.current.click();
    };

    return (
      <div className="p-field">
        <label htmlFor="file">Archivo:</label>
        <div className="p-inputgroup">
          <input
            ref={fileInputRef}
            type="file"
            className="p-inputtext"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            type="button"
            icon="pi pi-upload"
            label="Seleccionar"
            onClick={handleClick}
          />
          <InputText
            readOnly
            value={formulario.file ? formulario.file.name : ""}
            placeholder="Seleccionar archivo"
          />
        </div>
        {formulario.preview && (
          <img
            src={formulario.preview}
            alt="Vista previa"
            style={{ marginTop: "10px", maxWidth: "200px" }}
          />
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-field">
        <label htmlFor="type">Tipo:</label>
        <InputText
          id="type"
          name="type"
          value={formulario.type}
          onChange={handleChange}
        />
      </div>
      {renderFileUpload()}
      <Button type="submit" label={"Enviar"} />
    </form>
  );
};

const Listado = () => {
  const [datos, setDatos] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

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

  const actualizarDato = (id, newData) => {
    axios
      .put(`http://localhost:9090/imagen/${id}`, newData)
      .then((response) => {
        console.log(response.data);
        // Realizar cualquier acción adicional después de la actualización exitosa
      })
      .catch((error) => {
        console.error(error);
        // Manejar errores de la solicitud
      });
  };

  const editarDato = (id, newData) => {
    console.log(`Editar dato con ID ${id}`);
    actualizarDato(id, newData);
    // Implementa la lógica adicional para editar el dato con el ID proporcionado
  };

  const confirmDeleteProduct = (id) => {
    setSelectedProducts([{ id }]);
    setDeleteProductDialog(true);
  };

  const deleteSelectedImage = () => {
    if (selectedProducts && selectedProducts.length > 0) {
      const imageToDelete = selectedProducts[0]; // Obtener el primer producto seleccionado

      axios
        .delete(`http://localhost:9090/imagen/${imageToDelete.id}`)
        .then(() => {
          // Eliminar la imagen de la lista actual
          setDatos((prevDatos) =>
            prevDatos.filter((dato) => dato.id !== imageToDelete.id)
          );
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `Imagen ${imageToDelete.id} eliminada`,
            life: 3000,
          });
          setDeleteProductDialog(false);
          setSelectedProducts([]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteSelectedImages = () => {
    selectedProducts.forEach((imagen) => {
      axios
        .delete(`http://localhost:9090/imagen/${imagen.id}`)
        .then(() => {
          // Eliminar la imagen de la lista actual
          setDatos((prevDatos) =>
            prevDatos.filter((dato) => dato.id !== imagen.id)
          );
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `Imagen ${imagen.id} eliminada`,
            life: 3000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
    setDeleteProductsDialog(false);
    setSelectedProducts([]);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Imágenes eliminadas",
      life: 3000,
    });
  };

  const openDialog = () => {
    setShowDialog(true);
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Administrar Imágenes</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          severity="success"
          onClick={openDialog}
        />
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          severity="danger"
          disabled={!selectedProducts.length}
          onClick={() => setDeleteProductsDialog(true)}
        />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button
          label="CSV"
          type="button"
          icon="pi pi-file"
          rounded
          data-pr-tooltip="CSV"
        />
        <Button
          label="XLSX"
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          rounded
          data-pr-tooltip="XLS"
        />
        <Button
          label="PDF"
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          rounded
          data-pr-tooltip="PDF"
        />
      </div>
    );
  };

  const hideDialog = () => {
    setShowDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editarDato(rowData.id)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData.id)}
        />
      </React.Fragment>
    );
  };

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedImage}
      />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedImages}
      />
    </React.Fragment>
  );

  return (
    <div>
      <ModalContext.Provider value={{ showDialog, setShowDialog }}>
        <Dialog visible={showDialog} header="Crear Dato" onHide={hideDialog}>
          <Formulario />
        </Dialog>
      </ModalContext.Provider>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />
        <DataTable
          ref={dt}
          value={datos}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id"
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} imágenes"
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No se encontraron resultados"
        >
          <Column selectionMode="multiple" exportable={false} />
          <Column field="id" header="ID" />
          <Column field="type" header="Tipo" />
          <Column
            header="Imagen"
            body={(rowData) => (
              <img
                src={rowData.url}
                alt={rowData.type}
                className="shadow-2 border-round"
                style={{ width: "64px" }}
              />
            )}
          />
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          />
        </DataTable>
      </div>
      <Dialog
        visible={deleteProductDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmar"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />

          <span>¿Estás seguro de que quieres eliminar?</span>
        </div>
      </Dialog>
      <Dialog
        visible={deleteProductsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmar"
        modal
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span>
            ¿Estás seguro de que quieres eliminar las imágenes seleccionadas?
          </span>
        </div>
      </Dialog>
    </div>
  );
};

const App = () => {
  return (
    <div>
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
