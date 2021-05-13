import { IonModal, IonHeader, IonToolbar, IonBackdrop, IonIcon, IonContent, IonSegment, IonSegmentButton, IonSlides, IonSlide, IonImg, IonLabel, IonButtons, IonButton, IonList } from "@ionic/react";
import { arrowBack, download } from "ionicons/icons";
import "../css/previewModal.css";
import React, { useRef, useState } from "react";
import { SearchPaperInterface } from "./componentTypes";


const PreviewModal: React.FC<{ isOpen: boolean, thisPaper: SearchPaperInterface, onDidDismiss: () => void, DownloadThisPaper: () => void }> = ({ isOpen, onDidDismiss, DownloadThisPaper, thisPaper }) => {

     const slider = useRef<HTMLIonSlidesElement>(null);
    const [value, setValue] = useState("0");

    const slideOpts = {
        initialSlide: 0,
        speed: 400,
        loop: false,
        pagination: {
            el: null
        },

    };

    // a function to handle the segment changes
    const handleSegmentChange = (e: any) => {
        setValue(e.detail.value);
        slider.current!.slideTo(e.detail.value);
    };

    // a function to handle the slider changes
    const handleSlideChange = async (event: any) => {
        let index: number = 0;
        await event.target.getActiveIndex().then((value: any) => (index = value));
        setValue('' + index)
    }
    //function calls props to handle ad paper to cart
    function DownloadPaper() {
        DownloadThisPaper()
    }
    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onDidDismiss}
        >
            <IonHeader>
                <IonToolbar color='dark'>

                    <IonButtons slot={`start`}>
                        <IonButton>
                            <IonBackdrop></IonBackdrop>
                            <IonIcon size='large' color="success" icon={arrowBack} ></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonLabel  >{thisPaper.title}</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonSegment onIonChange={handleSegmentChange} value={value}>
                <IonSegmentButton value={`0`}>Question</IonSegmentButton>
                <IonSegmentButton value={`1`}>Answer</IonSegmentButton>
            </IonSegment>
            <IonContent>

                 {/* ------------          slides that contain preview Questions and Answers           ------------------- */}
                <IonSlides options={slideOpts} onIonSlideDidChange={(e) => handleSlideChange(e)} ref={slider} className={`preview-slides`}>
                    <IonSlide >
                        <IonList>

                            {thisPaper?.questionUrl?.map((img, index) => {
                                if (index == 0) return (
                                    <>
                                        <IonImg style={{ maxHeight: `35vh`, margin: 0 }} key={index} src={img} alt={thisPaper.description} />
                                        <IonImg style={{ margin: `0px`, padding: 0 }} className={`hide`} key={index} src={img} alt={thisPaper.description} />
                                    </>)
                                return <IonImg className={`hide`} key={index} src={img} />

                            })}

                        </IonList>
                    </IonSlide>
                    <IonSlide>
                        <IonList>

                            {thisPaper?.answerUrl?.map((img, index) => {
                                return <IonImg className={`hide`} key={index} src={img} />

                            })}

                        </IonList>
                    </IonSlide>
                </IonSlides>
            </IonContent>
                 {/* ------------      Button tiggers the add to cart action for this event    ------------------- */}

            <IonButton onClick={DownloadPaper}>
                <IonIcon slot={`start`} icon={download} />
                <IonLabel>download full copy</IonLabel>
            </IonButton>
        </IonModal>
    )
}

export default PreviewModal