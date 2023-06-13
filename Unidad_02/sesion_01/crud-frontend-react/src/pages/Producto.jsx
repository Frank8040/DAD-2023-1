import React, { useState, useEffect, useRef } from "react";

// Importaciones de PrimeReact
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { classNames } from "primereact/utils";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "jspdf-autotable";
import Table from "../components/Table";
import { DialogCreateUpdate, DialogDelete } from "../components/DialogCatalogo";
import * as ProductoService from "../services/ProductoService";
import { exportToExcel, exportToPdf } from "../export/ExportFilePro";
import { getCategoryList } from "../services/CategoriaService";

export default function Product() {
  let dataProduct = {
    nombre: "",
    precio: "",
    stock: "",
    detalle: "",
    material: "",
    largo: "",
    ancho: "",
    alto: "",
    estado: "",
    categoria: {
      id: "",
    },
    file: null,
    preview: null,
    fileName: "",
  };

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(dataProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nombre: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
  });
  const [modalTitle, setModalTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const getCategories = () => {
    getCategoryList()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getProducts = () => {
    ProductoService.getProductList()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
        if (product.precio !== originalProduct?.precio) {
          formData.append("precio", product.precio);
          hasChanges = true;
        }
        if (product.stock !== originalProduct?.stock) {
          formData.append("stock", product.stock);
          hasChanges = true;
        }
        if (product.detalle !== originalProduct?.detalle) {
          formData.append("detalle", product.detalle);
          hasChanges = true;
        }
        if (product.material !== originalProduct?.material) {
          formData.append("material", product.material);
          hasChanges = true;
        }
        if (product.largo !== originalProduct?.largo) {
          formData.append("largo", product.largo);
          hasChanges = true;
        }
        if (product.ancho !== originalProduct?.ancho) {
          formData.append("ancho", product.ancho);
          hasChanges = true;
        }
        if (product.alto !== originalProduct?.alto) {
          formData.append("alto", product.alto);
          hasChanges = true;
        }
        if (product.estado !== originalProduct?.estado) {
          formData.append("estado", product.estado);
          hasChanges = true;
        }

        // Verificar si hay cambios en la propiedad 'categoria'
        const originalCategory = products.find((img) => img.id === product.id);
        if (product.categoria.id !== originalCategory?.categoria.id) {
          formData.append("categoria", product.categoria.id);
          hasChanges = true;
        }

        // Verificar si hay cambios en el archivo seleccionado
        if (selectedFile) {
          formData.append("file", selectedFile);
          hasChanges = true;
        }

        if (hasChanges) {
          ProductoService.updateProduct(product.id, formData)
            .then(() => {
              getProducts();
              getCategories();
              setProductDialog(false);
              toast.current.show({
                severity: "success",
                summary: "Éxito",
                detail: "Producto actualizado",
                life: 3000,
              });
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
        formData.append("precio", product.precio);
        formData.append("stock", product.stock);
        formData.append("detalle", product.detalle);
        formData.append("material", product.material);
        formData.append("largo", product.largo);
        formData.append("ancho", product.ancho);
        formData.append("alto", product.alto);
        formData.append("estado", product.estado);
        formData.append("categoria", product.categoria.id);
        if (selectedFile) {
          formData.append("file", selectedFile);
        }
        ProductoService.createProduct(formData)
          .then(() => {
            getProducts();
            getCategories();
            setProductDialog(false);
            toast.current.show({
              severity: "success",
              summary: "Éxito",
              detail: "Producto creado",
              life: 3000,
            });
          })
          .catch((error) => {
            console.error("Error al crear el producto:", error);
          });
      }
    }
  };

  const removeProduct = () => {
    setProducts((prevProducts) =>
      prevProducts.filter((c) => c.id !== product.id)
    );
    ProductoService.deleteProduct(product.id)
      .then(() => {
        getProducts();
        getCategories();
      })
      .catch((error) => {
        console.log(error);
      });
    setDeleteProductDialog(false);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Producto Eliminado",
      life: 3000,
    });
  };

  const removeSelectedProducts = () => {
    const ids = selectedProducts.map((product) => product.id);
    const isMultiple = selectedProducts.length > 1;

    ProductoService.deleteSelectedProducts(ids)
      .then(() => {
        getProducts();
        getCategories();
        setProducts((prevProducts) =>
          prevProducts.filter((p) => !ids.includes(p.id))
        );
        setSelectedProducts([]);
        if (isMultiple) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Productos Eliminados",
            life: 3000,
          });
        } else {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Producto Eliminado",
            life: 3000,
          });
        }
      })
      .catch((error) => {
        console.error("Error al eliminar los productos:", error);
      });
    setDeleteProductsDialog(false);
    getProducts();
  };

  const openNew = () => {
    setProduct(dataProduct);
    setSubmitted(false);
    setProductDialog(true);
    setModalTitle("Crear Producto");
    setIsCreating(true);
  };

  const editproduct = (product) => {
    setProduct({
      ...product,
      id: product.id,
      preview: product.imagen,
      fileName: product.file ? product.file.name : product.imagen,
    });
    setSelectedFile(null);
    setModalTitle("Editar Producto");
    setIsCreating(false);
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
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

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const exportExcel = () => {
    exportToExcel(products);
  };

  const exportPDF = () => {
    exportToPdf(products);
  };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const onInputChange = (e, name) => {
    const val = e.target.value || "";
    setProduct((prevImage) => ({
      ...prevImage,
      [name]: val,
    }));
  };

  const handleFileChange = (event) => {
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

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedProducts || !selectedProducts.length}
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
          onClick={exportCSV}
          data-pr-tooltip="CSV"
        />
        <Button
          label="XLSX"
          type="button"
          icon="pi pi-file-excel"
          severity="success"
          rounded
          onClick={exportExcel}
          data-pr-tooltip="XLS"
        />
        <Button
          label="PDF"
          type="button"
          icon="pi pi-file-pdf"
          severity="warning"
          rounded
          onClick={exportPDF}
          data-pr-tooltip="PDF"
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editproduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilter(value);
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 text-xl">Administrar Productos</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          value={globalFilter}
          onChange={onGlobalFilterChange}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );
  const productDialogFooter = (
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
  const deleteProductDialogFooter = (
    <React.Fragment>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          outlined
          onClick={hideDeleteProductDialog}
        />
        <Button
          label="Aceptar"
          icon="pi pi-check"
          severity="danger"
          onClick={removeProduct}
        />
      </div>
    </React.Fragment>
  );
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Button
          label="Cancelar"
          icon="pi pi-times"
          outlined
          onClick={hideDeleteProductsDialog}
        />
        <Button
          label="Aceptar"
          icon="pi pi-check"
          severity="danger"
          onClick={removeSelectedProducts}
        />
      </div>
    </React.Fragment>
  );

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.imagen}
        alt="Product"
        className="shadow-2 border-round"
        style={{ width: "64px" }}
      />
    );
  };

  return (
    <div>
      {/** TABLA de la categoría */}
      <Table
        isCategory={false}
        refToast={toast}
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
        refDT={dt}
        value={products}
        selection={selectedProducts}
        onSelectionChange={(e) => setSelectedProducts(e.value)}
        dataKey="id"
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={["nombre"]}
        header={header}
        fieldImage="imagen"
        headerImage="Imagen"
        bodyImage={imageBodyTemplate}
        nombre_00="nombre"
        header_00="Nombre"
        nombre_01="categoria.nombre"
        header_01="Categoria"
        nombre_02="precio"
        header_02="Precio"
        nombre_03="stock"
        header_03="Stock"
        nombre_04="detalle"
        header_04="Detalle"
        nombre_05="material"
        header_05="Material"
        nombre_06="largo"
        header_06="Largo"
        nombre_07="ancho"
        header_07="Ancho"
        nombre_08="alto"
        header_08="Alto"
        nombre_09="estado"
        header_09="Estado"
        body={actionBodyTemplate}
      />
      {/** Modal de CREAR y ACTUALIZAR */}
      <DialogCreateUpdate
        width="45rem"
        isCategory={false}
        visible={productDialog}
        header={modalTitle}
        footer={productDialogFooter}
        onHide={hideDialog}
        htmlFor_00="nombre"
        label_00="Nombre"
        id_00="nombre"
        value_00={product.nombre}
        onChange_00={(e) => onInputChange(e, "nombre")}
        className_00={classNames({ "p-invalid": submitted && !product.nombre })}
        msgRequired_00={
          submitted &&
          !product.nombre && (
            <small className="p-error">El nombre es obligatorio.</small>
          )
        }
        htmlFor_01="precio"
        label_01="Precio"
        id_01="precio"
        value_01={product.precio}
        onChange_01={(e) => onInputChange(e, "precio")}
        className_01={classNames({ "p-invalid": submitted && !product.precio })}
        msgRequired_01={
          submitted &&
          !product.precio && (
            <small className="p-error">El precio es obligatorio.</small>
          )
        }
        htmlFor_02="stock"
        label_02="Stock"
        id_02="stock"
        value_02={product.stock}
        onChange_02={(e) => onInputChange(e, "stock")}
        className_02={classNames({ "p-invalid": submitted && !product.stock })}
        msgRequired_02={
          submitted &&
          !product.stock && (
            <small className="p-error">El stock es obligatorio.</small>
          )
        }
        htmlFor_03="detalle"
        label_03="Detalle"
        id_03="detalle"
        value_03={product.detalle}
        onChange_03={(e) => onInputChange(e, "detalle")}
        className_03={classNames({
          "p-invalid": submitted && !product.detalle,
        })}
        msgRequired_03={
          submitted &&
          !product.detalle && (
            <small className="p-error">El detalle es obligatorio.</small>
          )
        }
        htmlFor_04="material"
        label_04="Material"
        id_04="material"
        value_04={product.material}
        onChange_04={(e) => onInputChange(e, "material")}
        className_04={classNames({
          "p-invalid": submitted && !product.material,
        })}
        msgRequired_04={
          submitted &&
          !product.material && (
            <small className="p-error">El material es obligatorio.</small>
          )
        }
        htmlFor_05="largo"
        label_05="Largo"
        id_05="largo"
        value_05={product.largo}
        onChange_05={(e) => onInputChange(e, "largo")}
        className_05={classNames({ "p-invalid": submitted && !product.largo })}
        msgRequired_05={
          submitted &&
          !product.largo && (
            <small className="p-error">El largo es obligatorio.</small>
          )
        }
        htmlFor_06="ancho"
        label_06="Ancho"
        id_06="ancho"
        value_06={product.ancho}
        onChange_06={(e) => onInputChange(e, "ancho")}
        className_06={classNames({ "p-invalid": submitted && !product.ancho })}
        msgRequired_06={
          submitted &&
          !product.ancho && (
            <small className="p-error">El ancho es obligatorio.</small>
          )
        }
        htmlFor_07="alto"
        label_07="Alto"
        id_07="alto"
        value_07={product.alto}
        onChange_07={(e) => onInputChange(e, "alto")}
        className_07={classNames({ "p-invalid": submitted && !product.alto })}
        msgRequired_07={
          submitted &&
          !product.alto && (
            <small className="p-error">El alto es obligatorio.</small>
          )
        }
        htmlFor_08="estado"
        label_08="Estado"
        id_08="estado"
        value_08={product.estado}
        onChange_08={(e) => onInputChange(e, "estado")}
        className_08={classNames({ "p-invalid": submitted && !product.estado })}
        msgRequired_08={
          submitted &&
          !product.estado && (
            <small className="p-error">El estado es obligatorio.</small>
          )
        }
        label="Categoría"
        value={product.categoria.id}
        onChange={(event) =>
          setProduct({
            ...product,
            categoria: {
              id: event.target.value,
            },
          })
        }
        options={categories}
        optionValue="id"
        optionLabel="nombre"
        placeholder="Selecciona una categoría"
        classDrowp={classNames({
          "p-invalid": submitted && !product.categoria.id,
        })}
        msgRequired={
          submitted &&
          !product.categoria.id && (
            <small className="p-error">La categoria es obligatorio.</small>
          )
        }
        onChangeFile={handleFileChange}
        valueFile={product.fileName}
        imagen={
          <div style={{ display: "flex", justifyContent: "center" }}>
            <img
              src={
                product.preview ||
                "https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png"
              }
              alt="Vista previa"
              style={{ marginTop: "10px", maxWidth: "200px" }}
            />
          </div>
        }
      />
      {/** Modal de ELIMINAR una categoría */}
      <DialogDelete
        visible={deleteProductDialog}
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
        msgDialogModal={
          product && (
            <span>
              ¿Estás seguro de que quieres eliminar <b>{product.nombre}</b>? No
              podrás revertir esto.
            </span>
          )
        }
      />
      {/** Modal de ELIMINAR varias products */}
      <DialogDelete
        visible={deleteProductsDialog}
        footer={deleteProductsDialogFooter}
        onHide={hideDeleteProductsDialog}
        msgDialogModal={
          product && (
            <span>
              ¿Estás seguro de que desea eliminar los productos seleccionados?
              No podrás revertir esto.
            </span>
          )
        }
      />
    </div>
  );
}
