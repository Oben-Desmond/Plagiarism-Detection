import { IonItem, IonImg, IonText } from "@ionic/react"
import { bookmark } from "ionicons/icons"
import React from "react"
import { documentData } from "./interfaces/document"



const StudentReportItem: React.FC<{document:documentData}> = ({document}) => {
    return (
        <IonItem lines="inset">
            <IonImg slot="start" src={bookmark}></IonImg>
            {/* <IonAvatar slot="start">
                      </IonAvatar> */}
            <div className="lh">
                <IonText>
                    <h5>{document.title}</h5>
                </IonText>
            </div>
        </IonItem>
    )
}

export default StudentReportItem