import React, { useState, useEffect, useRef } from 'react';

// Importaciones de PrimeReact
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'jspdf-autotable';
import Table from '../components/Table';
import { DialogCreateUpdate, DialogDelete } from '../components/Dialog';
import { createCategory, deleteCategory, deleteSelectedCategories, getCategoryList, updateCategory } from '../services/CategoryService';
import { exportToExcel, exportToPdf } from '../export/ExportsUtils';

export default function Category() {

  let datosCategoria = {
    categoriaId: null,
    categoriaName: "",
    categoriaDescription: "",
  };

  const [categorias, setCategorias] = useState([]);
  const [categoriaDialog, setCategoriaDialog] = useState(false);
  const [deleteCategoriaDialog, setDeleteCategoriaDialog] = useState(false);
  const [deleteCategoriasDialog, setDeleteCategoriasDialog] = useState(false);
  const [categoria, setCategoria] = useState(datosCategoria);
  const [selectedCategorias, setSelectedCategorias] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    getCategoryList()
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveUpdate = () => {
    setSubmitted(true);

    if (categoria.categoriaName && categoria.categoriaDescription) {
      if (categoria.categoriaId || isCreating === false) {
        updateCategory(categoria)
          .then(() => {
            getCategories();
            setCategoriaDialog(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizado', life: 3000 });
          })
          .catch((error) => {
            console.error('Error al actualizar el categoria:', error);
          });
      } else {
        createCategory(categoria)
          .then(() => {
            getCategories();
            setCategoriaDialog(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría creado', life: 3000 });
          })
          .catch((error) => {
            console.error('Error al crear el categoría', error)
            console.log('Error al crear el categoría:', error);
          });
      }
    }
  };

  const deleteCategoria = () => {
    deleteCategory(categoria.categoriaId)
      .then(() => {
        getCategories();
      })
      .catch((error) => {
        console.log(error);
      });
    setDeleteCategoriaDialog(false);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Categoría Eliminado', life: 3000 });
  };

  const deleteSelectedCategorias = () => {
    const categoriaIds = selectedCategorias.map((categoria) => categoria.categoriaId);
    deleteSelectedCategories(categoriaIds)
      .then(() => {
        setCategorias((prevCategorias) => prevCategorias.filter((c) => !categoriaIds.includes(c.categoriaId)));
        setSelectedCategorias(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Categorías Eliminadas', life: 3000 });
      })
      .catch((error) => {
        console.error('Error al eliminar las categorías:', error);
      });
    setDeleteCategoriasDialog(false);
    getCategories();
  };

  const openNew = () => {
    setCategoria(datosCategoria);
    setSubmitted(false);
    setCategoriaDialog(true);
    setModalTitle("Crear Categoria");
    setIsCreating(true);
  };

  const editCategoria = (categoria) => {
    setCategoria({ ...categoria });
    setSubmitted(false);
    setCategoriaDialog(true);
    setModalTitle("Editar categoria");
    setIsCreating(false);
  };

  const confirmDeleteCategoria = (categoria) => {
    setCategoria(categoria);
    setDeleteCategoriaDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCategoriaDialog(false);
  };

  const hideDeleteCategoriaDialog = () => {
    setDeleteCategoriaDialog(false);
  };

  const hideDeleteCategoriasDialog = () => {
    setDeleteCategoriasDialog(false);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const exportExcel = () => {
    exportToExcel(categorias);
  };

  const exportPDF = () => {
    exportToPdf(categorias);
  };

  const confirmDeleteSelected = () => {
    setDeleteCategoriasDialog(true);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _categoria = { ...categoria };

    _categoria[`${name}`] = val;

    setCategoria(_categoria);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected}
          disabled={!selectedCategorias || !selectedCategorias.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button label='CSV' type="button" icon="pi pi-file" rounded onClick={exportCSV} data-pr-tooltip="CSV" />
        <Button label='XLSX' type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel}
          data-pr-tooltip="XLS" />
        <Button label='PDF' type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPDF}
          data-pr-tooltip="PDF" />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCategoria(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCategoria(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Administrar Categorías</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );
  const categoriaDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUpdate} />
    </React.Fragment>
  );
  const deleteCategoriaDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCategoriaDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteCategoria} />
    </React.Fragment>
  );
  const deleteCategoriasDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteCategoriasDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteSelectedCategorias} />
    </React.Fragment>
  );

  return (
    <div>
      {/** TABLA de la categoría */}
      <Table refToast={toast} left={leftToolbarTemplate} right={rightToolbarTemplate} refDT={dt} value={categorias}
        selection={selectedCategorias} onSelectionChange={(e) => setSelectedCategorias(e.value)} dataKey="categoriaId"
        globalFilter={globalFilter} header={header} nombre_01="categoriaName" header_01="Nombre"
        nombre_02="categoriaDescription" header_02="Descripción" body={actionBodyTemplate} />
      {/** Modal de CREAR y ACTUALIZAR */}
      <DialogCreateUpdate visible={categoriaDialog} header={modalTitle} footer={categoriaDialogFooter}
        onHide={hideDialog} htmlFor_01="categoriaName" label_01="Nombre" id_01="categoriaName"
        value_01={categoria.categoriaName} onChange_01={(e) => onInputChange(e, 'categoriaName')}
        className_01={classNames({ 'p-invalid': submitted && !categoria.categoriaName })} msgRequired_01={submitted
          && !categoria.categoriaName && <small className="p-error">El nombre es obligatorio.</small>}
        htmlFor_02="categoriaDescription" label_02="Descripción" id_02="categoriaDescription"
        value_02={categoria.categoriaDescription} onChange_02={(e) => onInputChange(e, 'categoriaDescription')}
        className_02={classNames({ 'p-invalid': submitted && !categoria.categoriaDescription })}
        msgRequired_02={submitted && !categoria.categoriaDescription && <small className="p-error">La descripción es
          obligatorio.</small>} />
      {/** Modal de ELIMINAR una categoría */}
      <DialogDelete visible={deleteCategoriaDialog} footer={deleteCategoriaDialogFooter}
        onHide={hideDeleteCategoriaDialog} msgDialogModal={categoria && (<span>
          Are you sure you want to delete <b>{categoria.nombre}</b>?
        </span>
        )} />
      {/** Modal de ELIMINAR varias categorias */}
      <DialogDelete visible={deleteCategoriasDialog} footer={deleteCategoriasDialogFooter}
        onHide={hideDeleteCategoriasDialog} msgDialogModal={categoria && <span>Are you sure you want to
          delete the selected categories?</span>} />
    </div>
  );
}
