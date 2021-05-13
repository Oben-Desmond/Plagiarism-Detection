import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonModal, IonProgressBar, IonRow, IonText, IonToast, IonToolbar } from "@ionic/react";
import { star, trash } from "ionicons/icons";
import React, { useRef, useState } from "react";
// import '../css/quesers.css'
import './style/saved paper card.css'
import { localImages } from "../img/Images";
import { savedPaperInterface } from "./componentTypes";
import ReadModal from "./read modal";
import { Plugins } from "@capacitor/core";
// import { useState } from "react";
const { Modals } = Plugins
const  SavedPapersCard:
    React.FC<{ starred: boolean, thisPaper: savedPaperInterface, starPaper: () => void, deleteSavedPaper:()=>void }> = ({ starred, thisPaper, starPaper, deleteSavedPaper }) => {

        const slidingRef = useRef<HTMLIonItemSlidingElement>(null)
        const [readPaper, setreadPaper] = useState(false)
      
        const sliderBlurred = () => {
            slidingRef.current?.closeOpened()
        }
        //opens modal that can allow user to see paper
        function openPaper() {
            Modals.confirm({ title: `Open Paper`, message: `Opening ${thisPaper.title}`, okButtonTitle: `open` })
                .then((res) => {
                    if (res.value) {
                        setreadPaper(true)
                    }
                })
        }
        const touchSlideItem = () => {
              sliderBlurred() 
            }
        
        return (
            <>
              
                <IonItemSliding ref={slidingRef} onBlur={sliderBlurred} >
                    <IonItemOptions onClick={touchSlideItem} side="start">
                        <IonItemOption onClick={starPaper }  color={starred ? "medium" : `primary`} expandable>
                            <IonIcon slot={`icon-only`} icon={star}></IonIcon>
                        </IonItemOption>
                    </IonItemOptions>

                    <IonItem style={{ marginTop: `-7px`}} className={`starred-card`} color={`light`} lines={`none`}>
                        <IonCard onClick={() => openPaper()}  >
                            <IonGrid>
                                <IonRow>
                                    <IonCol>
                                        <IonImg src={localImages.queserPDF}></IonImg>
                                    </IonCol>
                                    <IonCol size={`9`}  >
                                        <IonText>
                                            {thisPaper.title}

                                        </IonText>
                                    </IonCol>

                                </IonRow>
                            </IonGrid>
                        </IonCard>


                    </IonItem>
                    <IonItemOptions onClick={touchSlideItem} side="end">
                        <IonItemOption  onClick={()=>deleteSavedPaper()} color="danger" expandable >
                            <IonIcon slot={`icon-only`} icon={trash}></IonIcon>
                        </IonItemOption>
                    </IonItemOptions>
                </IonItemSliding>
                <ReadModal thisPaper={thisPaper} isOpen={readPaper} onDidDismiss={() => { setreadPaper(false) }}> </ReadModal>

            </>



        );
    };

export default  SavedPapersCard;