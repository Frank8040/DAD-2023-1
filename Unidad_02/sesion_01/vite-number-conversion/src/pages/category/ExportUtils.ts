/* eslint-disable @typescript-eslint/no-explicit-any */
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Category from "./Category";

// Exporta los datos a un archivo PDF
export const exportToPdf = (data: Category[]) => {
  const doc = new jsPDF();
  const columns = [
    { header: "Nombre", dataKey: "categoriaId" },
    { header: "Imagen", dataKey: "categoriaName" },
    { header: "Categoria", dataKey: "categoriaDescription" },
  ];
  const rows = data.map((categoria) => ({
    categoriaId: categoria.categoriaId,
    categoriaName: categoria.categoriaName,
    categoriaDescription: categoria.categoriaDescription,
  }));

  (doc as any).autoTable({
    columns: columns,
    body: rows,
    startY: 10,
  });
  doc.save("categorias.pdf");
};
// Exporta los datos a un archivo Excel (XLSX)
export const exportToExcel = (datas: Category[]) => {
  const worksheet = XLSX.utils.json_to_sheet(datas);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Productos");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(data, "productos.xlsx");
};

// Exporta los datos a un archivo CSV
export const exportToCsv = (data: Category[]) => {
  const csvContent = convertDataToCsv(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "categories.csv");
  console.log("Exported to CSV");
};

// Lógica para convertir los datos a formato CSV
const convertDataToCsv = (data: Category[]) => {
  let csvContent = "CategoriaID,Nombre,Descripción\n";
  data.forEach((category) => {
    csvContent += `${category.categoriaId},${category.categoriaName},${category.categoriaDescription}\n`;
  });
  return csvContent;
};
