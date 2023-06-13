import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Exporta los datos a un archivo PDF
export const exportToPdf = (products) => {
  const doc = new jsPDF();
  const columns = [
    { header: "Id", dataKey: "id" },
    { header: "Nombre", dataKey: "nombre" },
    { header: "Imagen", dataKey: "imagen" },
    { header: "Categoría", dataKey: "categoria" },
    { header: "Estado", dataKey: "estado" },
    { header: "Precio", dataKey: "precio" },
    { header: "Stock", dataKey: "stock" },
    { header: "Detalle", dataKey: "detalle" },
    { header: "Material", dataKey: "material" },
    { header: "Largo", dataKey: "largo" },
    { header: "Ancho", dataKey: "ancho" },
    { header: "Alto", dataKey: "alto" },

  ];
  const rows = products.map((product) => ({
    id: product.id,
    nombre: product.nombre,
    imagen: product.imagen,
    categoria: product.categoria.nombre,
    estado: product.estado,
    precio: product.precio,
    stock: product.stock,
    detalle: product.detalle,
    material: product.material,
    largo: product.largo,
    ancho: product.ancho,
    alto: product.alto,
  }));

  doc.autoTable({
    columns: columns,
    body: rows,
    startY: 10,
  });
  doc.save("products.pdf");
};

// Exporta los datos a un archivo Excel (XLSX)
export const exportToExcel = (products) => {
  const excelData = products.map((product) => ({
    id: product.id,
    nombre: product.nombre,
    categoria: product.categoria.nombre,
    estado: product.estado,
    precio: product.precio,
    stock: product.stock,
    detalle: product.detalle,
    material: product.material,
    largo: product.largo,
    ancho: product.ancho,
    alto: product.alto,
    imagen: product.imagen,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const product = new Blob([excelBuffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(product, "products.xlsx");
};