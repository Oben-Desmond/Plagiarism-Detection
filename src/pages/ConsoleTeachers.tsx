import {
  IonAvatar,
  IonBackdrop,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonProgressBar,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { play } from "ionicons/icons";
import img from "../images/img.png";

import "../css/console.css";

const ConsoleTeachers: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [reviewMessage, setreviewMessage] = useState(
    "Writren review will appear..."
  );
  const review = useRef<HTMLIonInputElement>(null);

  let axios = require("axios");

  function getValues() {
    // const options = {
    //   method: "POST",
    //   origin: "http://localhost:8100/console-teachers",
    //   mode: "no-cors",
    // };
    // fetch("https://webhook.site/01ba19c2-36e0-4cb6-bd18-a8bb78cec13f", options)
    //   .then((response) => response.json())
    //   .then((response) => {
    //     console.log(response.data);
    //   });

    // axios
    //   .get(
    //     "https://webhook.site/01ba19c2-36e0-4cb6-bd18-a8bb78cec13f",{mode:'no-cors'}
    //   )
    //   .then((response:any) => {
    //     console.log(response.data);
    //     console.log(response.status);
    //     console.log(response.statusText);
    //     console.log(response.headers);
    //     console.log(response.config);
    //   });
  }

  useEffect(() => {
    getValues();
  }, []);

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
                  <IonCard color="light">
                    <IonCardHeader>
                      <IonCardTitle>Review Message</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sint nisi est placeat qui maiores. Amet eos qui, placeat
                      officia nobis dolorum dolor perferendis ullam magnam sed
                      quis, aut nemo veritatis.
                    </IonCardContent>
                    <IonItem className="i" lines="none">
                      <IonButton
                        className="b"
                        slot="end"
                        onClick={() => setShowModal(true)}
                      >
                        edit
                      </IonButton>
                    </IonItem>
                    <IonModal
                      onDidDismiss={() => setShowModal(false)}
                      isOpen={showModal}
                    >
                      <IonContent>
                        <IonHeader>
                          <IonToolbar>
                            <IonTitle>Compose Review Message</IonTitle>
                          </IonToolbar>
                        </IonHeader>
                        <IonItem>
                          <IonLabel position="floating">Enter Review</IonLabel>
                          <IonInput
                            ref={review}
                            type="text"
                            value={``}
                            onKeyPress={() =>
                              console.log(review.current?.value)
                            }
                          ></IonInput>
                        </IonItem>
                        <IonCard
                          style={{ "max-height": "75%", "min-height": "60%" }}
                        >
                          <IonCardHeader>Message</IonCardHeader>
                          <IonCardContent id="text">
                            {reviewMessage}
                          </IonCardContent>
                        </IonCard>
                        <IonFooter>
                          <IonToolbar>
                            <IonButton
                              onClick={() => setShowModal(false)}
                              slot="end"
                              color="danger"
                            >
                              close
                            </IonButton>
                            <IonButton slot="end">Confirm</IonButton>
                          </IonToolbar>
                        </IonFooter>
                      </IonContent>
                    </IonModal>
                  </IonCard>
                </div>
                <div className="status">
                  <h1>Level of Plagiarism</h1>
                  <h5>3 suspected copies</h5>
                </div>

                <div className="results-holder">
                  <div className="result-item">
                    <IonToolbar className="results-item">
                      <IonTitle>Tabi FE18A008</IonTitle>
                      <IonTitle slot="end">20 Copies</IonTitle>
                      <IonButton slot="end" fill="outline" color="success">
                        view
                      </IonButton>
                    </IonToolbar>
                    <IonProgressBar
                      className="pg-bar"
                      color="primary"
                      value={0.5}
                    ></IonProgressBar>
                  </div>
                  <div className="result-item">
                    <IonToolbar className="results-item">
                      <IonTitle>Tabi FE18A008</IonTitle>
                      <IonTitle slot="end">20 Copies</IonTitle>
                      <IonButton slot="end" fill="outline" color="success">
                        view
                      </IonButton>
                    </IonToolbar>
                    <IonProgressBar
                      className="pg-bar"
                      color="primary"
                      value={0.5}
                    ></IonProgressBar>
                  </div>
                  <div className="result-item">
                    <IonToolbar className="results-item">
                      <IonTitle>Tabi FE18A008</IonTitle>
                      <IonTitle slot="end">20 Copies</IonTitle>
                      <IonButton slot="end" fill="outline" color="success">
                        view
                      </IonButton>
                    </IonToolbar>
                    <IonProgressBar
                      className="pg-bar"
                      color="primary"
                      value={0.5}
                    ></IonProgressBar>
                  </div>
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
