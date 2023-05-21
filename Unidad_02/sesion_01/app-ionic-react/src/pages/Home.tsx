import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import Table from "../components/Table";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>DEVAPerú SAC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        Hola Mundo
        <Table />
      </IonContent>
    </IonPage>
  );
};

export default Home;
