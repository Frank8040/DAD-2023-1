import React from "react";
import { IonRouterOutlet } from "@ionic/react";
import { IonReactHashRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import CategoryList from "./pages/category/CategoryList";
import CategoryEdit from "./pages/category/CategoryEdit";

const App: React.FC = () => {
  return (
    <IonReactHashRouter>
      <IonRouterOutlet>
        <Route path="/home" component={CategoryList} exact={true} />
        <Route path="/about" component={CategoryEdit} exact={true} />
        <Route path="/contact" component={CategoryList} exact={true} />
        <Redirect exact from="/" to="/home" />
      </IonRouterOutlet>
    </IonReactHashRouter>
  );
};

export default App;
