import React from "react";
import { IonContent, IonList, IonItem, IonIcon, IonLabel } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { apps, person, home } from "ionicons/icons";
import "../styles/SideBar.css";

const Sidebar: React.FC = () => {
  const history = useHistory();

  const navigateTo = (path: string) => {
    history.push(path);
  };

  return (
    <div id="main-content" className="sidebar">
      <IonContent fullscreen>
        <IonList>
          <IonItem onClick={() => navigateTo("/home")} routerDirection="none">
            <IonIcon icon={home} slot="start" />
            <IonLabel>Inicio</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => navigateTo("/product")}
            routerDirection="none"
          >
            <IonIcon icon={apps} slot="start" />
            <IonLabel>Producto</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => navigateTo("/category")}
            routerDirection="none"
          >
            <IonIcon icon={person} slot="start" />
            <IonLabel>Categoria</IonLabel>
          </IonItem>
          {/* Agrega más ítems para otras secciones */}
        </IonList>
      </IonContent>
    </div>
  );
};

export default Sidebar;
