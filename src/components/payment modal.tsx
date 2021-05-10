import { IonModal, IonHeader, IonToolbar, IonLabel, IonBadge, IonButtons, IonButton, IonBackdrop, IonIcon, IonContent, IonText, IonSpinner, IonGrid, IonRow, IonCol } from "@ionic/react";
import { close } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import CheckoutQuestionCard from "./checkoutQuestionCard";
import { localPendingPapers, SearchPaperInterface, userInterface } from "./componentTypes";
import "./style/checkoutModal.css";
import { Plugins } from "@capacitor/core";
import "../zitopay";


const { Storage } = Plugins
const PaymentModal: React.FC<{ cost: string, onDidDismiss: () => void, isOpen: boolean, reference: string }> = ({ onDidDismiss, isOpen, cost, reference }) => {

    const colors = [`dark`, `warning`, `success`, `medium`, `danger`]
    const paybtnRef = useRef<HTMLDivElement>(null)
    const [change, setchange] = useState(0)
    const [spinnerColor, setspinnerColor] = useState(`dark`)

    useEffect(() => {

    }, [isOpen])



    return (
        <IonModal onDidPresent={() => { paybtnRef.current?.click(); }} mode='ios' cssClass="cart-modal" onDidDismiss={onDidDismiss} isOpen={isOpen}>
            <IonHeader mode='md'>
                <IonToolbar  >
                    <IonLabel> Confirm Payment <IonBadge color='success' mode='ios'>{cost}</IonBadge></IonLabel>
                    <IonButtons slot='end'>
                        <IonBackdrop></IonBackdrop>
                        <IonButton>
                            <IonIcon icon={close} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonToolbar mode='md' style={{ minHeight: `100%`, overflow: `scroll` }} color='light'>
                    {/* <IonGrid>
                         
                        <IonRow>
                            <IonCol></IonCol>
                            <IonCol style={{textAlign:`center`}}>
                                <IonSpinner color={spinnerColor} onAnimationIteration={() => setspinnerColor(colors[Math.floor(Math.random() * 100) % colors.length])}></IonSpinner>
                            </IonCol>
                            <IonCol></IonCol>
                        </IonRow>
                    </IonGrid> */}
                    <IonToolbar style={{ minHeight: `50vh` }} color={`medium`}>
                        <div style={{ position: `relative` }} id="zitopayDiv"></div>
                        <div
                            ref={paybtnRef}
                            color="dark"
                            className="pay-with-zitopay"
                            data-amount={cost}
                            data-currency="XAF"
                            data-email="ndehngwa@gmail.com"
                            data-receiver="akumah"
                            data-ref={reference}
                            success-url="https://quesers-app.web.app"
                        ></div>
                    </IonToolbar>
                </IonToolbar>

            </IonContent>

        </IonModal>
    )
}

export default PaymentModal

