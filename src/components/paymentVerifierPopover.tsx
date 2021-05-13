import { IonPopover, IonContent, IonGrid, IonRow, IonCol, IonSpinner, IonCardContent, IonLabel, IonNote, IonIcon, IonButton, IonBackdrop, CreateAnimation } from "@ionic/react";
import { checkmarkDoneCircleOutline, closeCircleOutline } from "ionicons/icons";
import React, { useState } from "react";


const PaymentVerifierPopover:React.FC<{onDidDismiss:() =>void, isOpen:boolean,paymentStatus:`pending`|boolean, retryTransaction:()=>void}>=({onDidDismiss,isOpen,paymentStatus, retryTransaction})=>{
    const colors = [`dark`, `warning`, `success`, `medium`, `danger`,`primary`]
    const [colorIndex, setcolorIndex] =useState(colors.length-1)
    const [animateText, setanimateText] = useState(false)
    const [showInitialText, setshowInitialText] = useState(true)
    //animtedly the color of the spinner
    function animateColors(){
       setcolorIndex((colorIndex+1)%colors.length)
       if(colorIndex === colors.length -1){
          setanimateText(true)
       }
    }

    return(
        <IonPopover animated onDidDismiss={onDidDismiss} isOpen={isOpen}>
        <IonContent>
            {paymentStatus === `pending` && <IonGrid>
                <IonRow>
                    <IonCol></IonCol>
                    <IonCol style={{ textAlign: `center` }}>
                        <IonSpinner onAnimationIteration={animateColors} color={colors[colorIndex]}></IonSpinner>
                    </IonCol>
                    <IonCol></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol style={{ textAlign: `center` }}>
                        <IonCardContent>
                            <IonLabel>Verifying Payment </IonLabel> <br />
                          {  showInitialText&&<CreateAnimation onFinish={{callback:()=>{setanimateText(false); setshowInitialText(false)}}} fromTo={[{fromValue:`1`,toValue:`0`,property:`opacity`}]} play={animateText} stop={!animateText} duration={300}>
                            <IonNote>please wait a moment...</IonNote>
                            </CreateAnimation>}
                            {  !showInitialText&&<CreateAnimation delay={500} onFinish={{callback:()=>{setanimateText(false); setshowInitialText(false)}}} fromTo={[{fromValue:`0`,toValue:`1`,property:`opacity`}]} play={animateText} stop={!animateText} duration={300}>
                            <IonNote>Thank you for using Quesers</IonNote>
                            </CreateAnimation>}
                            <br/>
                            {  !showInitialText&&<CreateAnimation delay={1000} onFinish={{callback:()=>{setanimateText(false); setshowInitialText(false)}}} fromTo={[{fromValue:`0`,toValue:`1`,property:`opacity`}]} play={animateText} stop={!animateText} duration={300}>
                            <IonNote color={colors[colorIndex]}>we love you</IonNote>
                            </CreateAnimation>}
                            
                        </IonCardContent>
                    </IonCol>
                </IonRow>
            </IonGrid>}
            {paymentStatus === true && <IonGrid>
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
            {paymentStatus === false && <IonGrid>
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