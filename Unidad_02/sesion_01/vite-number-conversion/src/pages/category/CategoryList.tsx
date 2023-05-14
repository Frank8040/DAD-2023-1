import React, { useState, useEffect, useRef } from "react";
import { Category } from "./Category";
import { getCategory } from "./CategoryService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import Table from "../../components/Table";
import { exportToCsv, exportToExcel, exportToPdf } from "./ExportUtils";
import DialogCreateUpdate from "../../components/Dialog";
import { classNames } from "primereact/utils";
import axios from "axios";
import { Dialog } from "primereact/dialog";

const CategoryList = () => {
  const API_URL = "http://localhost:9090/categoria";

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoria, setCategoria] = useState({
    categoriaId: null, // Agrega la propiedad categoriaId con un valor inicial vacío o del tipo adecuado
    categoriaName: "",
    categoriaDescription: "",
  });
  const [deleteCategoriaDialog, setDeleteCategoriaDialog] = useState(false);
  const [selectedCategorias, setSelectedCategorias] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState("");
  const [deleteCategoriasDialog, setDeleteCategoriasDialog] = useState(false);
  const [categoriaDialog, setCategoriaDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const toast = useRef<Toast>(null);
  const dt = useRef<any>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategory();
      setCategories(res.data);
    } catch (error) {
      console.log("Error al cargar las categorías:", error);
      // Manejar el error de alguna manera (mostrar un mensaje de error, etc.)
    }
  };

  const saveUpdate = () => {
    setSubmitted(true);

    if (categoria.categoriaName && categoria.categoriaDescription) {
      if (categoria.categoriaId || isCreating === false) {
        // Actualizar categoria existente
        axios
          .put(API_URL, categoria)
          .then(() => {
            loadCategories();
            setCategoriaDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Éxito",
              detail: "Categoría actualizada",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error al actualizar la categoría:", error);
          });
      } else {
        // Crear nueva categoria
        axios
          .post(API_URL, categoria)
          .then(() => {
            loadCategories();
            setCategoriaDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Éxito",
              detail: "Categoría creada",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error al crear la categoría:", error);
          });
      }
    }
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCategoriaDialog(false);
  };

  const editCategoria = (categoria: any) => {
    setCategoria({ ...categoria });
    setSubmitted(false);
    setCategoriaDialog(true);
    setModalTitle("Editar categoría");
    setIsCreating(false);
  };

  const confirmDeleteCategoria = (categoria: any) => {
    setCategoria(categoria);
    setDeleteCategoriaDialog(true);
  };

  const confirmDeleteSelected = () => {
    setDeleteCategoriasDialog(true);
  };

  const openNew = () => {
    setCategoria(categoria);
    setSubmitted(false);
    setCategoriaDialog(true);
    setModalTitle("Crear Categoria");
    setIsCreating(true);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedCategorias || selectedCategorias.length === 0}
        />
      </div>
    );
  };

  const handleExportToPdf = () => {
    exportToPdf(categories);
  };

  const handleExportToExcel = () => {
    exportToExcel(categories);
  };

  const handleExportToCsv = () => {
    exportToCsv(categories);
  };
  const rightToolbarTemplate = () => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button
          label="CSV"
          type="button"
          icon="pi pi-file"
          rounded
          onClick={handleExportToCsv}
          data-pr-tooltip="CSV"
        />
        <Button
          label="XLSX"
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          rounded
          onClick={handleExportToExcel}
          data-pr-tooltip="XLS"
        />
        <Button
          label="PDF"
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          rounded
          onClick={handleExportToPdf}
          data-pr-tooltip="PDF"
        />
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editCategoria(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteCategoria(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Administrar Categorías</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter((e.target as HTMLInputElement).value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  const categoriaDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
      />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUpdate} />
    </React.Fragment>
  );

  const hideDeleteCategoriaDialog = () => {
    setDeleteCategoriaDialog(false);
  };

  const hideDeleteCategoriasDialog = () => {
    setDeleteCategoriasDialog(false);
  };

  const deleteCategoria = () => {
    // Aquí se hace la petición a la API para eliminar el categoria
    axios
      .delete(`${API_URL}/${categoria.categoriaId}`)
      .then(() => {
        loadCategories();
      })
      .catch((error) => {
        console.log(error);
      });
    setDeleteCategoriaDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Categoría Eliminado",
      life: 3000,
    });
  };

  const deleteSelectedCategorias = () => {
    selectedCategorias.forEach((categoria) => {
      axios
        .delete(`${API_URL}/${categoria.categoriaId}`)
        .then(() => {
          // Eliminar el categoria de la lista actual
          setCategories((prevCategorias) =>
            prevCategorias.filter(
              (c) => c.categoriaId !== categoria.categoriaId
            )
          );
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: `Categoría ${categoria.categoriaId} eliminado`,
            life: 3000,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
    setDeleteCategoriasDialog(false);
    setSelectedCategorias(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Categoría Eliminado",
      life: 3000,
    });
  };

  const onInputChange = (e: any, name: any) => {
    const val = (e.target && e.target.value) || "";
    const _categoria = { ...categories };

    _categoria[`${name}`] = val;

    setCategories(_categoria);
  };

  const deleteCategoriaDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteCategoriaDialog}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteCategoria}
      />
    </React.Fragment>
  );
  const deleteCategoriasDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteCategoriasDialog}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedCategorias}
      />
    </React.Fragment>
  );

  return (
    <div>
      <Table
        reftoast={toast}
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
        refdt={dt}
        values={categories}
        selection={selectedCategorias}
        onSelectionChange={(e) => setSelectedCategorias(e.value)} //error normal
        dataKey="categoriaId"
        globalFilter={globalFilter}
        header={header}
        field_01="categoriaName"
        header_01="Nombre"
        field_02="categoriaDescription"
        header_02="Descripción"
        body={actionBodyTemplate}
      />
      <DialogCreateUpdate
        visible={categoriaDialog}
        header={modalTitle}
        footer={categoriaDialogFooter}
        onHide={hideDeleteCategoriaDialog}
        htmlFor_01="categoriaName"
        label_01="Nombre"
        id_01="categoriaName"
        value_01={categoria.categoriaName}
        onChange_01={(e) => onInputChange(e, "categoriaName")}
        className_01={classNames({
          "p-invalid": submitted && !categoria.categoriaName,
        })}
        msgRequired_01={
          submitted &&
          !categoria.categoriaName && (
            <small className="p-error">El nombre es obligatorio.</small>
          )
        }
        htmlFor_02="categoriaDescription"
        label_02="Descripción"
        id_02="categoriaDescription"
        value_02={categoria.categoriaDescription}
        onChange_02={(e) => onInputChange(e, "categoriaDescription")}
        className_02={classNames({
          "p-invalid": submitted && !categoria.categoriaDescription,
        })}
        msgRequired_02={
          submitted &&
          !categoria.categoriaDescription && (
            <small className="p-error">La descripción es obligatorio.</small>
          )
        }
      />
      <Dialog
        visible={deleteCategoriaDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmar"
        modal
        footer={deleteCategoriaDialogFooter}
        onHide={hideDeleteCategoriaDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {categoria && (
            <span>
              Are you sure you want to delete <b>{categoria.categoriaName}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={deleteCategoriasDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmar"
        modal
        footer={deleteCategoriasDialogFooter}
        onHide={hideDeleteCategoriasDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {categoria && (
            <span>
              Are you sure you want to delete the selected categories?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default CategoryList;
