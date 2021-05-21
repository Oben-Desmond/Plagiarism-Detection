import React, { createContext, useState } from "react";
import { IonRouterOutlet, IonTabBar, IonTabs, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router";
import LogIn from "../Pages/LogIn";
import Validate from "../Pages/validate";
import { userInterface } from "./componentTypes";
import { search, book, star } from "ionicons/icons";
import Home from "../Pages/Home";
import Saved from "../Pages/Saved";
import Starred from "../Pages/Starred";


const defaultUser:userInterface = { name: ``, tel: ``, validate: true ,deviceName:``,model:``,osVersion:``,uuid:``}
export const UserContext = createContext<{ userInfo: userInterface, setuserInfo: Function }>({ userInfo: defaultUser, setuserInfo: () => { } })


const RouterOutlet: React.FC = () => {

  const [userInfo, setuserInfo] = useState<userInterface>(defaultUser)

  return (
    <UserContext.Provider value={{ userInfo, setuserInfo }}>
      <IonReactRouter>
        <IonTabs >
          <IonRouterOutlet>
            <Route path="/search" component={Home} exact></Route>
            <Route path="/saved" component={Saved} exact></Route>
            <Route path="/starred" component={Starred} exact></Route>
            <Redirect exact from="/" to="/validate" />
          </IonRouterOutlet>
          <IonTabBar
            slot="bottom"
            selectedTab="search"
            translucent={true}>
            <IonTabButton tab="search" href="/search">
              <IonIcon icon={search}></IonIcon>
              <IonLabel>Search</IonLabel>
            </IonTabButton>
            <IonTabButton  tab="saved" href="/saved">
              <IonIcon icon={book}></IonIcon>
              <IonLabel>Saved</IonLabel>
            </IonTabButton>
            <IonTabButton tab="starred" href="/starred">
              <IonIcon icon={star}></IonIcon>
              <IonLabel>Starred</IonLabel>
            </IonTabButton>

          </IonTabBar>

        </IonTabs>
        <Route path='/validate' component={Validate}></Route>
        <Route path="/login" component={LogIn} exact></Route>
      </IonReactRouter>
    </UserContext.Provider>
  )
}



export default RouterOutlet