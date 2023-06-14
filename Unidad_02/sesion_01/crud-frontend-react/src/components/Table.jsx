import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Table = (props) => {
  const {
    refToast,
    left,
    right,
    refDT,
    value,
    selection,
    onSelectionChange,
    dataKey,
    filters,
    header,
    nombre_00,
    header_00,
    body,
    isCategory,
    fieldImage,
    headerImage,
    bodyImage,
    globalFilterFields,
    filterDisplay
  } = props;

  const visibleColumns = [
    { field: nombre_00, header: header_00, minWidth: "12rem" },
  ];

  if (!isCategory) {
    const columnCounts = [2, 4, 9];
    const maxColumns = Math.max(...columnCounts);

    for (let i = 1; i <= maxColumns; i++) {
      const fieldName = props[`nombre_0${i}`];
      const headerName = props[`header_0${i}`];

      if (fieldName && headerName) {
        visibleColumns.push({
          field: fieldName,
          header: headerName,
          minWidth: "12rem",
        });
      }
    }
  }
  return (
    <>
      <Toast ref={refToast} />
      <div className="card" style={{ padding: 15 }}>
        <Toolbar className="mb-4" left={left} right={right}></Toolbar>
        <DataTable
          ref={refDT}
          value={value}
          selection={selection}
          onSelectionChange={onSelectionChange}
          dataKey={dataKey}
          paginator
          rows={5}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
          filterDisplay={filterDisplay}
          filters={filters} globalFilterFields={globalFilterFields}
          header={header}
          emptyMessage="No se encontraron resultados"
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          {isCategory && (
            <Column
              field={fieldImage}
              header={headerImage}
              body={bodyImage}
              style={{ minWidth: "7rem" }}
            ></Column>
          )}
          {visibleColumns.map((column, index) => (
            <Column
              key={index}
              field={column.field}
              header={column.header}
              sortable
              style={{ minWidth: column.minWidth }}
            />
          ))}
          <Column
            field="fechaCreacion"
            header="Creado"
            style={{ minWidth: "7rem" }}
          ></Column>
          <Column
            field="fechaActualizacion"
            header="Actualizado"
            style={{ minWidth: "7rem" }}
          ></Column>
          <Column
            body={body}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>
    </>
  );
};

export default Table;
