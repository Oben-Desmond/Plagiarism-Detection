import { IonCol, IonItem, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonPopover, IonContent, IonLabel, IonSelect, IonSelectOption, IonTextarea, IonTabBar, IonTabButton, IonHeader, IonToolbar, IonSpinner } from "@ionic/react"
import React, { useEffect, useState } from "react"
import { updateReview } from "./Funcions/Home/teacher"
import { documentData } from "./interfaces/document"
import PlagiarismLevel from "./PlagiarismLevel"


const StudentProjectDetail: React.FC<{ data: documentData }> = ({ data }) => {

    const [showPreviewPopover, setshowPreviewPopover] = useState(false)
    const [loading, setloading] = useState(false)
    const [review, setreview] = useState(data.review_message?data.review_message:``)


    useEffect(()=>{
        if(data){
            setreview(data.review_message)
        }
    },[data])
    function addReview() {
        setshowPreviewPopover(true)
    }
    function sendReview(event:any) {
         event.preventDefault()
         const status=event.target.status.value 
         const review_message=event.target.review_message.value 
        
         setloading(true)
         updateReview(data,status,review_message, ()=>{
             setreview(review_message);
             setloading(false)
             setshowPreviewPopover(false)
         })
    }
    return (
        <IonCol sizeMd="9">
            <div className="holder">
                <IonItem lines="full">
                    <div >
                        <h1>{data.student_name}</h1>
                        <h6>{data.matricle}</h6>
                    </div>
                    <div slot="end">
                   
                        {review==`` && <IonButton  onClick={() => addReview()}  className="sr-button">send review</IonButton>}
                        <h6>{(new Date(+data.date)).toDateString()}</h6>
                    </div>
                </IonItem>
                <IonItem lines="full">
                    <div >
                        <h1>{data.title}</h1>
                        <h6>{data.student_email}</h6>
                    </div>
                     
                </IonItem>
                <IonButton
                    fill="clear"
                    color="success"
                    className="od-button"
                    href={data.url}
                    target={`__blank`}
                >
                    open document
          </IonButton>
                {data.review_message && <div className="rm-area">
                    <IonCard color='light'>
                        <IonCardHeader>
                            <IonCardTitle>Review Message</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            {review}

                            {/* <h6>
                                <IonButton className='b'>edit</IonButton>
                            </h6> */}
                        </IonCardContent>
                    </IonCard>
                </div>}
                <h1>Level of Plagiarism</h1>
                < PlagiarismLevel doc={data} ></PlagiarismLevel>
                <div className="results-holder">

                </div>

            </div>
            <IonPopover onDidDismiss={() => setshowPreviewPopover(false)} isOpen={showPreviewPopover}>
                <IonHeader>
                    <IonToolbar style={{ textAlign: `center` }}>  <IonLabel>Send Review to student</IonLabel></IonToolbar>
                </IonHeader>
                <IonContent>
                    <form onSubmit={sendReview}>
                        <IonCardContent>
                            <IonItem>
                                <IonLabel >status</IonLabel>
                                <IonSelect name={`status`}>
                                    <IonSelectOption>pending</IonSelectOption>
                                    <IonSelectOption>accepted</IonSelectOption>
                                    <IonSelectOption>rejected</IonSelectOption>
                                </IonSelect>
                            </IonItem>
                            <IonItem color={`light`}>
                                <IonLabel position={`floating`} >send message</IonLabel>
                                <IonTextarea  name={`review_message`} placeholder={`add review message...`}></IonTextarea>
                            </IonItem>
                            <IonTabButton className={`ion-margin-top`} style={{ textAlign: `center` }}>
                               {loading?<IonSpinner></IonSpinner> :<IonButton type={`submit`} shape={`round`}>send</IonButton>}
                            </IonTabButton >
                        </IonCardContent>
                    </form>
                </IonContent>

            </IonPopover>
        </IonCol>
    )
}
export default StudentProjectDetail

 