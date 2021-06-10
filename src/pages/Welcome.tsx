import {
  IonButton,
  IonCol,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRouterLink,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import StudentLogin from "../components/Login";

import "../css/welcome.css";

const Welcome: React.FC = () => {
  return (
      <IonPage>
        <div className="container">
          <div className="overlay">
            <IonContent className="content">
              <IonRow>
                <IonCol className="welcome-text">
                  <IonText color="light">
                    Welcome to the <IonText color="primary">internship</IonText>{" "}
                    report platform
                  </IonText>
                  <div className="links">
                    <div>
                      <IonRouterLink routerLink="/teacher-signup">
                        teacher
                      </IonRouterLink>
                    </div>
                    <div><IonRouterLink routerLink='/student-signup'>
                        Student</IonRouterLink></div>
                  </div>
                </IonCol>
                <IonCol>{/* <StudentLogin></StudentLogin> */}</IonCol>
              </IonRow>
            </IonContent>
          </div>
        </div>
      </IonPage>
  );
};

export default Welcome;
