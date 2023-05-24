import React, { useState, useEffect, useRef } from 'react';

// Importaciones de PrimeReact
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'jspdf-autotable';
import Table from '../components/Table';
import { DialogDelete } from '../components/Dialog';
import { createImage, deleteImage, deleteSelectedImages, getImageList, updateImage } from '../services/ImagenService';
import { exportToExcel, exportToPdf } from '../export/ExportsUtils';
import { DialogCreateUpdateImage } from '../components/DialogImage';

export default function Image() {

  let dataImage = {
    type: "",
    file: null,
    preview: null,
    fileName: "", // Agrega esta línea
  };

  const [images, setImages] = useState([]);
  const [imageDialog, setImageDialog] = useState(false);
  const [deleteImageDialog, setDeleteImageDialog] = useState(false);
  const [deleteImagesDialog, setDeleteImagesDialog] = useState(false);
  const [image, setImage] = useState(dataImage);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getImages();
  }, []);

  const getImages = () => {
    getImageList()
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onInputChange = (e, name) => {
    const val = e.target.value || '';
    setImage((prevImage) => ({
      ...prevImage,
      [name]: val,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const preview = URL.createObjectURL(file);
    setSelectedFile(file);
    setImage((prevImage) => ({
      ...prevImage,
      file,
      preview,
      fileName: file ? file.name : prevImage.fileName, // Actualizar el nombre del archivo
    }));
  };

  const saveUpdate = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (image.type) {
      if (image.id || isCreating === false) {
        const formData = new FormData();
        let hasChanges = false;

        // Verificar si hay cambios en la propiedad 'type'
        const originalImage = images.find((img) => img.id === image.id);
        if (image.type !== originalImage?.type) {
          formData.append("type", image.type);
          hasChanges = true;
        }

        // Verificar si hay cambios en el archivo seleccionado
        if (selectedFile) {
          formData.append("file", selectedFile);
          hasChanges = true;
        }

        if (hasChanges) {
          updateImage(image.id, formData)
            .then(() => {
              getImages();
              setImageDialog(false);
              toast.current.show({
                severity: "success",
                summary: "Éxito",
                detail: "Imagen actualizada",
                life: 3000,
              });
            })
            .catch((error) => {
              console.error("Error al actualizar la imagen:", error);
            });
        } else {
          // No hay cambios, simplemente cierra el diálogo
          setImageDialog(false);
        }
      } else {
        const formData = new FormData();
        formData.append("type", image.type);
        if (selectedFile) {
          formData.append("file", selectedFile);
        }

        createImage(formData)
          .then(() => {
            getImages();
            setImageDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Éxito",
              detail: "Imagen creado",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error al crear la imagen:", error);
          });
      }
    }
  };

  const openNew = () => {
    setImage(dataImage);
    setSubmitted(false);
    setImageDialog(true);
    setModalTitle("Crear Imagen");
    setIsCreating(true);
  };

  const editImage = (image) => {
    setImage({ ...image, id: image.id, preview: image.url, fileName: image.file ? image.file.name : image.url });
    setSelectedFile(null);
    setModalTitle('Editar Imagen');
    setIsCreating(false);
    setImageDialog(true);
  };

  const removeImage = () => {
    deleteImage(image.id)
      .then(() => {
        getImages();
      })
      .catch((error) => {
        console.log(error);
      });
    setDeleteImageDialog(false);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Imagen Eliminado', life: 3000 });
  };

  const removeSelectedImages = () => {
    const ids = selectedImages.map((image) => image.id);
    deleteSelectedImages(ids)
      .then(() => {
        getImages();
        setImages((prevCategorias) => prevCategorias.filter((c) => !ids.includes(c.id)));
        setSelectedImages(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Imágenes Eliminados', life: 3000 });
      })
      .catch((error) => {
        console.error('Error al eliminar las imágenes:', error);
      });
    setDeleteImagesDialog(false);
    getImages();
  };

  const confirmDeleteImage = (image) => {
    setImage(image);
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
    exportToExcel(images);
  };

  const exportPDF = () => {
    exportToPdf(images);
  };

  const confirmDeleteSelected = () => {
    setDeleteImagesDialog(true);
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

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.url}
        alt={rowData.type}
        className="shadow-2 border-round" style={{ width: '64px' }}
      />
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Administrar Imágenes</h4>
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
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={removeImage} />
    </React.Fragment>
  );
  const deleteImagesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteImagesDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={removeSelectedImages} />
    </React.Fragment>
  );

  return (
    <div>
      {/** TABLA de la categoría */}
      <Table isCategory={true} refToast={toast} left={leftToolbarTemplate} right={rightToolbarTemplate} refDT={dt} value={images}
        selection={selectedImages} onSelectionChange={(e) => setSelectedImages(e.value)} dataKey="id"
        globalFilter={globalFilter} header={header} nombre_00="type" header_00="Tipo"
        fieldImage="url" headerImage="Imagen" bodyImage={imageBodyTemplate} body={actionBodyTemplate} />

      {/** Modal de CREAR y ACTUALIZAR */}
      <DialogCreateUpdateImage visible={imageDialog} header={modalTitle} footer={imageDialogFooter}
        onHide={hideDialog} htmlFor_01="type" label_01="Tipo" id_01="type"
        value_01={image.type} onChange_01={(e) => onInputChange(e, 'type')}
        className_01={classNames({ 'p-invalid': submitted && !image.type })} msgRequired_01={submitted
          && !image.type && <small className="p-error">El tipo es obligatorio.</small>} type_01="text" name_01="type"
        onChangeFile={handleFileChange} value_02={image.fileName}
        imagen={image.preview && (
          <img
            src={image.preview}
            alt="Vista previa"
            style={{ marginTop: "10px", maxWidth: "200px" }}
          />
        )}
        isCategory={false}
      />
      {/** Modal de ELIMINAR un IMAGEN */}
      <DialogDelete visible={deleteImageDialog} footer={deleteImageDialogFooter}
        onHide={hideDeleteImageDialog} msgDialogModal={image && (<span>
          Are you sure you want to delete <b>{image.type}</b>?
        </span>
        )} />
      {/** Modal de ELIMINAR varias IMÁGENES */}
      <DialogDelete visible={deleteImagesDialog} footer={deleteImagesDialogFooter}
        onHide={hideDeleteImagesDialog} msgDialogModal={image && <span>Are you sure you want to
          delete the selected categories?</span>} />
    </div>
  );
}
