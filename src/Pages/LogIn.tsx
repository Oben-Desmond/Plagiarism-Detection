import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonProgressBar, IonSlide, IonSlides, IonSpinner, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react'
import { FirebaseAuth, StyledFirebaseAuth } from 'react-firebaseui';
import app from '../Firebase';
import '../css/signin.css';
import { Modals, Plugins } from '@capacitor/core';
import { userInterface } from '../components/componentTypes';
import { useHistory } from 'react-router';

const { Storage } = Plugins

const LogIn: React.FC = () => {

    const [tel, settel] = useState<string>(``)
    const [name, setname] = useState<string>(``)
    const [showFireUi, setshowFireUi] = useState<boolean>(false)
    const [showName, setshowName] = useState(false)
    const [searching, setsearching] = useState(false)
    const slidesRef = useRef<HTMLIonSlidesElement>(null)

    const history = useHistory()
 
    const uiConfig: firebaseui.auth.Config = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/validate',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            //   app.auth.GoogleAuthProvider.PROVIDER_ID,
            {   //   app.auth.FacebookAuthProvider.PROVIDER_ID,
                provider: app.auth.PhoneAuthProvider.PROVIDER_ID,
                recaptchaParameters: {
                    type: 'image', // 'audio'
                    size: 'invisible', // 'invisible' or 'compact'
                    badge: 'bottomleft' //' bottomright' or 'inline' applies to invisible.
                },
                defaultCountry: `CM`,
                defaultNationalNumber: tel,


            }
        ],
        callbacks: {
            signInSuccessWithAuthResult: (authResult: any, redirectURL: string) => {
                if (authResult) {
                    let user: app.User = (authResult).user = authResult.user
                    const phone = user.phoneNumber
                    if (phone) {
                        
                        const u: userInterface = { tel: phone, name, validate: `pending` }
                        Storage.set({ key: `user`, value: JSON.stringify(u) }).then(() => {
                           history.push(`/validate`)
                        })
                    }else{
                        const title=`Error`, message=`An error occured try again`;
                        Modals.alert({title,message})
                        // history.push(`/validate`)
                    }

                }
                return false
            }
        }

    };


    function verifyExistence() {
        if (tel == ``) return

        setsearching(true)
        app.firestore().collection(`users`).doc(`+237`+tel).get().then((doc) => {
            if (doc.exists) {

                const data: { name: string } | undefined | any = doc.data()
                
                if (data.name) {
                   
                    setname(data.name)
                    Storage.set({ key: `user`, value: JSON.stringify({ name: data.name, validate: false, tel }) })
                    setshowName(false)
                    slidesRef.current?.slideTo(2)
                    setshowFireUi(true)
                }
                else {
                    setshowName(true)
                    slidesRef.current?.slideTo(1)
                }
               
            }
            else {
                setshowName(true)
                slidesRef.current?.slideTo(1)
            }
            setsearching(false)
        }).catch(err => {

            if (err.code == `unavailable`) {
                Modals.alert({ title: `Connection Error`, message: `Please Check your connection and try again` })
                
            }
            else {
                Modals.alert({ title: `Sign in Error`, message: `an Error occured while signing in. please try again` })

            }

            setsearching(false)
        })
    }
  const verifyNum = () => {
        const user: userInterface = { name, validate: `pending`, tel }
        Storage.set({ key: `user`, value: JSON.stringify(user) })
         setshowFireUi(true)
        slidesRef.current?.slideTo(2)
    }

    useEffect(() => {
        //    verifyExistence() 
      app.auth().settings.appVerificationDisabledForTesting=false;

    }, [])

    return (
        <IonPage>
            <IonHeader>
                <IonHeader>
                    <IonToolbar color='dark'>
                        <IonTitle>Ques<IonLabel color='success'>ers</IonLabel></IonTitle>
                    </IonToolbar>
                </IonHeader>
            </IonHeader>
            {searching && <IonProgressBar type={`indeterminate`} />}
            <IonContent>
                <IonToolbar className="ion-padding">
                    <IonTitle >Sign <IonLabel color='success'>In</IonLabel></IonTitle>
                </IonToolbar>
                <IonSlides ref={slidesRef} className={`login-slides`}>
                    <IonSlide>
                        <IonToolbar className={`ion-padding-horizontal`}>
                            <IonItem>
                                <IonLabel position={`floating`}>Enter phone number</IonLabel>
                                <IonInput value={tel} onIonChange={(e) => settel(e.detail.value ? e.detail.value : ``)} type={`tel`}></IonInput>
                            </IonItem>
                        </IonToolbar>
                        <IonToolbar className={`ion-padding`}>
                            <IonButton onClick={() => verifyExistence()} disabled={tel.length < 7} > Next</IonButton>
                        </IonToolbar>
                    </IonSlide>
                    <IonSlide>
                        {showName &&
                            <IonToolbar className={`ion-padding-horizontal`} >
                                <IonItem>
                                    <IonLabel position={`floating`}>Please Enter Username</IonLabel>
                                    <IonInput onIonChange={(e) => setname(e.detail!.value + ``)} value={name} ></IonInput>
                                </IonItem>
                                <IonToolbar className={`ion-padding`}>
                                    <IonButton onClick={verifyNum} disabled={name?.length < 1} > Next</IonButton>
                                </IonToolbar>
                            </IonToolbar>
                        }
                    </IonSlide>
                    <IonSlide>
                        {showFireUi && <StyledFirebaseAuth className={`fire-signin`} uiConfig={uiConfig} firebaseAuth={app.auth()} />}
                    </IonSlide>
                </IonSlides>
            </IonContent>
        </IonPage>
    );
};

export default LogIn;