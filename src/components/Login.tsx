import {
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonChip,
    IonCol,
    IonContent,
    IonGrid,
    IonIcon,
    IonInput,
    IonLabel,
    IonLoading,
    IonPage,
    IonRow,
    IonSlide,
    IonSlides,
    IonText,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import { StyledFirebaseAuth } from "react-firebaseui";
import app from "../Firebase";

import "../css/login.css";
import { Plugins } from "@capacitor/core";
import { useHistory } from "react-router";
import { addedCourse, StudentProfile, TeacherProfile } from "./interfaces/document";
import { close } from "ionicons/icons";
import { removeOccurence } from "./Funcions/Home/general";

const treeimage = `https://i.pinimg.com/originals/bd/6c/0b/bd6c0bef4a473bfca44d1f6c83c95006.png`
const { Storage } = Plugins

const StudentLogin: React.FC = () => {
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
        const resDoc = await app.firestore().collection(`students`).doc(email).get()
        if (resDoc.data()?.name && resDoc.exists) {
            Storage.set({ key: `google-student`, value: JSON.stringify({ photoURL, email, displayName }) })
            history.push(`/console-student`)
        }
        else {
            alert(`Sorry it seems you are not yet a registered student. Please Create an Account to continue`)
            history.push(`/student-signup`)
        }
    }
    return (
        <IonPage>
            <IonContent>
                <IonGrid>
                    <div className="containerStudent" style={{ height: `100vh` }}>
                        <div className="overlay">
                            <div className="content">
                                <IonText color="light" className="login-welcome-message">
                                    Best world wide student submission platform for your reports.{" "}
                                    <IonText color="success">Sign Up with google</IonText> to access
                  your dashboard and begin report submission
                </IonText>

                                <IonRow  >
                                    <IonCol></IonCol>
                                    <IonCol size={`9`}>

                                        <IonCard>
                                            <IonCardContent>
                                                <IonText color="dark">
                                                    Student Sign In with{" "}
                                                    <IonText
                                                        color="success"
                                                        style={{ fontWeight: "bolder" }}
                                                    >
                                                        GOOGLE
                                        </IonText>
                                                </IonText>
                                            </IonCardContent>
                                            <StyledFirebaseAuth firebaseAuth={app.auth()} uiConfig={uiConfig}></StyledFirebaseAuth>
                                        </IonCard>
                                    </IonCol>
                                    <IonCol></IonCol>
                                </IonRow>
                            </div>
                        </div>
                    </div>
                </IonGrid>
            </IonContent>


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
    const history = useHistory()
    const [addedCourses, setaddedCourses] = useState<addedCourse[]>([])
    const [email, setemail] = useState<string>()

    const [loading, setloading] = useState(false);
    const slidesRef = useRef<HTMLIonSlidesElement>(null)

    async function submitSignup(event: any) {
        event.preventDefault()
        const name = event.target.name.value;
        const email = event.target.email.value;
        if (!email) return;
        setemail(email)
        const credential: TeacherProfile = { name, email }
        setloading(true)
        const snapshot = await app.firestore().collection(`teacher`).doc(credential.email).get()
        console.log(snapshot)
        if (snapshot.data()?.email) {
            Storage.set({ key: `google-teacher`, value: JSON.stringify({ photoURL: treeimage, email, displayName: name }) })
            history.push(`/teacher-login`)
            setloading(false)
            return
        }

        const photoURL = snapshot.data()?.photoURL
        app.firestore().collection(`teachers`).doc(credential.email).set(credential)
        Storage.set({ key: `google-teacher`, value: JSON.stringify({ photoURL: photoURL ? photoURL : treeimage, email, displayName: name }) })
        slidesRef.current?.slideNext()
        setloading(false)

    }

    async function addThisCourse(event: any | { preventDefault: () => void; target: { title: { value: string | undefined; }; code: { value: string | undefined; }; faculty: { value: string | undefined; }; department: { value: string | undefined; }; }; }) {
        event.preventDefault()
        const title = event.target.title.value.toString().trim()
        const code = removeOccurence(event.target.code.value, [` `])
        const faculty = removeOccurence(event.target.faculty.value, [` `])
        const department = removeOccurence(event.target.department.value, [` `])
        const year = (new Date()).getFullYear()+``
        const name = title
        const credential = { name, code, department, year, faculty }
        setaddedCourses([...addedCourses, credential])
        event.target.title.value = ``
        event.target.code.value = ``
    }

    async function uploadCourses() {
        if (!email) { slidesRef.current?.slidePrev(); return }
        if (addedCourses.length <= 0) {
            alert(`you must add atleat one course`)
            return;
        }
        for (let i in addedCourses) {
            let course = addedCourses[i], code = addedCourses[i].code;
            if (+i >= addedCourses.length - 1) {
                await app.firestore().collection(`teachers`).doc(email).collection(`courses`).doc(code).set(course)
                history.push(`/console-teacher`)
            }
            else
                app.firestore().collection(`teachers`).doc(email).collection(`courses`).doc(code).set(course)
        }
        return
    }
    function removeAddedCourse(index: number) {
        const temp = addedCourses
        temp.splice(index, 1)
        setaddedCourses([...temp])
    }

    return (
        <>
            <IonPage>
                <IonLoading onDidDismiss={() => setloading(false)} isOpen={loading} message={`please hold on...`}></IonLoading>
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
                            <IonSlides ref={slidesRef}>
                                <IonSlide>
                                    <IonCard className="su-card">
                                        <IonCardContent>
                                            <IonTitle color='light' ion-padding>SignUp/<IonText color='success'>Teacher</IonText></IonTitle>
                                            <form onSubmit={submitSignup}>
                                                <div className="su-card-content">
                                                    <IonInput required name={`name`} placeholder="Name" type="text"></IonInput>
                                                    <IonInput required name={`email`} placeholder="Enter Gmail account" type="email"></IonInput>
                                                </div>
                                                <IonButton type={`submit`} class="su-but" expand='full'>sign up</IonButton>
                                            </form>
                                        </IonCardContent>
                                    </IonCard>
                                </IonSlide>
                                <IonSlide>
                                    <IonCard className="su-card">
                                        <IonCardContent>
                                            <IonTitle color='light' ion-padding>add atleast one course to get started</IonTitle>
                                            <form onSubmit={addThisCourse}>
                                                <IonToolbar color={`none`}>
                                                    {
                                                        addedCourses.map((course, index) => {
                                                            return (
                                                                <IonChip key={index}>
                                                                    <IonLabel>{course.name}  {course.code}</IonLabel>
                                                                    <IonIcon onClick={() => removeAddedCourse(index)} icon={close}></IonIcon>
                                                                </IonChip>
                                                            )
                                                        })
                                                    }
                                                </IonToolbar>
                                                <div className="su-card-content">
                                                    <IonInput required name={`title`} placeholder="Course title" type="text"></IonInput>
                                                    <IonInput required name={`code`} placeholder="Course code" type="text"></IonInput>
                                                    <IonInput required name={`faculty`} placeholder="Course faculty" type="text"></IonInput>
                                                    <IonInput required name={`department`} placeholder="Course department" type="text"></IonInput>
                                                </div>
                                                <IonGrid>
                                                    <IonRow>
                                                        <IonCol>
                                                            <IonButton type={`submit`} class="su-but" expand='full'>add</IonButton>
                                                        </IonCol>
                                                        <IonCol>
                                                            <IonButton onClick={uploadCourses} color={`dark`} expand='full'>DONE</IonButton>

                                                        </IonCol>
                                                    </IonRow>
                                                </IonGrid>
                                            </form>
                                        </IonCardContent>
                                    </IonCard>
                                </IonSlide>
                            </IonSlides>
                        </div>
                    </div>
                </div>

            </IonPage>
        </>
    );
};

export const SignUpStudent: React.FC = () => {
    const history = useHistory()

    const [loading, setloading] = useState(false);
    const slidesRef = useRef<HTMLIonSlidesElement>(null)


    async function submitSignup(event: any | { preventDefault: () => void; target: { name: { value: string; }; faculty: { value: string; }; email: { value: string; }; matricle: { value: string; } }; }) {
        event.preventDefault()
        const name = event.target.name.value;
        const email = event.target.email.value;
        const faculty = event.target.faculty.value;
        const matricle = event.target.matricle.value;
        const department = event.target.department.value;

        const credential: StudentProfile = { name, email, faculty, matricle, department }
        setloading(true)
        const snapshot = await app.firestore().collection(`students`).doc(credential.email).get()
        console.log(snapshot)
        if (snapshot.data()?.email) {
            Storage.set({ key: `google-student`, value: JSON.stringify({ photoURL: treeimage, email, displayName: name }) })
            history.push(`/student-login`)
            setloading(false)
            return
        }

        const photoURL = snapshot.data()?.photoURL
        app.firestore().collection(`students`).doc(credential.email).set(credential)
        Storage.set({ key: `google-student`, value: JSON.stringify({ photoURL: photoURL ? photoURL : treeimage, email, displayName: name }) })
        slidesRef.current?.slideNext()
        setloading(false)
        event.target.name.value=``;
        event.target.email.value=``;
        event.target.faculty.value=``;
        event.target.matricle.value=``;
        event.target.department.value=``;
        history.push(`/student-login`)
    }
    return (
        <>
            <IonPage>
                <IonLoading message={`please hold on...`} onDidDismiss={() => setloading(false)} isOpen={loading}></IonLoading>
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
                                    <form onSubmit={submitSignup}>
                                        <div className="su-card-content">
                                            <IonInput required name={`name`} placeholder="Name" type="text"></IonInput>
                                            <IonInput required name={`faculty`} placeholder="Faculty" type="text"></IonInput>
                                            <IonInput required name={`department`} placeholder="Department" type="text"></IonInput>
                                            <IonInput required name={`matricle`} placeholder="matricle" type="text"></IonInput>
                                            <IonInput required name={`email`} placeholder="Email" type="email"></IonInput>
                                        </div>
                                        <IonButton type={`submit`} expand='full'>sign up</IonButton>
                                    </form>
                                </IonCardContent>
                            </IonCard>
                        </div>
                    </div>
                </div>
            </IonPage>
        </>
    );
};
