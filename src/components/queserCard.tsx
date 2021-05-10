import { IonAvatar, IonBackdrop, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonChip, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonModal, IonNote, IonSegment, IonSegmentButton, IonSlide, IonSlides, IonText, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";
import img from '../img/sc.png';
import { arrowBack, arrowBackCircle, barChart, cart, checkmarkDone, checkmarkDoneCircle, cloud, cloudDone, cloudDownload, cloudDownloadOutline, download, micOffCircle, save, star, starOutline } from 'ionicons/icons';
import '../css/quesers.css'
import PreviewModal from "./previewModal";
import { SearchPaperInterface } from "./componentTypes";
import ReadModal from "./read modal";
import numConverter from "../data/number converter";
// import { useState } from "react";

const QuestionCard: React.FC<{ addQuestionToCart: () => void, thisPaper: SearchPaperInterface, PapersAdded: SearchPaperInterface[], PaperDownloaded: boolean }> = (props) => {
    const { addQuestionToCart, thisPaper, PaperDownloaded } = props
    const { title, description, downloads } = thisPaper
    const [ShowModal, setShowModal] = useState(false);
    const [Downloaded, setDownloaded] = useState(false);
    const [paperdownloads, setpaperdownloads] =  useState<string>(downloads)
    const thisPaperTemp:any=thisPaper
    
    useEffect(() => {
        setDownloaded(false)
        props.PapersAdded.forEach(paper => {
            if (paper.id == thisPaper.id) {
                console.log(paper, thisPaper)
                setDownloaded(true)
            } else {

            }
        });
        // if(filterArray.length==1){
        //     setDownloaded(true)
        // }else{
        //     setDownloaded(false)
        // }; 
    }, [props.PapersAdded])
    useEffect(()=>{
        if(downloads){
            setpaperdownloads(numConverter(downloads))
        }
    },[])
    return (
        <>
            <IonCard   >
                <IonCardHeader>
                    <IonToolbar>
                        <IonCardTitle>{title}</IonCardTitle>

                        <IonButtons style={{width:`100%`}}  >
                            <IonButton>
                                <IonIcon color='success' icon={checkmarkDoneCircle}></IonIcon>
                                <IonLabel  >verified</IonLabel>
                            </IonButton>

                            <span color='dark'style={{marginLeft:`19vw`}} >
                                <IonLabel color={`medium`}>{paperdownloads} Downloads</IonLabel>
                            </span>
                        </IonButtons>
                    </IonToolbar>
                </IonCardHeader>
                <IonCardContent    >
                    {/* <IonCardSubtitle color='success'>MIA - Official</IonCardSubtitle> */}
                    <IonLabel color={`dark`}>{!Downloaded ? description : description.substr(0, 170) + `...`}</IonLabel>
                    <IonToolbar className="ion-no-padding">

                        {PaperDownloaded ?
                            <IonChip color='dark' onClick={() => setShowModal(true)}><IonLabel>open</IonLabel></IonChip> :
                            <IonChip color='dark' onClick={() => setShowModal(true)}><IonLabel  >preview</IonLabel></IonChip>}


                        {PaperDownloaded ?
                            <IonButton mode={`ios`} fill={`clear`} disabled size={`small`}  shape='round' slot='end' >
                                <IonLabel >Already Downloaded</IonLabel>
                            </IonButton> :
                            Downloaded ? <IonButton size={`small`} color='success' shape='round' slot='end' >
                                <IonLabel color='light'>ADDED</IonLabel>
                            </IonButton> : <IonButton size={`small`} color='dark' shape='round' slot='end' onClick={() => { addQuestionToCart() }}>
                                <IonLabel> save</IonLabel>
                            </IonButton>}
                    </IonToolbar>
                   { PaperDownloaded&&<ReadModal thisPaper={thisPaperTemp}  onDidDismiss={() => setShowModal(false)} isOpen={ShowModal} >

                    </ReadModal>}
                </IonCardContent>

            </IonCard>
            {/* <IonToast buttons={[{icon:cart,side:`end`,}]} color='warning' message='paper added to cart' isOpen={Downloaded} duration={1100}></IonToast> */}
            {!PaperDownloaded&&<PreviewModal thisPaper={thisPaper} DownloadThisPaper={() => {
                if (!Downloaded)
                    addQuestionToCart();

                setShowModal(false)
            }} isOpen={ShowModal} onDidDismiss={() => setShowModal(false)}></PreviewModal>}
        </>
    );
};

export default QuestionCard;