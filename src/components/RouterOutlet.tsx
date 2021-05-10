import React, { createContext, useState } from "react";
import { IonContent, IonRouterOutlet, IonTabBar, IonTabs, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router";
import LogIn from "../Pages/LogIn";
import Validate from "../Pages/validate";
import Routes from "./Routes";
import { TabButtons } from "../App";
import { userInterface } from "./componentTypes";
import { search, book, star } from "ionicons/icons";


const defaultUser = { name: ``, tel: ``, validate: true }
export const UserContext = createContext<{ userInfo: userInterface, setuserInfo: Function }>({ userInfo: defaultUser, setuserInfo: () => { } })


const RouterOutlet: React.FC = () => {

  const [userInfo, setuserInfo] = useState<userInterface>(defaultUser)

  return (
    <UserContext.Provider value={{ userInfo, setuserInfo }}>
      <IonReactRouter>
        <IonContent>
          <IonTabs >
            <IonRouterOutlet>
              <Routes></Routes>
            </IonRouterOutlet>
            <IonTabBar
              slot="bottom"
              selectedTab="search"
              translucent={true}>
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

            </IonTabBar>

          </IonTabs>
        </IonContent>
        <Route path='/validate' component={Validate}></Route>
        <Route path="/login" component={LogIn} exact></Route>
      </IonReactRouter>
    </UserContext.Provider>
  )
}



export default RouterOutlet