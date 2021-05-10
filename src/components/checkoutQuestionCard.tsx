import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonIcon, IonLabel, IonText, IonToolbar } from "@ionic/react";
import React, { useState } from "react";
import { cash, checkmarkDoneCircle, cloudDownloadOutline, eye, star, trash } from 'ionicons/icons';
import '../css/quesers.css'
import { Plugins } from "@capacitor/core";
import PreviewModal from "./previewModal";
import { SearchPaperInterface } from "./componentTypes";

const CheckoutQuestionCard: React.FC<{ removePaper: () => void, thisPaper:SearchPaperInterface }> = ({removePaper,thisPaper}) => {
     const {id,cost,downloads,title,description,currency}=thisPaper
    const [ShowModal, setShowModal] = useState(false);
    const [Starred, setStarred] = useState(false);

    function removeThisPaper(){
        Plugins.Modals.confirm({message:`This Paper will be removed from here`,title:`Remove Paper`,cancelButtonTitle:`cancel`,okButtonTitle:`remove`})
        .then((res)=>{
               if( res.value){
                   removePaper()
               }
        }) 
    }

    return (
        <>
            <IonCard  >
                <IonCardHeader>
                    <IonToolbar>
                        <IonCardTitle>{title}</IonCardTitle>
                        {Starred ? <IonButton color='success' slot='end' fill="clear" onClick={() => setStarred(false)}>
                            <IonIcon color="success" icon={star}></IonIcon>
                        </IonButton> : <IonButton color='success' slot='end' fill="clear" onClick={() => setStarred(true)}>
                        </IonButton>}
                        <IonButtons  >
                            <IonButton>
                                <IonIcon color='success' icon={checkmarkDoneCircle}></IonIcon>
                                <IonLabel>verified</IonLabel>
                            </IonButton>
                            {/* <IonButton color='dark'>
                                <IonIcon icon={cloudDownloadOutline} />
                                <IonLabel>{downloads}</IonLabel>
                            </IonButton> */}
                             <IonButton color='primary'>
                                <IonIcon icon={cash} slot={`start`} />
                                <IonLabel>{cost + ` `+currency}</IonLabel>
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonCardHeader>
                <IonCardContent    >
                    {/* <IonCardSubtitle color='success'>Autor name</IonCardSubtitle> */}
                    <IonText>{description}</IonText>
                    <IonToolbar className="ion-no-padding">
                        <IonChip color='dark' onClick={() => setShowModal(true)}>
                            <IonIcon icon={eye} />
                            <IonLabel  >Preview</IonLabel>
                        </IonChip>
                        <IonChip color='dark' onClick={() => removeThisPaper()}>
                            <IonIcon icon={trash} />
                            <IonLabel  >Remove</IonLabel>
                        </IonChip>
                    </IonToolbar>
                </IonCardContent>

            </IonCard>
            <PreviewModal thisPaper={thisPaper} DownloadThisPaper={()=>setShowModal(false)} isOpen={ShowModal} onDidDismiss={() => { setShowModal(false) } } ></PreviewModal>
           
        </>
    );
};

export default CheckoutQuestionCard;