import { IonPopover, IonContent, IonCardHeader, IonButtons, IonButton, IonIcon, IonCardContent, IonItem, IonLabel, IonTextarea, IonToolbar, IonCardTitle, IonBackdrop, IonNote, IonSlides, IonSlide, IonBadge } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import React, { useContext, useRef, useState } from "react";
import { savedPaperInterface } from "./componentTypes";
import app from "../Firebase";
import { UserContext } from "./RouterOutlet";
import { Plugins } from "@capacitor/core";

const {Toast}= Plugins

const ReviewPopover: React.FC<{ isOpen: boolean, onDidDismiss: () => void, thisPaper: savedPaperInterface }> = ({ isOpen, onDidDismiss, thisPaper }) => {
    const [starCount, setStarCount] = useState(4)
    const [next, setnext] = useState(false)
    const startext = [`bad`, `not so good`, `fair`, `good`, `amazing`]
    const { userInfo } = useContext(UserContext)

    // adds review sent by client for a particular paper
    function submitReview(event:any) {
        event.preventDefault();
           const text =  event.target.text.value
    
        if (userInfo.tel) {
            const date=Date.now()
            const reviewObj={
                stars:starCount,
                username:userInfo.name,
                date,
                tel: userInfo.tel,
                message:text
            }
            console.log(reviewObj)
            onDidDismiss()
            Toast.show({text:`sending review`,position:`center`,duration:`short`})
          
            app.firestore().collection(`uploader`)
                .doc(thisPaper.author)
                .collection(`papers`).doc(thisPaper.id)
                .collection(`reviews`).doc(`${userInfo.tel + `` + date}`)
                .set(reviewObj).then(()=>{
                    Toast.show({text:`sent`,duration:`short`})
                }).catch((err)=>{
                    Toast.show({text:`${err.message}`,duration:`short`})

                })
        }
    }
    return (
        <IonPopover isOpen={isOpen} onDidDismiss={() =>{ onDidDismiss(); setnext(false)}}>
            <IonContent>
                {!next?
                        <IonCardHeader >
                            <h5>How many stars ?</h5>
                            <IonButtons className={`ion-padding-horizontal`} >
                                <IonNote >{starCount} stars</IonNote>
                                <IonButton color={`primary`} fill={`clear`}>{startext[starCount - 1]}</IonButton>
                            </IonButtons>
                            <IonButtons style={{ margin: `20px 0` }}>
                                {[1, 2, 3, 4, 5].map((count, index) => {
                                    if (index < starCount) return <IonButton onClick={() => setStarCount(index + 1)}> <IonIcon color={`primary`} icon={star} /> </IonButton>
                                    return <IonButton onClick={() => setStarCount(index + 1)}> <IonIcon icon={starOutline} /> </IonButton>

                                })
                                }

                            </IonButtons>
                            <div style={{ textAlign: `center` }}>
                                <IonButton onClick={() => setnext(true)} shape={`round`} fill={`solid`} color={`dark`}>Next</IonButton>
                            </div>
                        </IonCardHeader>
                     :

                        <form className={`review-form`} onSubmit={submitReview}>
                            <div style={{padding:`10px`,textAlign:`center`}}>
                            <IonBadge onClick={()=>setnext(false)} >{starCount} stars</IonBadge>
                            </div>
                           <IonCardHeader> <IonCardTitle >Send a message to the the team</IonCardTitle ></IonCardHeader>
                            <IonCardContent>

                                <IonItem>
                                    <IonLabel position={`floating`}></IonLabel>
                                    <IonTextarea placeholder={`example: This paper is amazing..`} name={`text`}></IonTextarea>
                                </IonItem>
                            </IonCardContent>
                            <IonToolbar style={{ textAlign: `center` }} color={`none`}>
                                <IonButton type={"submit"} color={`dark`} shape={`round`} >
                                    submit
                                </IonButton>
                            </IonToolbar>
                        </form>
                    }

            </IonContent>

        </IonPopover>
    )
}

export default ReviewPopover