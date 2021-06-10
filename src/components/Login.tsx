import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCol,
    IonInput,
    IonLabel,
    IonPage,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import React from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import app from "../Firebase";

import "../css/login.css";
import { Plugins } from "@capacitor/core";
import { useHistory } from "react-router";


const { Storage } = Plugins

const StudentLogin: React.FC = () => {
    return (
        <IonPage>
            <div className="containerStudent">
                <div className="overlay">
                    <div className="content">
                        <IonText color="light" className="login-welcome-message">
                            Best world wide student submission platform for your reports.{" "}
                            <IonText color="success">Sign Up with google</IonText> to access
                  your dashboard and begin report submission
                </IonText>
                        <IonRow className="row">
                            <IonCol></IonCol>
                            <IonCol sizeLg="5">
                                <div className="center-col">
                                    <div className="center-text">
                                        <IonText color="dark">
                                            Student Sign In with{" "}
                                            <IonText
                                                color="success"
                                                style={{ fontWeight: "bolder" }}
                                            >
                                                GOOGLE
                          </IonText>
                                        </IonText>
                                    </div>
                                    <div className="button">

                                    </div>
                                </div>
                            </IonCol>
                            <IonCol></IonCol>
                        </IonRow>
                    </div>
                </div>
            </div>
        </IonPage>
    );
};

export default StudentLogin;

export const TeacherLogin: React.FC = () => {

    const history = useHistory()

    // Configure FirebaseUI.
    const uiConfig: firebaseui.auth.Config = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
        signInSuccessUrl: '/signedIn',
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            app.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: (res) => {
                validateSignIn(res)

                return false

            }

        },
    };

    async function validateSignIn(res: any) {
        const user: app.User = res.user
        const { photoURL, email, displayName } = user
        if (!email) return false;
        const resDoc = await app.firestore().collection(`teachers`).doc(email).get()
        if (resDoc.data()?.name && resDoc.exists) {
            Storage.set({ key: `google-teacher`, value: JSON.stringify({ photoURL, email, displayName }) })
            history.push(`/console-teacher`)
        }
        else {
            alert(`Sorry it seems you are not yet a registered teacher. Please Create an Account to continue`)
            history.push(`/teacher-signup`)
        }
    }


    return (
        <>
            <IonPage>
                <div className="containerStudent">
                    <div className="overlay">
                        <div className="content">
                            <IonText color="light" className="login-welcome-message">
                                A super suffisticated project submission repo with{" "}
                                <IonText color="success">plagiarism detection</IonText> built
                  in.
                </IonText>
                            <IonRow className="row">
                                <IonCol></IonCol>
                                <IonCol sizeLg="5">
                                    <div className="center-col center-text">
                                        Teacher Sign In
                       <IonCardContent>
                                            <StyledFirebaseAuth firebaseAuth={app.auth()} uiConfig={uiConfig}></StyledFirebaseAuth>
                                        </IonCardContent>
                                    </div>
                                </IonCol>
                                <IonCol></IonCol>
                            </IonRow>
                        </div>
                    </div>
                </div>
            </IonPage>
        </>
    );
};

export const SignUpTeacher: React.FC = () => {
    return (
        <>
            <IonPage>
                <div className="signup-container">
                    <div className="overlay">
                        <div className="su-container">
                            <IonToolbar class="su-toolbar">
                                <IonButton
                                    className="su-bu"
                                    slot="end"
                                    color="success"
                                    fill="clear"
                                    routerLink='/teacher-login'
                                >
                                    Login
                </IonButton>
                            </IonToolbar>
                            <IonCard className="su-card">
                                <IonCardContent>
                                    <IonTitle color='light' ion-padding>SignUp/<IonText color='success'>Teacher</IonText></IonTitle>
                                    <div className="su-card-content">
                                        <IonInput placeholder="Name" type="text"></IonInput>
                                        <IonInput placeholder="Faculty" type="text"></IonInput>
                                        <IonInput placeholder="Department" type="text"></IonInput>
                                        <IonInput placeholder="Email" type="email"></IonInput>
                                        <IonInput placeholder="Password" type="password"></IonInput>
                                    </div>
                                    <IonButton class="su-but" expand='full'>sign up</IonButton>
                                </IonCardContent>
                            </IonCard>
                        </div>
                    </div>
                </div>
            </IonPage>
        </>
    );
};

export const SignUpStudent: React.FC = () => {
    return (
        <>
            <IonPage>
                <div className="signup-container">
                    <div className="overlay">
                        <div className="su-container">
                            <IonToolbar class="su-toolbar">
                                <IonButton
                                    className="su-bu"
                                    slot="end"
                                    color="success"
                                    fill="clear"
                                    routerLink='/student-login'
                                >
                                    Login
                  </IonButton>
                            </IonToolbar>
                            <IonCard className="su-card">
                                <IonCardContent>
                                    <IonTitle color='light' ion-padding>SignUp/<IonText color='success'>student</IonText></IonTitle>
                                    <div className="su-card-content">
                                        <IonInput placeholder="Name" type="text"></IonInput>
                                        <IonInput placeholder="Faculty" type="text"></IonInput>
                                        <IonInput placeholder="Department" type="text"></IonInput>
                                        <IonInput placeholder="matricule" type="text"></IonInput>
                                        <IonInput placeholder="Email" type="email"></IonInput>
                                    </div>
                                    <IonButton class="su-but" expand='full'>sign up</IonButton>
                                </IonCardContent>
                            </IonCard>
                        </div>
                    </div>
                </div>
            </IonPage>
        </>
    );
};
