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
  IonNote,
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
import pdfLogo from "../images/image 4.png";

import "../css/console.css";
import { docBlockInterface, documentData, StudentProfile } from "../components/interfaces/document";
import { downloadReports, getStudentInfo } from "../components/Funcions/Home/student";
import StudentReportItem from "../components/studentReportItem";
import StudentReportDetail from "../components/StudentReportDetail";
import { Plugins } from "@capacitor/core";
import { useHistory } from "react-router";
import StudentAddProject from "../components/StudentAddProject";
import { splitSentence } from "../components/Funcions/Home/home";

const { Storage } = Plugins
const ConsoleStudents: React.FC = () => {

  const [studentInfo, setstudentInfo] = useState<StudentProfile>()

  const history = useHistory()
  const [showModal, setShowModal] = useState(false);
  const [addProject, setaddProject] = useState(false);
  const [reviewMessage, setreviewMessage] = useState(
    "Written review will appear..."
  );

  const [reports, setreports] = useState<documentData[]>([])
  const [docIndex, setdocInndex] = useState(0)


  const review = useRef<HTMLIonInputElement>(null);
  const upload = useRef<HTMLInputElement>(null);


  useEffect(() => {
    getProjects();

  }, [])


  async function getProjects() {

    const studentStr = (await Storage.get({ key: `google-student` })).value

    if (studentStr) {
      const student: StudentProfile = JSON.parse(studentStr)
      initializeStudent(student.email)

    }
    else {
      history.push(`/student-signup`)
    }

  }

  async function initializeStudent(email: string) {
    if (email) {
      const tempstudent: StudentProfile | any = await getStudentInfo(email)
      if (tempstudent?.matricle) {
        setstudentInfo(tempstudent)
        downloadReports(tempstudent, (rpts:documentData[])=>setreports(rpts))
    
      } return

    }
    alert(`no email`)

  }



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
          <IonTitle slot="end">{studentInfo?.name}</IonTitle>
          <IonNote>{studentInfo?.matricle}</IonNote>
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
                    <IonItem  >
                      {studentInfo?.faculty.toUpperCase() + `/ ` + studentInfo?.department}
                    </IonItem>
                    <IonButton
                      size="large"
                      fill="solid"
                      color="primary"
                      expand="block"
                      style={{ "margin-top": "30px" }}
                      onClick={() => {
                        setaddProject(true)
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
                  {
                    reports.map((report, index) => {
                      return (
                        <div key={index} onClick={() => setdocInndex(index)}>
                          <StudentReportItem document={report}></StudentReportItem>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </IonCol>
            {reports.length > 0 && <StudentReportDetail doc={reports[docIndex]} ></StudentReportDetail>}
          </IonRow>
        </IonGrid>
      </IonContent>
      {studentInfo && <StudentAddProject student={studentInfo} onDidDismiss={() => setaddProject(false)} isOpen={addProject}> </StudentAddProject>}
    </IonPage>
  );
};

export default ConsoleStudents;
