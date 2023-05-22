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

export default function Image() {

  let dataImage = {
    id: null,
    type: "",
    url: "",
  };

  const [categorias, setImages] = useState([]);
  const [imageDialog, setImageDialog] = useState(false);
  const [deleteImageDialog, setDeleteImageDialog] = useState(false);
  const [deleteImagesDialog, setDeleteImagesDialog] = useState(false);
  const [categoria, setImage] = useState(dataImage);
  const [selectedImages, setSelectedImages] = useState(null);
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
        setImages(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const saveUpdate = () => {
    setSubmitted(true);

    if (categoria.type && categoria.url) {
      if (categoria.id || isCreating === false) {
        updateCategory(categoria)
          .then(() => {
            getCategories();
            setImageDialog(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría actualizado', life: 3000 });
          })
          .catch((error) => {
            console.error('Error al actualizar el categoria:', error);
          });
      } else {
        createCategory(categoria)
          .then(() => {
            getCategories();
            setImageDialog(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Categoría creado', life: 3000 });
          })
          .catch((error) => {
            console.error('Error al crear el categoría', error)
            console.log('Error al crear el categoría:', error);
          });
      }
    }
  };

  const deleteImage = () => {
    deleteCategory(categoria.id)
      .then(() => {
        getCategories();
      })
      .catch((error) => {
        console.log(error);
      });
    setDeleteImageDialog(false);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Categoría Eliminado', life: 3000 });
  };

  const deleteSelectedImages = () => {
    const ids = selectedImages.map((categoria) => categoria.id);
    deleteSelectedCategories(ids)
      .then(() => {
        setImages((prevCategorias) => prevCategorias.filter((c) => !ids.includes(c.id)));
        setSelectedImages(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Categorías Eliminadas', life: 3000 });
      })
      .catch((error) => {
        console.error('Error al eliminar las categorías:', error);
      });
    setDeleteImagesDialog(false);
    getCategories();
  };

  const openNew = () => {
    setImage(dataImage);
    setSubmitted(false);
    setImageDialog(true);
    setModalTitle("Crear Categoria");
    setIsCreating(true);
  };

  const editImage = (categoria) => {
    setImage({ ...categoria });
    setSubmitted(false);
    setImageDialog(true);
    setModalTitle("Editar categoria");
    setIsCreating(false);
  };

  const confirmDeleteImage = (categoria) => {
    setImage(categoria);
    setDeleteImageDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setImageDialog(false);
  };

  const hideDeleteImageDialog = () => {
    setDeleteImageDialog(false);
  };

  const hideDeleteImagesDialog = () => {
    setDeleteImagesDialog(false);
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
    setDeleteImagesDialog(true);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _categoria = { ...categoria };

    _categoria[`${name}`] = val;

    setImage(_categoria);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected}
          disabled={!selectedImages || !selectedImages.length} />
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
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editImage(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteImage(rowData)} />
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
  const imageDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUpdate} />
    </React.Fragment>
  );
  const deleteImageDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteImageDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteImage} />
    </React.Fragment>
  );
  const deleteImagesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteImagesDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteSelectedImages} />
    </React.Fragment>
  );

  return (
    <div>
      {/** TABLA de la categoría */}
      <Table refToast={toast} left={leftToolbarTemplate} right={rightToolbarTemplate} refDT={dt} value={categorias}
        selection={selectedImages} onSelectionChange={(e) => setSelectedImages(e.value)} dataKey="categoriaId"
        globalFilter={globalFilter} header={header} nombre_01="type" header_01="Nombre"
        nombre_02="url" header_02="Descripción" body={actionBodyTemplate} />
      {/** Modal de CREAR y ACTUALIZAR */}
      <DialogCreateUpdate visible={imageDialog} header={modalTitle} footer={imageDialogFooter}
        onHide={hideDialog} htmlFor_01="type" label_01="Nombre" id_01="type"
        value_01={categoria.type} onChange_01={(e) => onInputChange(e, 'type')}
        className_01={classNames({ 'p-invalid': submitted && !categoria.type })} msgRequired_01={submitted
          && !categoria.type && <small className="p-error">El nombre es obligatorio.</small>}
        htmlFor_02="url" label_02="Descripción" id_02="url"
        value_02={categoria.url} onChange_02={(e) => onInputChange(e, 'url')}
        className_02={classNames({ 'p-invalid': submitted && !categoria.url })}
        msgRequired_02={submitted && !categoria.url && <small className="p-error">La descripción es
          obligatorio.</small>} />
      {/** Modal de ELIMINAR una categoría */}
      <DialogDelete visible={deleteImageDialog} footer={deleteImageDialogFooter}
        onHide={hideDeleteImageDialog} msgDialogModal={categoria && (<span>
          Are you sure you want to delete <b>{categoria.nombre}</b>?
        </span>
        )} />
      {/** Modal de ELIMINAR varias categorias */}
      <DialogDelete visible={deleteImagesDialog} footer={deleteImagesDialogFooter}
        onHide={hideDeleteImagesDialog} msgDialogModal={categoria && <span>Are you sure you want to
          delete the selected categories?</span>} />
    </div>
  );
}
