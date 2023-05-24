import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Importaciones de PrimeReact
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Product() {

  const API_URL = "http://localhost:9090";

  let datosProduct = {
    id: null,
    nombre: "",
    file: null,
    preview: null,
    fileName: "",
    categoria: {
      categoriaId: "",
    }
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(datosProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getProductos();
    getCategorias();
  }, []);

  /*const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
  };
  };*/

  const onInputChange = (e, name) => {
    const val = e.target.value || '';
    setProduct((prevImage) => ({
      ...prevImage,
      [name]: val,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const preview = URL.createObjectURL(file);
    setSelectedFile(file);
    setProduct((prevImage) => ({
      ...prevImage,
      file,
      preview,
      fileName: file ? file.name : prevImage.fileName, // Actualizar el nombre del archivo
    }));
  };

  const getProductos = () => {
    axios
      .get(`${API_URL}/producto`)
      .then((response) => {
        // handle success
        setProducts(response.data);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  const getCategorias = () => {
    axios
      .get(`${API_URL}/categoria`)
      .then((response) => {
        // handle success
        setCategories(response.data);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  const openNew = () => {
    setProduct(datosProduct);
    setSubmitted(false);
    setProductDialog(true);
    setModalTitle("Crear Producto");
    setIsCreating(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const imageBodyTemplate = (rowData) => {
    return <img src={rowData.imagen} alt="Product" className="shadow-2 border-round" style={{ width: '64px' }} />;
  };

  const saveUpdate = (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (product.nombre) {
      if (product.id || isCreating === false) {
        const formData = new FormData();
        let hasChanges = false;

        // Verificar si hay cambios en la propiedad 'type'
        const originalProduct = products.find((img) => img.id === product.id);
        if (product.nombre !== originalProduct?.nombre) {
          formData.append("nombre", product.nombre);
          hasChanges = true;
        }

        // Verificar si hay cambios en la propiedad 'categoria'
        const originalCategory = products.find((img) => img.id === product.id);
        if (product.categoria.categoriaId !== originalCategory?.categoria.categoriaId) {
          formData.append("categoria", product.categoria.categoriaId);
          hasChanges = true;
        }

        // Verificar si hay cambios en el archivo seleccionado
        if (selectedFile) {
          formData.append("file", selectedFile);
          hasChanges = true;
        }

          if (hasChanges) {
            axios
            .put(`${API_URL}/producto/imagen/${product.id}`, formData)
              .then(() => {
                getProductos();
                getCategorias();
                setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
              })
              .catch((error) => {
                console.error("Error al actualizar el producto:", error);
              });
          } else {
            // No hay cambios, simplemente cierra el diálogo
            setProductDialog(false);
          }
      } else {
        const formData = new FormData();
        formData.append("nombre", product.nombre);
        formData.append("categoria", product.categoria.categoriaId);
        if (selectedFile) {
          formData.append("file", selectedFile);
        }
        axios
        .post(`${API_URL}/producto`, formData)
          .then(() => {
            getProductos();
            getCategorias();
            setProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto creado', life: 3000 });
          })
          .catch((error) => {
            console.error("Error al crear el producto:", error);
          });
      }
    }
  };

  const editProducto = (product) => {
    setProduct({ ...product, id: product.id, preview: product.imagen, fileName: product.file ? product.file.name : product.imagen });
    setSelectedFile(null);
    setSubmitted(false);
    setProductDialog(true);
    setModalTitle("Editar Producto");
    setIsCreating(false);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    // Eliminar producto de la lista actual
    setProducts((prevProducts) => prevProducts.filter((c) => c.id !== product.id));
    // Aquí se hace la petición a la API para eliminar el categoria
    axios
      .delete(`${API_URL}/producto/${product.id}`)
      .then(() => {
        getProductos();
        getCategorias();
      })
      .catch((error) => {
        console.log(error);
      });
    setDeleteProductDialog(false);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Producto Eliminado', life: 3000 });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'productos.xlsx');
  };
  const exportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: 'Nombre', dataKey: 'nombre' },
      { header: 'Imagen', dataKey: 'imagen' },
      { header: 'Categoria', dataKey: 'categoria' },
    ];
    const rows = products.map((producto) => ({
      nombre: producto.nombre,
      imagen: producto.imagen,
      categoria: producto.categoria.categoriaName
    }));

    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 10
    });
    doc.save('categorias.pdf');
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    selectedProducts.forEach((producto) => {
      axios
        .delete(`${API_URL}/producto/${producto.id}`)
        .then(() => {
          // Eliminar el categoria de la lista actual
          setProducts((prevProductos) => prevProductos.filter((c) => c.id !== producto.id));
          toast.current.show({
            severity: 'success',
            summary: 'Successful',
            detail: `Producto ${producto.id} eliminado`,
            life: 3000
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Categoría Eliminado', life: 3000 });
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
      </div>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <div className="flex align-items-center justify-content-end gap-2">
        <Button label='CSV' type="button" icon="pi pi-file" rounded onClick={exportCSV} data-pr-tooltip="CSV" />
        <Button label='XLSX' type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
        <Button label='PDF' type="button" icon="pi pi-file-pdf" severity="warning" rounded onClick={exportPDF} data-pr-tooltip="PDF" />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editProducto(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteProduct(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Administrar Productos</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUpdate} />
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteProduct} />
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
    </React.Fragment>
  );

  const fileInputRef = React.createRef();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos" globalFilter={globalFilter} header={header} emptyMessage="No se encontraron resultados">
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="imagen" header="Imagen" body={imageBodyTemplate}></Column>
          <Column field="categoria.categoriaName" header="Categoria" sortable style={{ minWidth: '16rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={modalTitle} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="nombre" className="font-bold">
            Nombre
          </label>
          <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
          {submitted && !product.nombre && <small className="p-error">El nombre es obligatorio.</small>}
        </div>
        <div className="field">
        <div className="p-field">
          <label htmlFor="file">Imagen:</label>
          <div className="p-inputgroup">
            <input
              ref={fileInputRef}
              accept="image/*"
              type="file"
              className="p-inputtext"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
            <Button
              type="button"
              icon="pi pi-upload"
              label="Seleccionar"
              onClick={handleClick}
            />
            <InputText
              readOnly
              value={product.fileName}
              placeholder="Seleccionar archivo"
            />
          </div>
          {product.preview && (
          <img
            src={product.preview}
            alt="Vista previa"
            style={{ marginTop: "10px", maxWidth: "200px" }}
          />
        )}
        </div>
      </div>
        <div className="field">
          <label className="mb-3 font-bold">Categoría</label>
          <div className="formgrid grid">
            <Dropdown
              value={product.categoria.categoriaId}
              onChange={(event) =>
                setProduct({
                  ...product,
                  categoria: {
                    categoriaId: event.target.value,
                  },
                })
              }
              options={categories}
              optionValue="categoriaId"
              optionLabel="categoriaName"
              placeholder="Selecciona una categoría"
              className="form-select"
            />
          </div>
        </div>
      </Dialog>
      <Dialog visible={deleteProductDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && (
            <span>
              Are you sure you want to delete <b>{product.nombre}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog visible={deleteProductsDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {product && <span>Are you sure you want to delete the selected categories?</span>}
        </div>
      </Dialog>
    </div>
  );
}
