import React, { useEffect, useState } from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  IonTab,
  IonLabel,
  IonText,
  IonRouterLink,
  IonBadge,
} from "@ionic/react";
import { add, close, pencil } from "ionicons/icons";
import { useHistory, useParams } from "react-router";
import Category from "./Category";
import { removeCustomer, searchCustomers } from "./CategoryApi";

const CategoryList: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const history = useHistory();

  useEffect(() => {
    search();
  }, [history.location.pathname]);

  const search = async () => {
    let result = await searchCustomers();
    setCategories(result);
  };

  const remove = async (id: string) => {
    await removeCustomer(id);
    search();
  };

  const addCustomer = () => {
    history.push("/page/category/new");
  };

  const editCustomer = (id: string) => {
    history.push("/page/category/" + id);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonCard>
            <IonTitle>Gestión de Categorías</IonTitle>

            <IonItem>
              <IonButton
                onClick={addCustomer}
                color="primary"
                fill="solid"
                slot="end"
                size="default"
              >
                <IonIcon icon={add} />
                Agregar Categoría
              </IonButton>
            </IonItem>

            <IonGrid className="table">
              <IonRow>
                <IonCol>
                  <IonLabel>Nombre</IonLabel>
                </IonCol>
                <IonCol>
                  <IonLabel>Estado</IonLabel>
                </IonCol>
                <IonCol>
                  <IonLabel>Acciones</IonLabel>
                </IonCol>
              </IonRow>

              {categories.map((category: Category) => (
                <IonRow key={category.id}>
                  <IonCol>
                    <IonText>{category.nombre}</IonText>
                  </IonCol>
                  <IonCol>
                    <IonBadge
                      color={
                        category.estado === "activo" ? "success" : "danger"
                      }
                    >
                      {category.estado}
                    </IonBadge>
                  </IonCol>
                  <IonCol>
                    <IonRouterLink
                      color="primary"
                      onClick={() => editCustomer(String(category.id))}
                    >
                      <IonIcon icon={pencil} slot="icon-only" />
                    </IonRouterLink>
                    <IonRouterLink
                      color="danger"
                      onClick={() => remove(String(category.id))}
                    >
                      <IonIcon icon={close} slot="icon-only" />
                    </IonRouterLink>
                  </IonCol>
                </IonRow>
              ))}
            </IonGrid>
          </IonCard>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default CategoryList;
