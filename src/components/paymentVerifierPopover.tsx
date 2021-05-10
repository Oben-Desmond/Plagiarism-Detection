import { IonPopover, IonContent, IonGrid, IonRow, IonCol, IonSpinner, IonCardContent, IonLabel, IonNote, IonIcon, IonButton, IonBackdrop } from "@ionic/react";
import { checkmarkDoneCircleOutline, closeCircleOutline } from "ionicons/icons";
import React from "react";


const PaymentVerifierPopover:React.FC<{onDidDismiss:() =>void, isOpen:boolean,paymentStatus:`pending`|boolean, retryTransaction:()=>void}>=({onDidDismiss,isOpen,paymentStatus, retryTransaction})=>{


    return(
        <IonPopover animated onDidDismiss={onDidDismiss} isOpen={isOpen}>
        <IonContent>
            {paymentStatus == `pending` && <IonGrid>
                <IonRow>
                    <IonCol></IonCol>
                    <IonCol style={{ textAlign: `center` }}>
                        <IonSpinner color={`primary`}></IonSpinner>
                    </IonCol>
                    <IonCol></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol style={{ textAlign: `center` }}>
                        <IonCardContent>
                            <IonLabel>Verifying Payment </IonLabel> <br />
                            <IonNote>please wait a moment...</IonNote>
                        </IonCardContent>
                    </IonCol>
                </IonRow>
            </IonGrid>}
            {paymentStatus == true && <IonGrid>
                <IonRow>
                    <IonCol style={{ textAlign: `center` }}>
                        <IonCardContent>
                            <IonLabel>Payment verified <IonIcon color={`primary`} style={{ transform: `scale(1.4)` }} icon={checkmarkDoneCircleOutline} /> </IonLabel> <br />
                            <div style={{ paddingTop: `0.5px` }}>.</div>
                            <IonNote>you can now access your papers at anytime on the platform</IonNote><br />
                            <div style={{ paddingTop: `0.5px` }}>.</div>
                            <IonButton shape={`round`}>
                                <IonBackdrop></IonBackdrop>
                                <IonLabel>Ok</IonLabel>
                            </IonButton>
                        </IonCardContent>
                    </IonCol>
                </IonRow>
            </IonGrid>}
            {paymentStatus == false && <IonGrid>
                <IonRow>
                    <IonCol style={{ textAlign: `center` }}>
                        <IonCardContent>
                            <IonLabel>Payment Unconfirmed <IonIcon slot={`end`} color={`danger`} style={{ transform: `scale(1.4)` }} icon={closeCircleOutline} /> </IonLabel>
                            <div style={{ paddingTop: `0.5px` }}>.</div>
                            <IonNote className={`ion-margin-vertical`}>payment has not been made. please dial *126# for MTN or #150*50# for orange to confirm transaction, then click Retry</IonNote><br />
                            <div style={{ paddingTop: `0.5px` }}>.</div>
                            <IonButton onClick={()=>retryTransaction()} color={`danger`} shape={`round`}>Retry</IonButton>
                            <IonButton color={`medium`} fill={`outline`} shape={`round`}>
                                <IonBackdrop></IonBackdrop>
                                <IonLabel>Cancel</IonLabel>
                            </IonButton>
                        </IonCardContent>
                    </IonCol>
                </IonRow>
            </IonGrid>}
        </IonContent>
    </IonPopover>
    )
}


export default PaymentVerifierPopover