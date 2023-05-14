import React from 'react'
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const Table = (props) => {
  const { refToast, left, right, refDT, value, selection, onSelectionChange, dataKey, globalFilter, header, nombre_01, header_01, nombre_02, header_02, body } = props;

  const columns = [{
    field: nombre_01, header: header_01, minWidth: '12rem'
  },
  {
    field: nombre_02, header: header_02, minWidth: '12rem'
  },
  ]
  return (
    <>
      <Toast ref={refToast} />
      <div className="card">
        <Toolbar className="mb-4" left={left} right={right}></Toolbar>
        <DataTable ref={refDT} value={value} selection={selection} onSelectionChange={onSelectionChange}
          dataKey={dataKey} paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes" globalFilter={globalFilter} header={header} emptyMessage="No se encontraron resultados">
          <Column selectionMode="multiple" exportable={false}></Column>
          {
            columns.map((column) => (
              <Column key={column.field} field={column.field} header={column.header} sortable style={{ minWidth: column.minWidth }}></Column>
            ))
          }
          <Column body={body} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>
    </>
  )
}

export default Table
