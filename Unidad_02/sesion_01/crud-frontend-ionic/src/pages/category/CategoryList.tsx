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
} from "@ionic/react";
import { add, close, pencil } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import Category from "./Category";
import { removeCustomer, searchCustomers } from "./CategoryApi";

const CategoryList: React.FC = (props: any) => {
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
                <IonCol>Nombre</IonCol>
                <IonCol>Descripción</IonCol>
                <IonCol>Acciones</IonCol>
              </IonRow>

              {categories.map((category: Category) => (
                <IonRow key={category.categoriaId}>
                  <IonCol>{category.categoriaName}</IonCol>
                  <IonCol>{category.categoriaDescription}</IonCol>
                  <IonCol>
                    <IonButton
                      color="primary"
                      fill="clear"
                      onClick={() => editCustomer(String(category.categoriaId))}
                    >
                      <IonIcon icon={pencil} slot="icon-only" />
                    </IonButton>

                    <IonButton
                      color="danger"
                      fill="clear"
                      onClick={() => remove(String(category.categoriaId))}
                    >
                      <IonIcon icon={close} slot="icon-only" />
                    </IonButton>
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
