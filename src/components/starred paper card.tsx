import { Plugins } from "@capacitor/core";
import { IonCard, IonItem, IonImg, IonGrid, IonRow, IonCol, IonItemOption, IonItemOptions, IonItemSliding, IonText, IonIcon, IonButton, IonCheckbox, IonCardHeader, IonCardTitle, IonProgressBar, IonToolbar, IonButtons } from "@ionic/react";
import { close, star, trash } from "ionicons/icons";
import React, { useState } from "react";
import { localImages } from "../img/Images";
import { savedPaperInterface } from "./componentTypes";
import ReadModal, { PaperImage } from "./read modal";
import "./style/starredCard.css";

const {Modals}=Plugins
const StarredPaperCard: React.FC<{ deleteFromStarred:()=>void,thisPaper: savedPaperInterface, color: string }> = (props) => {
    const [readPaper, setreadPaper] = useState(false)
    const [paperColor, setpaperColor] = useState(props.color)

    const { thisPaper,deleteFromStarred } = props
    const { title, answerUrl, questionUrl } = thisPaper

    function removePaper() {
         Modals.confirm({message:`This will remove this paper from starred list`,title:`Remove From Starred`})
          .then((res)=>{
              if(res.value){
                deleteFromStarred()
              }else{

              }
          })
        }
    return (
        <IonCard  className={`starred-card`} >
            <IonToolbar className={`header`}>
                <IonButtons onClick={() => removePaper()} slot={`end`}>
                    <IonButton>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <div onClick={() => setreadPaper(true)} className={`saved-container-img`}>
                <PaperImage url={questionUrl[0]} />
            </div >
            <IonCardHeader  onClick={() => setreadPaper(true)}  >
                <IonToolbar color={`none`}>
                    <IonCardTitle>{title}</IonCardTitle>
                </IonToolbar>
            </IonCardHeader>
             <ReadModal thisPaper={thisPaper} isOpen={readPaper} onDidDismiss={() => { setreadPaper(false) }}> </ReadModal>
            <IonProgressBar color={paperColor}></IonProgressBar>

        </IonCard>
    )
}

export default StarredPaperCard