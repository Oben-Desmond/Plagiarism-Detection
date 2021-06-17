import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { play } from "ionicons/icons";
import img from "../images/img.png";

import "../css/console.css";
import { downloadCourses, getTeacherInfo } from "../components/Funcions/Home/teacher";
import { getAllDocuments } from "./Teachers/functions";
import { documentData, GoogleUser, TeacherCourseData, TeacherDownloadQuery } from "../components/interfaces/document";
import StudentProjectItem from "../components/StudentProjectItem";
import StudentProjectDetail from "../components/StudentProjectDetail";
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins
const ConsoleTeachers: React.FC = () => {

  const [teacher, setteacher] = useState<GoogleUser>({ displayName: ``, email: ``, photoURL: `` })
  const [students, setstudents] = useState<documentData[]>([])
  const [courseIndex, setcourseIndex] = useState<number>(0)
  const [selectedProject, setselectedProject] = useState<documentData>()
  const [teacherCourses, setteacherCourses] = useState<TeacherCourseData[]>([])

  useEffect(() => {

    Storage.get({ key: `google-teacher` }).then((res) => {
      if (res.value) {
        const t: GoogleUser = JSON.parse(res.value)
        setteacher(t)
        getcourses(t)
      }
    })
  }, [])
  async function getUser(code:string,department:string, faculty:string, year:string) {
  
    const queryData: TeacherDownloadQuery = { code , department , faculty , year  }
    const docs: any = await getAllDocuments(queryData)
    console.log(docs)
    setstudents(docs)
  }
  
  async function getcourses(t: GoogleUser) {
    if (t) {
      const courses: TeacherCourseData[] = await downloadCourses(t.email)
      if (courses.length > 0) {
        setteacherCourses(courses)
       const {code,credits,department,name,faculty,year}= courses[courseIndex]
        getUser(code,department,faculty,year)
      }
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="tb-console">
          <IonText slot="start" color="success">
            COURSE <IonIcon icon={play}></IonIcon>
          </IonText>
          <IonSelect value={courseIndex} onIonChange={(e) => setcourseIndex(e.detail.value)} slot="start" placeholder="select course">
            {teacherCourses.map((course, index) => <IonSelectOption key={index} value={index}>{course.name}</IonSelectOption>)}
          </IonSelect>
          <IonTitle slot="end">{teacher.displayName}</IonTitle>
          <IonAvatar slot="end" className="tb-avatar">
            <IonImg src={teacher.photoURL}></IonImg>
          </IonAvatar>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol sizeMd="3" className="db-col">
             { teacherCourses.length>0&&<div className="holder">
                <div className="lp-titles">
                  <IonText color="success">
                    <h1>{teacherCourses[courseIndex].name}</h1>
                  </IonText>
                  <IonText color="dark">
                    <h3>CEF {teacherCourses[courseIndex].code}</h3>
                  </IonText>
                </div>
                <div className="item-holder">
                  {
                    students.map((student, index) => {
                      return (
                        <div style={selectedProject?.matricle===student.matricle?{ background:`#04ef004f`}:{}} key={index} onClick={() => setselectedProject(student)}>
                          <StudentProjectItem data={student} ></StudentProjectItem>
                        </div>
                      )
                    })
                  }
                </div>
              </div>}
            </IonCol>
            {selectedProject && <StudentProjectDetail data={selectedProject}></StudentProjectDetail>}
            {teacherCourses.length<=0&&<IonCol>
                <IonToolbar style={{textAlign:`center`,height:`80vh`}} className={`ion-padding ion-margin`}>
                  <IonNote style={{fontSize:`30px`}}>NO PROJECTS SUBMITED YET</IonNote><br/>
                   <IonRow>
                     <IonCol></IonCol>
                     <IonCol>
                       <IonImg src={`https://img-16.ccm2.net/_SqzzXVDSG50FWb_UBrCl3XwV78=/440x/1685e17045e747a899925aa16189c7c6/ccm-encyclopedia/99776312_s.jpg`}></IonImg>
                     </IonCol>
                     <IonCol></IonCol>
                   </IonRow>
                </IonToolbar>
              </IonCol>}
              {!selectedProject &&teacherCourses.length>0 &&<IonCol>
                <IonToolbar style={{textAlign:`center`,height:`80vh`}} className={`ion-padding ion-margin`}>
                  <IonNote style={{fontSize:`30px`}}>SELECT A PROJECT TO VIEW</IonNote><br/>
                   <IonRow>
                     <IonCol></IonCol>
                     <IonCol>
                       <IonImg src={`data:image/png;base64,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`}></IonImg>
                     </IonCol>
                     <IonCol></IonCol>
                   </IonRow>
                </IonToolbar>
              </IonCol>}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ConsoleTeachers;
