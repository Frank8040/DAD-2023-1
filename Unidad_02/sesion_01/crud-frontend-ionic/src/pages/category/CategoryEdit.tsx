import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { checkmark } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router";
import Category from "./Category";
import { saveCustomer, searchCustomerById } from "./CategoryApi";

const CategoryEdit: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const [category, setCategory] = useState<Category>({});
  const history = useHistory();

  const routeMatch: any = useRouteMatch("/page/customer/:id");
  const id = routeMatch?.params?.id;

  useEffect(() => {
    search();
  }, [history.location.pathname]);

  const search = async () => {
    if (id === "new") {
      setCategory({});
    } else {
      let result = await searchCustomerById(id);
      setCategory(result);
    }
  };

  const save = async () => {
    await saveCustomer(category);
    history.push("/page/customers");
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
            <IonTitle>
              {id === "new" ? "Agregar Categoría" : "Editar Categoría"}
            </IonTitle>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Nombre</IonLabel>
                  <IonInput
                    onIonChange={(e) =>
                      (category.nombre = String(e.detail.value))
                    }
                    value={category.nombre}
                  >
                    {" "}
                  </IonInput>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Estado</IonLabel>
                  <IonInput
                    onIonChange={(e) =>
                      (category.estado = String(e.detail.value))
                    }
                    value={category.estado}
                  >
                    {" "}
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonItem>
              <IonButton
                onClick={save}
                color="success"
                fill="solid"
                slot="end"
                size="default"
              >
                <IonIcon icon={checkmark} />
                Guardar
              </IonButton>
            </IonItem>
          </IonCard>
        </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default CategoryEdit;
