import { IonCol, IonItem, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon } from "@ionic/react";
import { reader } from "ionicons/icons";
import React from "react";
import { documentData } from "./interfaces/document";


const StudentReportDetail: React.FC<{doc:documentData}> = ({doc}) => {


    return (
        <IonCol sizeMd="9">
            <div className="holder">
                <IonItem lines="full">
                    <div slot="start">
                        <h1>{doc?.title}</h1>
                        <h6>
                            <i>submission date</i>
                        </h6>
                    </div>
                    <div slot="end">
                        {/* <IonButton style={{'display':'none'}} className="sr-button">send review</IonButton> */}
                        <h6>{(new Date(+doc?.date)).toDateString()}</h6>
                    </div>
                </IonItem>
                <IonItem lines="full">
                    <div slot="start">
                        <h1>Tutor</h1>
               
            </div>
                    <div slot="end">
                        <h1>{doc?.tutor}</h1>
                    </div>
                </IonItem>
                <IonItem lines="full">
                    <div slot="start">
                        <h1>Status</h1>
                    </div>
                    <div slot="end">
                        <h1>
                            <IonText color="danger">{doc?.status}</IonText>
                        </h1>
                    </div>
                </IonItem>
                <IonItem> 
                <div slot="start">
                        <h1>Course Code</h1>
                    </div>
                    <div slot="end">
                        <h1>
                            <IonText >{doc?.code}</IonText>
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
                            {doc?.review_message}
              </IonCardContent>
                    </IonCard>

                    <div style={{ 'width': '40%', margin: "30px auto" }}>
                        <IonButton
                          href={doc?.url}
                          target={`__blank`}
                            size="large"
                            fill="solid"
                            color="primary"
                            expand="block"
                        >
                            <IonIcon slot="start" icon={reader}></IonIcon> Open
                doc
              </IonButton>
                    </div>
                </div>
            </div>
        </IonCol>
    )
}


export default StudentReportDetail