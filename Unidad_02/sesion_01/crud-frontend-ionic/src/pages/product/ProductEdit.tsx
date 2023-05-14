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
import Product from "./Product";
import { saveCustomer, searchCustomerById } from "./ProductApi";

const ProductEdit: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const [product, setProduct] = useState<Product>({});
  const history = useHistory();

  const routeMatch: any = useRouteMatch("/page/customer/:id");
  const id = routeMatch?.params?.id;

  useEffect(() => {
    search();
  }, [history.location.pathname]);

  const search = async () => {
    if (id === "new") {
      setProduct({});
    } else {
      let result = await searchCustomerById(id);
      setProduct(result);
    }
  };

  const save = async () => {
    await saveCustomer(product);
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
              {id === "new" ? "Agregar Producto" : "Editar Producto"}
            </IonTitle>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Nombre</IonLabel>
                  <IonInput
                    onIonChange={(e) =>
                      (product.firstname = String(e.detail.value))
                    }
                    value={product.firstname}
                  >
                    {" "}
                  </IonInput>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Apellido</IonLabel>
                  <IonInput
                    onIonChange={(e) =>
                      (product.lastname = String(e.detail.value))
                    }
                    value={product.lastname}
                  >
                    {" "}
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    onIonChange={(e) =>
                      (product.email = String(e.detail.value))
                    }
                    value={product.email}
                  >
                    {" "}
                  </IonInput>
                </IonItem>
              </IonCol>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Dirección</IonLabel>
                  <IonInput
                    onIonChange={(e) =>
                      (product.address = String(e.detail.value))
                    }
                    value={product.address}
                  >
                    {" "}
                  </IonInput>
                </IonItem>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonItem>
                  <IonLabel position="stacked">Teléfono</IonLabel>
                  <IonInput
                    onIonChange={(e) =>
                      (product.phone = String(e.detail.value))
                    }
                    value={product.phone}
                  >
                    {" "}
                  </IonInput>
                </IonItem>
              </IonCol>
              <IonCol></IonCol>
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

export default ProductEdit;
