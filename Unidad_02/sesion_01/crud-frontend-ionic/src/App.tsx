import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactHashRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
/* Theme variables */
import "./theme/variables.css";
import CategoryList from "./pages/category/CategoryList";
import CategoryEdit from "./pages/category/CategoryEdit";

const App = () => {
  return (
    <IonApp>
      <IonReactHashRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Redirect to="/page/categories" />
            </Route>

            <Route path="/page/categories" exact={true}>
              <CategoryList />
            </Route>

            <Route path="/page/category/:id" exact={true}>
              <CategoryEdit />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactHashRouter>
    </IonApp>
  );
};

export default App;
