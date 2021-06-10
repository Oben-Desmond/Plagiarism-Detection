import { IonItem, IonAvatar, IonImg, IonLabel } from "@ionic/react"
import { person } from "ionicons/icons"
import React from "react"
import { documentData } from "./interfaces/document"


const StudentProjectItem: React.FC<{data:documentData}> = ({data}) => {


    return (
        <IonItem lines="full">
            <IonAvatar slot="start">
                <IonImg src={person}></IonImg>
            </IonAvatar>
            <div className="lh">
                <div>
                    <IonLabel className="l1">{data.student_name}</IonLabel>
                </div>
                <div>
                    <IonLabel className="l2">{data.matricle}</IonLabel>
                </div>
            </div>
        </IonItem>
    )
}

export default StudentProjectItem