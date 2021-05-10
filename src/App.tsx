import React, { useEffect } from "react";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
} from "@ionic/react";

import "./App.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import {
  book,
  search,
  star,
} from "ionicons/icons";
// import Search from "./Pages/Starred";
import { Plugins } from "@capacitor/core";
import AppUrlListener from "./Pages/AppURLListener";
import RouterOutlet from "./components/RouterOutlet";

const App: React.FC = () => {

  useEffect(() => {
    Plugins.StatusBar.setBackgroundColor({ color: '#202122' }).catch(console.log)

  }, [])
  return (
    <IonApp>

      <AppUrlListener></AppUrlListener>
      <RouterOutlet></RouterOutlet> 

    </IonApp>
  );
};

export default App;


export function TabButtons() {

  return (
    <>
      <IonTabButton tab="search" href="/search">
        <IonIcon icon={search}></IonIcon>
        <IonLabel>Search</IonLabel>
      </IonTabButton>
      <IonTabButton tab="saved" href="/saved">
        <IonIcon icon={book}></IonIcon>
        <IonLabel>Saved</IonLabel>
      </IonTabButton>
      <IonTabButton tab="starred" href="/starred">
        <IonIcon icon={star}></IonIcon>
        <IonLabel>Starred</IonLabel>
      </IonTabButton>
    </>
  )
}