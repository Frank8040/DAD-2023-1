import React, { useState, useEffect, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import axios from "axios";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";

const Formulario = () => {
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
      <Button type="submit" label="Enviar" />
    </form>
  );
};

const Listado = () => {
  const [datos, setDatos] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(null);
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

  const editarDato = (id) => {
    console.log(`Editar dato con ID ${id}`);
    openDialog();
    // Implementa la lógica adicional para editar el dato con el ID proporcionado
  };

  const confirmDeleteProduct = () => {
    setDeleteProductDialog(true);
  };

  const eliminarDato = (id) => {
    console.log(`Eliminar dato con ID ${id}`);
    setDeleteProductDialog(false);
  };

  const deleteSelectedProducts = () => {
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
    setSelectedProducts(null);
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
          disabled={!selectedProducts || !selectedProducts.length}
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
        onClick={eliminarDato}
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
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Dialog visible={showDialog} header="Crear Dato" onHide={hideDialog}>
        <Formulario />
      </Dialog>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar
          className="mb-4"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        ></Toolbar>
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
          <Column selectionMode="multiple" exportable={false}></Column>
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
          ></Column>
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
