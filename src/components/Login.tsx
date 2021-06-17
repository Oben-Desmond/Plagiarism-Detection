import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonImg,
  IonInput,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";

import "../css/login.css";
import pdfLogo from "../images/pdfLogo.svg";

const StudentLogin: React.FC = () => {
  return (
    <>
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
                      <IonButton href="/console-student" size="large">
                        Sign in with google
                      </IonButton>
                    </div>
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

export default StudentLogin;

export const TeacherLogin: React.FC = () => {
  return (
    <>
      <IonPage>
        <div className="containerTeacher">
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
                  <div className="center-col">
                    <div className="center-text">
                      <IonText color="dark">
                        Teacher Sign In with{" "}
                        <IonText
                          color="success"
                          style={{ fontWeight: "bolder" }}
                        >
                          GOOGLE
                        </IonText>
                      </IonText>
                    </div>
                    <div className="button">
                      <IonButton href="/console-teacher" size="large">
                        Sign in with google
                      </IonButton>
                    </div>
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
        <div className="signup-container-teacher">
          <div className="overlay">
            <div className="su-container">
              <IonToolbar class="su-toolbar">
              <IonText slot="end" color='light' style={{'padding-right':'30px'}}>Already have and account? </IonText>
                <IonButton
                  className="su-bu"
                  slot="end"
                  color="success"
                  fill="clear"
                  href="/teacher-login"
                >
                  Login
                </IonButton>
              </IonToolbar>
              <IonCard className="su-card">
              <div className="logo-box">
                <div>
                  <IonImg className="logo" src={pdfLogo}></IonImg>
                </div>
                <div className="logo-text">Plagiarism 
                  <IonText color="success">Detector</IonText>
                </div>
              </div>
                <IonCardContent>
                  <IonTitle color="light" ion-padding>
                    SignUp/<IonText color="success">Teacher</IonText>
                  </IonTitle>
                  <div className="su-card-content">
                    <IonInput placeholder="Name" type="text"></IonInput>
                    <IonInput placeholder="Faculty" type="text"></IonInput>
                    <IonInput placeholder="Department" type="text"></IonInput>
                    <IonInput placeholder="Email" type="email"></IonInput>
                    <IonInput placeholder="Password" type="password"></IonInput>
                  </div>
                  <IonButton class="su-but" expand="full">
                    sign up
                  </IonButton>
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
        <div className="signup-container-student">
          <div className="overlay">
            <div className="su-container">
              <IonToolbar class="su-toolbar">
                <IonText slot="end" color='light' style={{'padding-right':'30px'}}>Already have and account? </IonText>
                <IonButton
                  className="su-bu"
                  slot="end"
                  color="success"
                  fill="clear"
                  href="/student-login"
                >
                  Login
                </IonButton>
              </IonToolbar>
              <IonCard className="su-card">
              <div className="logo-box">
                <div>
                  <IonImg className="logo" src={pdfLogo}></IonImg>
                </div>
                <div className="logo-text">Plagiarism 
                  <IonText color="success">Detector</IonText>
                </div>
              </div>
                <IonCardContent>
                  <IonTitle color="light" ion-padding>
                    SignUp/<IonText color="success">student</IonText>
                  </IonTitle>
                  <div className="su-card-content">
                    <IonInput placeholder="Name" type="text"></IonInput>
                    <IonInput placeholder="Faculty" type="text"></IonInput>
                    <IonInput placeholder="Department" type="text"></IonInput>
                    <IonInput placeholder="matricule" type="text"></IonInput>
                    <IonInput placeholder="Email" type="email"></IonInput>
                  </div>
                  <IonButton class="su-but" expand="full">
                    sign up
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </div>
          </div>
        </div>
      </IonPage>
    </>
  );
};
