/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Toast } from "primereact/toast";
import { DataTable, DataTableSelectionChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";

interface Props {
  reftoast: React.RefObject<Toast> | undefined;
  left: () => JSX.Element; // Cambiado de JSX.Element a () => JSX.Element
  right: () => JSX.Element; // Cambiado de JSX.Element a () => JSX.Element
  refdt: React.RefObject<DataTable<any>> | undefined;
  values: any[]; // El tipo real de 'values' puede variar dependiendo de los datos que estés utilizando
  selection: any[] | null;
  onSelectionChange: (event: DataTableSelectionChangeEvent<any>) => void;
  dataKey: string;
  globalFilter: any; // El tipo real de 'globalFilter' puede variar dependiendo del componente que estés utilizando
  header: JSX.Element;
  field_01: string;
  header_01: string;
  field_02: string;
  header_02: string;
  body: (rowData: any) => JSX.Element; // Cambiado el tipo de prop
}

const Table = ({
  reftoast,
  left,
  right,
  refdt,
  values,
  selection,
  onSelectionChange,
  dataKey,
  globalFilter,
  header,
  field_01,
  header_01,
  field_02,
  header_02,
  body,
}: Props) => {
  const columns = [
    { field: field_01, header: header_01, minWidth: "12rem" },
    { field: field_02, header: header_02, minWidth: "16rem" },
  ];
  return (
    <div>
      <Toast ref={reftoast} />
      <div className="card">
        <Toolbar className="mb-4" left={left} right={right} />
        <DataTable
          ref={refdt}
          value={values}
          selection={selection}
          onSelectionChange={onSelectionChange}
          dataKey={dataKey}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} categorías"
          globalFilter={globalFilter}
          header={header}
          emptyMessage="No se encontraron resultados"
        >
          <Column
            selectionMode="multiple"
            exportable={false}
            style={{ width: "3em" }}
          />
          {columns.map((column) => (
            <Column
              key={column.field}
              field={column.field}
              header={column.header}
              sortable
              style={{ minWidth: column.minWidth }}
            />
          ))}
          <Column
            body={body}
            exportable={false}
            style={{ width: "8rem", textAlign: "center" }}
          />
        </DataTable>
      </div>
    </div>
  );
};

export default Table;
