import React from 'react'
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

export const DialogCreateUpdate = (props) => {
  const { visible, header, footer, onHide, htmlFor_01, label_01, id_01, value_01, onChange_01, className_01, msgRequired_01, type_01, name_01, htmlFor_02, label_02, id_02, value_02, onChange_02, className_02, msgRequired_02, type_02, name_02 } = props;

  const inputs = [{
    input: htmlFor_01, label: label_01, id: id_01, value: value_01, onChange: onChange_01, autoFocus: 'autoFocus', className: className_01, msgRequired: msgRequired_01, type: type_01, name: name_01
  },
  {
    input: htmlFor_02, label: label_02, id: id_02, value: value_02, onChange: onChange_02, className: className_02, msgRequired: msgRequired_02, type: type_02, name: name_02
  }
  ];

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
      {inputs.map((input, index) => (
        <div key={index} className="field">
          <label htmlFor={input.htmlFor} className="font-bold">
            {input.label}
          </label>
          <InputText
            id={input.id}
            name={input.name}
            type={input.type}
            value={input.value}
            onChange={input.onChange}
            required
            autoFocus={input.autoFocus}
            className={input.className}
          />
          {input.msgRequired}
        </div>
      ))}
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