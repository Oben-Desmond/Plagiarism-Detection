import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { play } from "ionicons/icons";
import img from "../images/img.png";

import "../css/console.css";

const ConsoleTeachers: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="tb-console">
          <IonText slot="start" color="success">
            COURSE <IonIcon icon={play}></IonIcon>
          </IonText>
          <IonSelect slot="start" placeholder="select course">
            <IonSelectOption>Course 1</IonSelectOption>
            <IonSelectOption>Course 2</IonSelectOption>
          </IonSelect>
          <IonTitle slot="end">MR SOP</IonTitle>
          <IonAvatar slot="end" className="tb-avatar">
            <IonImg src={img}></IonImg>
          </IonAvatar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeMd="3" className="db-col">
              <div className="holder">
                <div className="lp-titles">
                  <IonText color="success">
                    <h1>DIGITAL IMAGE PROCESSING</h1>
                  </IonText>
                  <IonText color="dark">
                    <h3>CEF 462</h3>
                  </IonText>
                </div>
                <div className="item-holder">
                  <IonItem lines="full">
                    <IonAvatar slot="start">
                      <IonImg src={img}></IonImg>
                    </IonAvatar>
                    <div className="lh">
                      <div>
                        <IonLabel className="l1">Akumah Ndeh</IonLabel>
                      </div>
                      <div>
                        <IonLabel className="l2">FE18A008</IonLabel>
                      </div>
                    </div>
                  </IonItem>
                  <IonItem lines="full">
                    <IonAvatar slot="start">
                      <IonImg src={img}></IonImg>
                    </IonAvatar>
                    <div className="lh">
                      <div>
                        <IonLabel className="l1">Akumah Ndeh</IonLabel>
                      </div>
                      <div>
                        <IonLabel className="l2">FE18A008</IonLabel>
                      </div>
                    </div>
                  </IonItem>
                  <IonItem lines="full">
                    <IonAvatar slot="start">
                      <IonImg src={img}></IonImg>
                    </IonAvatar>
                    <div className="lh">
                      <div>
                        <IonLabel className="l1">Akumah Ndeh</IonLabel>
                      </div>
                      <div>
                        <IonLabel className="l2">FE18A008</IonLabel>
                      </div>
                    </div>
                  </IonItem>
                </div>
              </div>
            </IonCol>
            <IonCol sizeMd="9">
              <div className="holder">
                <IonItem lines="full">
                  <div slot="start">
                    <h1>Vifieh Ruth</h1>
                    <h6>FE18A008</h6>
                  </div>
                  <div slot="end">
                    <IonButton className="sr-button">send review</IonButton>
                    <h6>12 JUNE 2021</h6>
                  </div>
                </IonItem>
                <IonButton
                  size="large"
                  fill="clear"
                  color="success"
                  className="od-button"
                >
                  open document
                </IonButton>
                <div className="rm-area">
                  <IonCard color='light'>
                    <IonCardHeader>
                      <IonCardTitle>Review Message</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sint nisi est placeat qui maiores. Amet eos qui, placeat
                      officia nobis dolorum dolor perferendis ullam magnam sed
                      quis, aut nemo veritatis. 
                      <h6>
                        <IonButton className='b'>edit</IonButton> 
                      </h6>
                    </IonCardContent>
                  </IonCard> 
                </div>
                <h1>Level of Plagiarism</h1>
                <h6>3 suspected cases</h6>

                <div className="results-holder">
                    
                </div>

              </div>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ConsoleTeachers;
