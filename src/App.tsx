import React from "react";
import {
  IonApp, 
  IonRouterOutlet, 
} from "@ionic/react";

import "./css/app.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { IonReactRouter } from "@ionic/react-router"; 
import { Route } from "react-router";
import StudentLogin, { TeacherLogin , SignUpStudent, SignUpTeacher} from "./components/Login";
import Welcome from "./pages/Welcome";
import ConsoleTeachers from "./pages/ConsoleTeachers";
import ConsoleStudents from "./pages/ConsoleStudents";

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path='/' component={Welcome}></Route>
          <Route path='/welcome' component={Welcome}></Route>
          <Route path='/student-login' component={StudentLogin}></Route>
          <Route path='/teacher-login' component={TeacherLogin}></Route>
          <Route path='/teacher-signup' component={SignUpTeacher}></Route>
          <Route path='/student-signup' component={SignUpStudent}></Route>
          <Route path='/console-teacher' component={ConsoleTeachers}></Route>
          <Route path='/console-student' component={ConsoleStudents}></Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
