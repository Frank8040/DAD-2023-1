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
import { InputText } from 'primereact/inputtext';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Table() {

  const API_URL = "http://localhost:9090/cliente";

  let datosCliente = {
    id: null,
    nombre: "",
    dni: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
  };

  const [clientes, setClientes] = useState([]);
  const [clienteDialog, setClienteDialog] = useState(false);
  const [deleteClienteDialog, setDeleteClienteDialog] = useState(false);
  const [deleteClientesDialog, setDeleteClientesDialog] = useState(false);
  const [cliente, setCliente] = useState(datosCliente);
  const [selectedClientes, setSelectedClientes] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [modalTitle, setModalTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    getClientes();
  }, []);

  const getClientes = () => {
    axios
      .get(`${API_URL}`)
      .then((response) => {
        // handle success
        setClientes(response.data);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  };

  const openNew = () => {
    setCliente(datosCliente);
    setSubmitted(false);
    setClienteDialog(true);
    setModalTitle("Crear Cliente");
    setIsCreating(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setClienteDialog(false);
  };

  const hideDeleteClienteDialog = () => {
    setDeleteClienteDialog(false);
  };

  const hideDeleteClientesDialog = () => {
    setDeleteClientesDialog(false);
  };

  const saveUpdate = () => {
    setSubmitted(true);

    if (cliente.nombre && cliente.dni && cliente.apellidoPaterno && cliente.apellidoMaterno) {
      if (cliente.id || isCreating === false) {
        // Actualizar cliente existente
        axios
          .put(API_URL, cliente)
          .then((response) => {
            getClientes();
            setClienteDialog(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado', life: 3000 });
          })
          .catch((error) => {
            console.error('Error al actualizar el cliente:', error);
          });
      } else {
        // Crear nuevo cliente
        axios
          .post(API_URL, cliente)
          .then(() => {
            getClientes();
            setClienteDialog(false);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado', life: 3000 });
          })
          .catch((error) => {
            console.error('Error al crear el cliente:', error);
          });
      }
    }
  };

  const editCliente = (cliente) => {
    setCliente({ ...cliente });
    setSubmitted(false);
    setClienteDialog(true);
    setModalTitle("Editar Cliente");
    setIsCreating(false);
  };

  const confirmDeleteCliente = (cliente) => {
    setCliente(cliente);
    setDeleteClienteDialog(true);
  };

  const deleteCliente = () => {
    // Aquí se hace la petición a la API para eliminar el cliente
    axios
      .delete(`${API_URL}/${cliente.id}`)
      .then(() => {
        getClientes();
      })
      .catch((error) => {
        console.log(error);
      });
    setDeleteClienteDialog(false);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Clients Deleted', life: 3000 });
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientes);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, 'clientes.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const columns = [
      { header: 'Nombre', dataKey: 'nombre' },
      { header: 'Apellido Paterno', dataKey: 'apellidoPaterno' },
      { header: 'Apellido Materno', dataKey: 'apellidoMaterno' },
      { header: 'DNI', dataKey: 'dni' }
    ];
    const rows = clientes.map(cliente => ({ nombre: cliente.nombre, apellidoPaterno: cliente.apellidoPaterno, apellidoMaterno: cliente.apellidoMaterno, dni: cliente.dni }));

    doc.autoTable({
      columns: columns,
      body: rows,
      startY: 20
    });
    doc.save('clientes.pdf');
  };

  const confirmDeleteSelected = () => {
    setDeleteClientesDialog(true);
  };

  const deleteSelectedClientes = () => {
    selectedClientes.forEach((cliente) => {
      axios
        .delete(`${API_URL}/${cliente.id}`)
        .then(() => {
          // Eliminar el cliente de la lista actual
          setClientes((prevClientes) => prevClientes.filter((c) => c.id !== cliente.id));
          toast.current.show({ severity: 'success', summary: 'Successful', detail: `Cliente ${cliente.id} deleted`, life: 3000 });
        })
        .catch((error) => {
          console.log(error);
        });
    });
    setDeleteClientesDialog(false);
    setSelectedClientes(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Clients Deleted', life: 3000 });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _cliente = { ...cliente };

    _cliente[`${name}`] = val;

    setCliente(_cliente);
  };

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
        <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedClientes || !selectedClientes.length} />
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
        <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editCliente(rowData)} />
        <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCliente(rowData)} />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Administrar Clientes</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
      </span>
    </div>
  );
  const clienteDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" onClick={saveUpdate} />
    </React.Fragment>
  );
  const deleteClienteDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteClienteDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteCliente} />
    </React.Fragment>
  );
  const deleteClientesDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteClientesDialog} />
      <Button label="Sí" icon="pi pi-check" severity="danger" onClick={deleteSelectedClientes} />
    </React.Fragment>
  );

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        <DataTable ref={dt} value={clientes} selection={selectedClientes} onSelectionChange={(e) => setSelectedClientes(e.value)}
          dataKey="id" paginator rows={5} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} clientes" globalFilter={globalFilter} header={header} emptyMessage="No se encontraron resultados">
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }}></Column>
          <Column field="apellidoPaterno" header="ApellidoPaterno" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="apellidoMaterno" header="ApellidoMaterno" sortable style={{ minWidth: '16rem' }}></Column>
          <Column field="dni" header="Dni" sortable style={{ minWidth: '16rem' }}></Column>
          <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
        </DataTable>
      </div>

      <Dialog visible={clienteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={modalTitle} modal className="p-fluid" footer={clienteDialogFooter} onHide={hideDialog}>
        <div className="field">
          <label htmlFor="nombre" className="font-bold">
            Nombre
          </label>
          <InputText id="nombre" value={cliente.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !cliente.nombre })} />
          {submitted && !cliente.nombre && <small className="p-error">El nombre es obligatorio.</small>}
        </div>
        <div className="field">
          <label htmlFor="apellidoPaterno" className="font-bold">
            Apellido Paterno
          </label>
          <InputText id="apellidoPaterno" value={cliente.apellidoPaterno} onChange={(e) => onInputChange(e, 'apellidoPaterno')} required className={classNames({ 'p-invalid': submitted && !cliente.apellidoPaterno })} />
          {submitted && !cliente.apellidoPaterno && <small className="p-error">El apellido paterno es obligatorio.</small>}
        </div>
        <div className="field">
          <label htmlFor="apellidoMaterno" className="font-bold">
            Apellido Materno
          </label>
          <InputText id="apellidoMaterno" value={cliente.apellidoMaterno} onChange={(e) => onInputChange(e, 'apellidoMaterno')} required className={classNames({ 'p-invalid': submitted && !cliente.apellidoMaterno })} />
          {submitted && !cliente.apellidoMaterno && <small className="p-error">El apellido materno es obligatorio.</small>}
        </div>
        <div className="field">
          <label htmlFor="dni" className="font-bold">
            DNI
          </label>
          <InputText id="dni" value={cliente.dni} onChange={(e) => onInputChange(e, 'dni')} required className={classNames({ 'p-invalid': submitted && !cliente.dni })} />
          {submitted && !cliente.dni && <small className="p-error">El DNI es obligatorio.</small>}
        </div>
      </Dialog>
      <Dialog visible={deleteClienteDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteClienteDialogFooter} onHide={hideDeleteClienteDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {cliente && (
            <span>
              Are you sure you want to delete <b>{cliente.nombre}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog visible={deleteClientesDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteClientesDialogFooter} onHide={hideDeleteClientesDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {cliente && <span>Are you sure you want to delete the selected clients?</span>}
        </div>
      </Dialog>
    </div>
  );
}
