import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

export const DialogCreateUpdate = (props) => {
  // eslint-disable-next-line react/prop-types
  const {
    width,
    classDrowp,
    msgRequired,
    visible,
    header,
    footer,
    onHide,
    value,
    onChange,
    options,
    optionValue,
    optionLabel,
    placeholder,
    htmlFor_00,
    label_00,
    id_00,
    value_00,
    onChange_00,
    className_00,
    msgRequired_00,
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
    htmlFor_03,
    label_03,
    id_03,
    value_03,
    onChange_03,
    className_03,
    msgRequired_03,
    htmlFor_04,
    label_04,
    id_04,
    value_04,
    onChange_04,
    className_04,
    msgRequired_04,
    htmlFor_05,
    label_05,
    id_05,
    value_05,
    onChange_05,
    className_05,
    msgRequired_05,
    htmlFor_06,
    label_06,
    id_06,
    value_06,
    onChange_06,
    className_06,
    msgRequired_06,
    htmlFor_07,
    label_07,
    id_07,
    value_07,
    onChange_07,
    className_07,
    msgRequired_07,
    htmlFor_08,
    label_08,
    id_08,
    value_08,
    onChange_08,
    className_08,
    msgRequired_08,
    label,
    isCategory,
    valueFile,
    imagen,
    onChangeFile,
  } = props;

  const fileInputRef = React.createRef();

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Dialog
      visible={visible}
      style={{ width: width }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={header}
      modal
      className="p-fluid"
      footer={footer}
      onHide={onHide}
    >
      {!isCategory && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "2rem",
            }}
          >
            <div>
              <div className="field">
                <label className="mb-3 font-bold">{label}</label>
                <div>
                  <Dropdown
                    value={value}
                    autoFocus
                    onChange={onChange}
                    options={
                      Array.isArray(options)
                        ? [
                            { label: "Opción por defecto", value: "default" },
                            ...options,
                          ]
                        : []
                    }
                    optionValue={optionValue}
                    optionLabel={optionLabel}
                    placeholder={placeholder}
                    className={classDrowp}
                    required
                  />
                  {msgRequired}
                </div>
              </div>
              <div className="field">
                <label htmlFor={htmlFor_00} className="font-bold">
                  {label_00}
                </label>
                <InputText
                  id={id_00}
                  value={value_00}
                  onChange={onChange_00}
                  required
                  className={className_00}
                />
                {msgRequired_00}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1rem",
                }}
              >
                <div className="field">
                  <label htmlFor={htmlFor_01} className="font-bold">
                    {label_01}
                  </label>
                  <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">S/.</span>
                    <InputNumber
                      id={id_01}
                      value={value_01}
                      onChange={onChange_01}
                      required
                      className={className_01}
                      placeholder="Price"
                    />
                    <span className="p-inputgroup-addon">.00</span>
                  </div>
                  {msgRequired_01}
                </div>
                <div className="field">
                  <label htmlFor={htmlFor_02} className="font-bold">
                    {label_02}
                  </label>
                  <InputText
                    id={id_02}
                    value={value_02}
                    onChange={onChange_02}
                    required
                    className={className_02}
                  />
                  {msgRequired_02}
                </div>
              </div>
            </div>
            <div className="field">
              <div className="p-field">
                <label htmlFor="file" className="font-bold">
                  Imagen:
                </label>
                <div className="p-inputgroup mt-3">
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
                    value={valueFile}
                    placeholder="Seleccionar archivo"
                  />
                </div>
                {imagen}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="field" style={{ width: "30rem" }}>
              <label htmlFor={htmlFor_03} className="font-bold">
                {label_03}
              </label>
              <InputText
                id={id_03}
                value={value_03}
                onChange={onChange_03}
                required
                className={className_03}
              />
              {msgRequired_03}
            </div>
            <div className="field">
              <label htmlFor={htmlFor_04} className="font-bold">
                {label_04}
              </label>
              <InputText
                id={id_04}
                value={value_04}
                onChange={onChange_04}
                required
                className={className_04}
              />
              {msgRequired_04}
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div className="field">
              <label htmlFor={htmlFor_05} className="font-bold">
                {label_05}
              </label>
              <InputText
                id={id_05}
                value={value_05}
                onChange={onChange_05}
                required
                className={className_05}
              />
              {msgRequired_05}
            </div>
            <div className="field">
              <label htmlFor={htmlFor_06} className="font-bold">
                {label_06}
              </label>
              <InputText
                id={id_06}
                value={value_06}
                onChange={onChange_06}
                required
                className={className_06}
              />
              {msgRequired_06}
            </div>
            <div className="field">
              <label htmlFor={htmlFor_07} className="font-bold">
                {label_07}
              </label>
              <InputText
                id={id_07}
                value={value_07}
                onChange={onChange_07}
                required
                className={className_07}
              />
              {msgRequired_07}
            </div>
            <div className="field">
              <label htmlFor={htmlFor_08} className="font-bold">
                {label_08}
              </label>
              <InputText
                id={id_08}
                value={value_08}
                onChange={onChange_08}
                required
                className={className_08}
              />
              {msgRequired_08}
            </div>
          </div>
        </>
      )}
      {isCategory && (
        <>
          <div className="field">
            <label htmlFor={htmlFor_00} className="font-bold">
              {label_00}
            </label>
            <InputText
              id={id_00}
              value={value_00}
              onChange={onChange_00}
              required
              autoFocus
              className={className_00}
            />
            {msgRequired_00}
          </div>
          <div className="field">
            <label htmlFor={htmlFor_01} className="font-bold">
              {label_01}
            </label>
            <InputText
              id={id_01}
              value={value_01}
              onChange={onChange_01}
              required
              className={className_01}
            />
            {msgRequired_01}
          </div>
        </>
      )}
    </Dialog>
  );
};

export const DialogDelete = (props) => {
  // eslint-disable-next-line react/prop-types
  const { visible, footer, onHide, msgDialogModal } = props;
  return (
    <Dialog
      visible={visible}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header={
        <div style={{ display: "flex", alignItems: "center" }}>
          Confirmar acción
        </div>
      }
      modal
      footer={footer}
      onHide={onHide}
    >
      <div className="confirmation-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <i
            className="pi pi-exclamation-triangle mb-3"
            style={{ fontSize: "4rem" }}
          />
          {msgDialogModal}
        </div>
      </div>
    </Dialog>
  );
};
