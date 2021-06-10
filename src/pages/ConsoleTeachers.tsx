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
    // const t:any=await getTeacherInfo()
    // setteacher(t)
    const queryData: TeacherDownloadQuery = { code , department , faculty , year  }
    const docs: any = await getAllDocuments(queryData)
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
              <div className="holder">
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
                        <div key={index} onClick={() => setselectedProject(student)}>
                          <StudentProjectItem data={student} ></StudentProjectItem>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </IonCol>
            {selectedProject && <StudentProjectDetail data={selectedProject}></StudentProjectDetail>}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ConsoleTeachers;
