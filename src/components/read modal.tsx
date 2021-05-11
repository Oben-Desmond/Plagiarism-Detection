import { IonModal, IonHeader, IonToolbar, IonBackdrop, IonIcon, IonContent, IonSegment, IonSegmentButton, IonSlides, IonSlide, IonImg, IonLabel, IonButton, IonList, IonFooter, IonFab, IonActionSheet, CreateAnimation } from "@ionic/react";
import { chatbox, close, ellipsisVertical, shareSocial, star } from "ionicons/icons";
import "../css/previewModal.css";
import React, { useEffect, useRef, useState } from "react";
import { savedPaperInterface } from "./componentTypes";
import "./style/readmodal.css";
import { Plugins } from "@capacitor/core";
import { BounceStar } from "../data/animations";
import ReviewPopover from "./review popover";
 
 
const { Storage, Share } = Plugins

const ReadModal: React.FC<{isOpen: boolean, onDidDismiss: () => void
    thisPaper: savedPaperInterface}> = ({ isOpen, onDidDismiss, thisPaper }) => {
 
   
    const slider = useRef<HTMLIonSlidesElement>(null);
    const [value, setValue] = useState("0");
    const [starred, setstarred] = useState(false);
    const [viewPop, setviewPop] = useState(false);
    const [viewReview, setviewReview] = useState(false);
   
    const slideOpts = {
        initialSlide: 0,
        speed: 400,
        loop: false,
        pagination: {
            el: null
        },

    };

    useEffect(()=>{

    return(()=>{
        setValue(`0`)
    })
    },[])

    const handleSegmentChange = (e: any) => {
        setValue(e.detail.value);
        slider.current?.slideTo(e.detail.value);
    };

    const handleSlideChange = async (event: any) => {
        let index: number = 0;
        await event.target.getActiveIndex().then((value: any) => (index = value));
        setValue('' + index)
    }
    
    function readfunc() {
        Plugins.Accessibility.speak({ value: thisPaper.title + ` \n find the square are of a square with sides 6 centimeters` })
    }

    async function starThisPaper() {
        let papervalue = (await Storage.get({ key: `starredPapers` })).value

        let starredpaptemp: savedPaperInterface[] = []
        if (papervalue) {
            let starredpaptemp: savedPaperInterface[] = JSON.parse(papervalue)
            let temp = false;
            for (let i = 0; i < starredpaptemp.length; i++) {
                if (starredpaptemp[i].id == thisPaper.id) {
                    temp = true
                }
            }
            if (temp) {
                return
            }
            else {
                starredpaptemp.push(thisPaper)
                await Storage.set({ key: `starredPapers`, value: JSON.stringify(starredpaptemp) })

            }
        }
        else {
            starredpaptemp.push(thisPaper)
            await Storage.set({ key: `starredPapers`, value: JSON.stringify(starredpaptemp) })
        }
        setstarred(true)
        console.log(papervalue)


    }
    const sharePaper = () => {
        Share.share({
            dialogTitle: `Share Question with Friends`,
            text: `check out ${thisPaper.title} on Quesers`, title: `Quesers Questions and Answers`, url: `https://Quesers.web.app/${thisPaper.id}`
        })
    }

    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={ onDidDismiss }  >
            <IonHeader>
                <IonToolbar color='dark'>
                    <IonButton fill={`clear`} slot={`start`}>
                        <IonBackdrop></IonBackdrop>
                        <IonIcon color="success" icon={close} ></IonIcon>
                    </IonButton>
                    <IonLabel  >{thisPaper?.title}</IonLabel>
                    <IonButton onClick={() => {

                        setviewPop(true)

                    }} fill={`clear`} slot={`end`}>
                        <IonIcon icon={ellipsisVertical} ></IonIcon>
                        <IonActionSheet cssClass={`read-menu-action`} buttons={[{ text: `add Review`, icon: chatbox, handler: () => setviewReview(true) }
                            , { text: `star paper`, icon: star, handler: () => starThisPaper() }, { text: `share`, icon: shareSocial, handler: () => sharePaper() }]}
                            isOpen={viewPop} onDidDismiss={() => setviewPop(false)} />

                    </IonButton>

                </IonToolbar>
            </IonHeader>
            
            <IonContent>
                <ReviewPopover thisPaper={thisPaper} isOpen={viewReview} onDidDismiss={() => { setviewReview(false) }}></ReviewPopover>
               
                <IonSlides  options={slideOpts} onIonSlideDidChange={(e) => handleSlideChange(e)} ref={slider} className={`paper-slides`}>
               
                    <IonSlide  >
                   
                        <IonList    >
                       
                            {thisPaper?.questionUrl?.map((img, index) => {
                                return  <IonImg key={index} src={img} />
                                
                            })}
                           
                        </IonList>
                       
                    </IonSlide>
                   
                    <IonSlide >
                        <IonList>
                            {thisPaper?.answerUrl?.map((img, index) => {
                                return <IonImg key={index} src={img} />
                            })}
                        </IonList>
                    </IonSlide>
                </IonSlides>
               
            </IonContent>

            <IonFab horizontal={`center`} vertical={`center`}>
                <CreateAnimation onFinish={{ callback: () => { setstarred(false) } }} duration={2000} easing={`linear`} play={starred} keyframes={BounceStar}>
                    <IonIcon style={{ transform: `scale(0)` }} color={`warning`} size={`large`} icon={star}></IonIcon>
                </CreateAnimation>
            </IonFab>


            <IonFooter>
                <IonToolbar color={`dark`}>
                    <IonSegment className={`reader-controller`} color={`success`} onIonChange={handleSegmentChange} value={value}>
                        <IonSegmentButton value={`0`}>
                            <IonLabel>Question</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value={`1`}>
                            <IonLabel>Answer</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonFooter>

        </IonModal>
    )
}

export default ReadModal

 