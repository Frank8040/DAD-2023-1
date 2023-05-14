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
    imagenId: "",
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
    return <img src={`data:image/jpeg;base64,${rowData.imagenId}`} alt="Product" className="shadow-2 border-round" style={{ width: '64px' }} />;
  };

  const saveUpdate = () => {
    setSubmitted(true);

    if (product.nombre && product.imagenId && product.categoria.categoriaId) {
      if (product.id || isCreating === true) { // Corrección en esta línea
        // Actualizar producto existente
        axios
          .put(`${API_URL}/producto`, product)
          .then((response) => {
            getProductos();
            getCategorias();
            setProductDialog(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto actualizado', life: 3000 });
          })
          .catch((error) => {
            console.error('Error al actualizar el producto:', error);
          });
      } else {
        // Crear nuevo producto
        axios
          .post(`${API_URL}/producto`, product)
          .then(() => {
            getProductos();
            getCategorias();
            setProductDialog(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Producto creado', life: 3000 });
          })
          .catch((error) => {
            console.error('Error al crear el producto:', error);
          });
      }
    }
  };

  const editProducto = (product) => {
    setProduct({ ...product });
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
    // Eliminar imagen de la lista actual
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

  const uploadImage = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    // Hacer la petición para subir la imagen al servidor
    axios
      .post(`${API_URL}/imagen`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const imageUrl = response.data.imageUrl;
        setProduct({ ...product, imagenId: imageUrl });
      })
      .catch((error) => {
        console.error('Error al subir la imagen:', error);
      });
  };

  const deleteImage = () => {
    // Eliminar la imagen del servidor
    axios
      .delete(`${API_URL}/imagen/${product.imagenId}`)
      .then(() => {
        setProduct({ ...product, imagenId: null });
        toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Imagen eliminada', life: 3000 });
      })
      .catch((error) => {
        console.error('Error al eliminar la imagen:', error);
      });
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
      { header: 'Imagen', dataKey: 'imagenId' },
      { header: 'Categoria', dataKey: 'categoria' },
    ];
    const rows = products.map((producto) => ({
      nombre: producto.nombre,
      imagenId: producto.imagenId,
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

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);
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
          <Column field="imagenId" header="Imagen" body={imageBodyTemplate}></Column>
          <Column field="categoria.categoriaName" header="Categoria" sortable style={{ minWidth: '16rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={productDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={modalTitle} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
        <div className="p-field">
          <label htmlFor="imagen">Imagen</label>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-image" />
            </span>
            <input
              id="imagen"
              type="file"
              onChange={uploadImage}
            />
          </div>
        </div>
        {product.imagenId && (
          <div className="product-image-container">
            <img src={`${API_URL}/imagen/${product.imagenId}`} alt="Imagen del producto" className="product-image" />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined" onClick={deleteImage} />
          </div>
        )}
        <div className="field">
          <label htmlFor="nombre" className="font-bold">
            Nombre
          </label>
          <InputText id="nombre" value={product.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.nombre })} />
          {submitted && !product.nombre && <small className="p-error">El nombre es obligatorio.</small>}
        </div>
        <div className="field">
          <label htmlFor="imagenId" className="font-bold">
            Descripción
          </label>
          <InputText id="imagenId" value={product.imagenId} onChange={(e) => onInputChange(e, 'imagenId')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.imagenId })} />
          {submitted && !product.imagenId && <small className="p-error">La imagen es obligatorio.</small>}
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
