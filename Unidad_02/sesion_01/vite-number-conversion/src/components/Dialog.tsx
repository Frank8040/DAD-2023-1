import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ChangeEventHandler } from "react";

interface Props {
  visible: boolean;
  header: string; // Cambiado de JSX.Element a () => JSX.Element
  footer: JSX.Element;
  onHide: () => void;
  htmlFor_01: string; //
  label_01: string; //
  id_01: string;
  value_01: string | undefined; // Actualizado
  onChange_01: ChangeEventHandler<HTMLInputElement> | undefined;
  className_01: string; //
  msgRequired_01: boolean; //
  htmlFor_02: string; //
  label_02: string; //
  id_02: string;
  value_02: string;
  onChange_02: ChangeEventHandler<HTMLInputElement> | undefined;
  className_02: string; //
  msgRequired_02: boolean; //
}

const DialogCreateUpdate = ({
  visible,
  header,
  footer,
  onHide,
  htmlFor_01,
  label_01,
  id_01,
  value_01,
  onChange_01,
  className_01,
  msgRequired_01,
  htmlFor_02,
  label_02,
  id_02,
  value_02,
  onChange_02,
  className_02,
  msgRequired_02,
}: Props) => {
  const inputs = [
    {
      htmlFor: htmlFor_01,
      label: label_01,
      id: id_01,
      value: value_01,
      onChange: onChange_01,
      className: className_01,
      msgRequired: msgRequired_01,
    },
    {
      htmlFor: htmlFor_02,
      label: label_02,
      id: id_02,
      value: value_02,
      onChange: onChange_02,
      className: className_02,
      msgRequired: msgRequired_02,
    },
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
            value={input.value}
            onChange={input.onChange}
            required
            autoFocus
            className={input.className}
          />
          {input.msgRequired}
        </div>
      ))}
    </Dialog>
  );
};

export default DialogCreateUpdate;
