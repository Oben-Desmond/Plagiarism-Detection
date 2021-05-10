import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
} from "@ionic/react";
import React from "react";
import img from "../img/sc.png";
const Menu: React.FC = () => {
  return (
    <IonMenu side='start' menuId='first' contentId='content' type='overlay'>
      <IonContent>
        <IonAvatar>
          <IonImg src={img}></IonImg>
        </IonAvatar>
        <IonList>
          <IonItem lines="full">
            <IonLabel>About</IonLabel>
            <IonIcon> </IonIcon>
          </IonItem>
          <IonItem lines="full">
            <IonLabel>Rate</IonLabel>
            <IonIcon></IonIcon>
          </IonItem>
          <IonItem lines="full">
            <IonLabel></IonLabel>
            <IonIcon>Contact</IonIcon>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
