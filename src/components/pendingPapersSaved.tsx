import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonContent, IonGrid, IonIcon, IonImg, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonModal, IonNote, IonPopover, IonProgressBar, IonRow, IonSpinner, IonText, IonToast, IonToolbar } from "@ionic/react";
import { checkmark, checkmarkDoneCircle, checkmarkDoneCircleOutline, closeCircleOutline, closeOutline, lockClosed, star, timerOutline, trash } from "ionicons/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import './style/saved paper card.css'
import { localImages } from "../img/Images";
import { localPendingPapers, savedPaperInterface, UploadersTotalDownloads } from "./componentTypes";
import ReadModal from "./read modal";
import { Plugins } from "@capacitor/core";
import { UserContext } from "./RouterOutlet";
import app from "../Firebase";
import { useHistory } from "react-router";
import PaymentVerifierPopover from "./paymentVerifierPopover";
const { Modals } = Plugins

const Months = [`January`, `Febuary`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `December`]


const PendingPapersSaved:
    React.FC<{ paperGroup: localPendingPapers[], deleteSavedPaper: () => void }> = ({ paperGroup, deleteSavedPaper }) => {

        const [paymentStatus, setpaymentStatus] = useState<`pending` | boolean>(`pending`);
        const [verifyPopOver, setverifyPopOver] = useState<true | false>(false);
        const [uploading, setuploading] = useState<true | false>(false);

        const { setuserInfo, userInfo } = useContext(UserContext)
        const history = useHistory()

      
        return (
            <>
            pending
                {/* <div style={{ marginTop: `-7px` }} color={`light`}>

                    <IonCard style={{ width: `100%` }} className={`pending-card`} onClick={() => verifyPayment()}  >
                        <IonGrid>
                            <IonRow >
                                <IonCol>
                                    <IonImg style={{ width: `80%` }} src={localImages.queserPDF}></IonImg>
                                </IonCol>
                                <IonCol size={`9`}  >
                                    <IonRow>
                                        <IonLabel>
                                            <b> {paperGroup.length} papers pending  to be saved</b>
                                        </IonLabel>
                                        <div style={{ margin: `8px` }}>
                                            <i>click to unlock once you have confirmed transaction</i>
                                        </div>
                                    </IonRow>
                                    <IonRow>
                                        <IonCol>
                                            <div >

                                                <IonLabel color={`primary`}>  <IonIcon icon={timerOutline}></IonIcon> <b> {Math.floor(((Date.now() - 1620594633417) / 1000 / 60))}mins</b></IonLabel>
                                                <IonIcon style={{ marginLeft: `40px` }} icon={lockClosed} />
                                            </div >
                                        </IonCol>

                                    </IonRow>
                                </IonCol>



                            </IonRow>

                        </IonGrid>
                    </IonCard>
                </div> */}
                {/* <PaymentVerifierPopover paymentStatus={paymentStatus} onDidDismiss={() => setverifyPopOver(false)} isOpen={verifyPopOver}></PaymentVerifierPopover> */}
            </>



        );
    };

export default PendingPapersSaved;

export function formUrlEncoder(params: any, formUrlBody: any) {

    for (let property in params) {
        let key = encodeURIComponent(property);
        let value = encodeURIComponent(params[property]);
        formUrlBody.push(key + "=" + value);
    }
    return formUrlBody.join("&");
}



















            // fetch(`https://heroku.quesers.com/zito-pay`, {
            //     body: JSON.stringify(thisPaper),
            //     method:`POST`,
            //     headers:{}

            // })





            // function verifyPayment() {
            //     setverifyPopOver(true)
            //     const data: any = {
            //         "ref": `${paperGroup[0].ref}`,
            //         "reciever": `akumah`
            //     }
    
            //     setpaymentStatus(`pending`)
    
            //     const url = 'https://quesers.herokuapp.com/zito-pay';
            //     const params = {
            //         ...data
            //     };
            //     const headers = new Headers({
            //         'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            //     });
    
            //     let formUrlBody: any = [];
            //     formUrlBody = formUrlEncoder(params, formUrlBody);
    
            //     fetch(url, {
            //         method: 'POST',
            //         headers: headers,
            //         body: formUrlBody
            //     }).then(async response => {
            //         const data: any = (await response.json())
            //         console.log(data)
            //         if (data.status == 1 && data.status_msg == "COMPLETED") {
            //             setpaymentStatus(true)
            //         } else {
            //             setpaymentStatus(false)
            //         }
            //     }).catch((err) => {
            //         setpaymentStatus(false)
            //         console.log(err)
            //     });
            // }
    
    
            // async function savePapersToDatabase() {
            //     let tempObject: any = {}
    
            //     for (let i = 0; i < paperGroup.length; i++) {
            //         const paper = paperGroup[i]
            //         tempObject[`${paper.id}`] = paper
            //         setuploading(true)
    
            //         if (userInfo) {
            //             app.firestore()
            //                 .collection(`userInfos`)
            //                 .doc(userInfo.tel)
            //                 .collection(`papers`)
            //                 .doc(`${paper.id}`)
            //                 .set(tempObject).then(async () => {
            //                     for (let i = 0; i < paperGroup.length; i++) {
            //                         const paper = paperGroup[i]
            //                         const newdownloads = parseInt(`${paper.downloads}`) != NaN ? parseInt(`${paper.downloads}`) + 1 : paper.downloads
            //                         app.database().ref(`allPapers`).child(paper.id).update({ downloads: newdownloads.toString() }).catch(alert)
    
            //                         //updating firestore uploaders downloads
            //                         const m = (new Date(Date.now())).getMonth(), y = (new Date(Date.now())).getFullYear();
            //                         const downloadId = paper.author + `` + Date.now()
            //                         const uploaderPaper: UploadersTotalDownloads = { cost: paper.cost, currency: paper.currency, date: `${Date.now()}`, month: `${Months[m]}`, tel: paper.author, year: y.toString() }
            //                         app.firestore().collection(`uploader/${paper.author}/totalDownloads`).doc(downloadId).set(uploaderPaper)
            //                         app.firestore().collection(`uploader/${paper.author}/papers/${paper.id}/downloads`).doc(downloadId).set(uploaderPaper)
    
    
            //                     }
            //                     if (i >= paperGroup.length - 1) {
            //                         Modals.confirm({ title: `Download SuccessFull`, message: `The Download has completed Successfully.\nGo to Downloads` })
            //                             .then(res => {
            //                                 if (res.value == true) {
            //                                     history.push(`/saved`)
    
            //                                 } else {
    
            //                                 }
            //                             })
            //                     }
    
            //                 }).catch((err) => {
            //                     Modals.alert({ message: `${err.message}`, title: `Upload Error`, buttonTitle: `ok` })
            //                 }).finally(() => {
            //                     setuploading(false)
            //                 })
            //         } else {
            //             const res = (await Modals.confirm({ title: `Authentication Error`, message: `unable to buy papers because user is not authenticated`, okButtonTitle: `login` })).value
            //             if (res) {
            //                 history.push(`/login`)
            //             }
    
            //         }
            //     }
            //     console.log(tempObject)
            // }
    