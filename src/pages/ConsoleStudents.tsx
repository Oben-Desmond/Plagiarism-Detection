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
import React, { useRef, useState } from "react";
import {
  add,
  addCircle,
  arrowBack,
  arrowBackCircle,
  cloudUpload,
  document,
  play,
  reader,
} from "ionicons/icons";
import img from "../images/img.png";
import pdfLogo from "../images/pdfLogo.svg";

import "../css/console.css";

const ConsoleStudents: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [reviewMessage, setreviewMessage] = useState(
    "Writren review will appear..."
  );
  const review = useRef<HTMLIonInputElement>(null);
  const upload = useRef<HTMLInputElement>(null);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="tb-console">
          <IonIcon
            color="success"
            slot="start"
            size="large"
            icon={arrowBackCircle}
          ></IonIcon>
          <IonText slot="start" color="success">
            LogOut <IonText color="dark">/ Projects</IonText>
          </IonText>
          <IonTitle slot="end">Oben Desmond</IonTitle>
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
                <div style={{ width: "90%", margin: "10px auto" }}>
                  <div className="lp-titles">
                    <IonText color="success">
                      <h1>
                        Projects for{" "}
                        <IonText color="dark">2nd Semester</IonText> 2021
                      </h1>
                    </IonText>
                    <IonButton
                      size="large"
                      fill="solid"
                      color="primary"
                      expand="block"
                      style={{ "margin-top": "30px" }}
                      onClick={() => {
                        upload.current?.click();
                      }}
                    >
                      <IonIcon slot="start" icon={cloudUpload}></IonIcon>
                      upload paper
                    </IonButton>
                  </div>
                  <input
                    type="file"
                    ref={upload}
                    name="file"
                    id="uploadFile"
                    style={{ display: "none" }}
                  />
                </div>
                <div className="item-holder">
                  <IonItem lines="inset">
                    <IonImg slot="start" src={pdfLogo}></IonImg>
                    {/* <IonAvatar slot="start">
                    </IonAvatar> */}
                    <div className="lh">
                      <IonText>
                        <h5>LOTOS Verificaton of Bubble Sort</h5>
                      </IonText>
                    </div>
                  </IonItem>
                  <IonItem lines="inset">
                    <IonImg slot="start" src={pdfLogo}></IonImg>
                    {/* <IonAvatar slot="start">
                    </IonAvatar> */}
                    <div className="lh">
                      <IonText>
                        <h5>LOTOS Verificaton of Bubble Sort</h5>
                      </IonText>
                    </div>
                  </IonItem>
                  <IonItem lines="inset">
                    <IonImg slot="start" src={pdfLogo}></IonImg>
                    {/* <IonAvatar slot="start">
                    </IonAvatar> */}
                    <div className="lh">
                      <IonText>
                        <h5>LOTOS Verificaton of Bubble Sort</h5>
                      </IonText>
                    </div>
                  </IonItem>
                </div>
              </div>
            </IonCol>
            <IonCol sizeMd="9">
              <div className="holder">
                <IonItem lines="full">
                  <div slot="start">
                    <h1>Software Verification and Validation</h1>
                    <h6>
                      <i>Date Submitted</i>
                    </h6>
                  </div>
                  <div slot="end">
                    {/* <IonButton style={{'display':'none'}} className="sr-button">send review</IonButton> */}
                    <h6>12 JUNE 2021</h6>
                  </div>
                </IonItem>
                <IonItem lines="full">
                  <div slot="start">
                    <h1>Tutor</h1>
                  </div>
                  <div slot="end">
                    <h1>Mme Tsague</h1>
                  </div>
                </IonItem>
                <IonItem lines="full">
                  <div slot="start">
                    <h1>Status</h1>
                  </div>
                  <div slot="end">
                    <h1>
                      <IonText color="danger">rejected</IonText>
                    </h1>
                  </div>
                </IonItem>
                <div className="rm-area">
                  <IonCard color="light">
                    <IonCardHeader>
                      <IonCardTitle>
                        <b>
                          <IonText color="success"> Review Message</IonText>
                        </b>
                      </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Sint nisi est placeat qui maiores. Amet eos qui, placeat
                      officia nobis dolorum dolor perferendis ullam magnam sed
                      quis, aut nemo veritatis.
                    </IonCardContent>
                  </IonCard>

                  <div style={{'width':'40%', margin: "30px auto" }}>
                    <IonButton
                      size="large"
                      fill="solid"
                      color="primary"
                      expand="block" 
                    > 
                      <IonIcon slot="start" icon={reader}></IonIcon> Open
                      Document
                    </IonButton>
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

export default ConsoleStudents;
