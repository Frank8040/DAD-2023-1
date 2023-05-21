import React from "react";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
} from "@ionic/react";
import { useHistory } from "react-router-dom";

const NavigationBar: React.FC = () => {
  const history = useHistory();

  const navigateTo = (path: string) => {
    history.push(path);
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>DEVAPerú SAC</IonTitle>
        <IonButtons slot="end">
          <IonButton onClick={() => navigateTo("/home")}>Inicio</IonButton>
          <IonButton onClick={() => navigateTo("/category")}>
            Categoria
          </IonButton>
          <IonButton onClick={() => navigateTo("/product")}>Producto</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default NavigationBar;
