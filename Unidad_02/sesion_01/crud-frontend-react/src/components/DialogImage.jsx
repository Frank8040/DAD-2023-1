import React from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export const DialogCreateUpdateImage = (props) => {
  const { visible, header, footer, onHide, htmlFor_01, label_01, id_01, value_01, onChange_01, className_01, msgRequired_01, type_01, name_01, value_02, imagen, onChangeFile } = props;

  const fileInputRef = React.createRef();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={header}
      modal
      className="p-fluid"
      footer={footer}
      onHide={onHide}
    >
      <div className="field">
        <label htmlFor={htmlFor_01} className="font-bold">
          {label_01}
        </label>
        <InputText
          id={id_01}
          name={name_01}
          type={type_01}
          value={value_01}
          onChange={onChange_01}
          required
          autoFocus
          className={className_01}
        />
        {msgRequired_01}
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
              onChange={onChangeFile}
            />
            <Button
              type="button"
              icon="pi pi-upload"
              label="Seleccionar"
              onClick={handleClick}
            />
            <InputText
              readOnly
              value={value_02}
              placeholder="Seleccionar archivo"
            />
          </div>
          {imagen}
        </div>
      </div>
    </Dialog>
  );
};

export const DialogDelete = (props) => {
  const { visible, footer, onHide, msgDialogModal } = props;
  return (
    <Dialog visible={visible} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirmar" modal footer={footer} onHide={onHide}>
      <div className="confirmation-content">
        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
        {msgDialogModal}
      </div>
    </Dialog>
  )
}