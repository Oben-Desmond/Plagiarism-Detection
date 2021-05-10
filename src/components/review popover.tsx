import { IonPopover, IonContent, IonCardHeader, IonButtons, IonButton, IonIcon, IonCardContent, IonItem, IonLabel, IonTextarea, IonToolbar, IonCardTitle, IonBackdrop, IonNote, IonSlides, IonSlide } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import React, { useRef, useState } from "react";
import { savedPaperInterface } from "./componentTypes";


const ReviewPopover: React.FC<{ isOpen: boolean, onDidDismiss: () => void, thisPaper: savedPaperInterface }> = ({ isOpen, onDidDismiss }) => {
    const [starCount, setStarCount] = useState(4)
    const startext = [`bad`, `not so good`, `fair`, `good`, `amazing`]
    const slidesRef= useRef<HTMLIonSlidesElement>(null)

    function submitReview() {

    }
    return (
        <IonPopover isOpen={isOpen} onDidDismiss={() => onDidDismiss()}>
            <IonContent style={{ height: `230px` }}>
                <IonSlides ref={slidesRef}>
                    <IonSlide>
                        <IonCardHeader >
                            <h5>How many stars ?</h5>
                            <IonButtons className={`ion-padding-horizontal`} >
                                <IonNote color={`warning`}>{starCount} stars</IonNote>
                                <IonButton color={`primary`} fill={`clear`}>{startext[starCount - 1]}</IonButton>
                            </IonButtons>
                            <IonButtons style={{ margin: `20px 0` }}>
                                {[1, 2, 3, 4, 5].map((count, index) => {
                                    if (index < starCount) return <IonButton onClick={() => setStarCount(index + 1)}> <IonIcon color={`warning`} icon={star} /> </IonButton>
                                    return <IonButton onClick={() => setStarCount(index + 1)}> <IonIcon icon={starOutline} /> </IonButton>

                                })
                                }

                            </IonButtons>
                            <div style={{ textAlign: `center` }}>
                                <IonButton onClick={()=>slidesRef.current?.slideNext()} shape={`round`} fill={`solid`} color={`dark`}>Next</IonButton>
                            </div>
                        </IonCardHeader>
                    </IonSlide>
                    <IonSlide>
                       
                        <form onSubmit={submitReview}>
                        <IonLabel>Send a message to the providers</IonLabel>
                            <IonCardContent>

                                <IonItem>
                                    <IonLabel position={`floating`}>add comment</IonLabel>
                                    <IonTextarea name={`text`}></IonTextarea>
                                </IonItem>
                            </IonCardContent>
                            <IonToolbar style={{ textAlign: `center` }} color={`none`}>
                                <IonButton type={"submit"} color={`dark`} shape={`round`} >
                                    submit
                        <IonBackdrop></IonBackdrop>
                                </IonButton>
                            </IonToolbar>
                        </form>
                    </IonSlide>
                </IonSlides>

            </IonContent>

        </IonPopover>
    )
}

export default ReviewPopover