import { IonModal, IonHeader, IonToolbar, IonLabel, IonBadge, IonButtons, IonButton, IonBackdrop, IonIcon, IonContent, IonText } from "@ionic/react";
import { close } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import CheckoutQuestionCard from "./checkoutQuestionCard";
import { SearchPaperInterface, userInterface } from "./componentTypes";
import "./style/checkoutModal.css";
import { Plugins } from "@capacitor/core";
import { Zitopay } from "../zitopay";
import CheckoutVerify from "./CheckoutVerify";
import { useHistory } from "react-router";


const { Storage } = Plugins
const CheckOutModal: React.FC<{ user: userInterface | undefined, removePaperFromAdded: (index: number) => void, isOpen: boolean, onDidDismiss: () => void, CheckOutPapers: SearchPaperInterface[] }> = ({ removePaperFromAdded, isOpen, onDidDismiss, CheckOutPapers }) => {

  const [uploading, setuploading] = useState(false)
  const [costSum, setcostSum] = useState(0 + `FCFA`)
  const history = useHistory()
  useEffect(() => {

      let sum = 0
      for (let i = 0; i < CheckOutPapers.length; i++) {
          sum += +CheckOutPapers[i].cost
      }
      setcostSum(sum + ` FCFA`)

  }, [CheckOutPapers])


 
  function removePaperFromCheckOut(index: number) {
    removePaperFromAdded(index)
  }

 
  return (
    <IonModal mode='ios' cssClass="cart-modal" onDidDismiss={onDidDismiss} isOpen={isOpen}>
      <IonHeader mode='md'>
        <IonToolbar  >
          <IonLabel> Buy Papers <IonBadge color='success' mode='ios'>{CheckOutPapers.length}</IonBadge></IonLabel>
          <IonButtons slot='end'>
            <IonBackdrop></IonBackdrop>
            <IonButton>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonToolbar mode='md' style={{ minHeight: `100%`, overflow: `scroll` }} color='light'>
          {
            CheckOutPapers.map((paper, index) => {

              return <CheckoutQuestionCard key={index} thisPaper={paper}
                removePaper={() => removePaperFromCheckOut(index)} />
            })
          }
          <div className={`checkout-total`}>
            <IonLabel>
              {CheckOutPapers.length > 1 && CheckOutPapers.map((paper, index) => {
                if (index < CheckOutPapers.length - 1) {
                  return paper.cost + ` ${paper.currency} + `
                }
                return paper.cost + ` ${paper.currency} = `
              })}
              <IonLabel color={`success`}>{costSum + ` `}</IonLabel>
            </IonLabel>
          </div>
          {CheckOutPapers.length > 0 ? <div  >
            <>{/* <IonButton
              
              // onClick={() => {
              //   document.getElementById(`zitopayPaymentOverlay`)?.setAttribute(`style`, JSON.stringify({ display: `none` }))
              //   document.getElementById(`first-pay-button`)?.setAttribute(`style`, JSON.stringify({ backgroundColor: `var(--ion-color-success)` }))
              //   savePapersToStorage()
              // }}
              onClick={()=>{
                   setinitializePayment(true)
              }}
            >
              {/* {uploading ? <><IonSpinner color={`success`}></IonSpinner>
                <IonLabel className={`ion-margin-start`}> saving...</IonLabel>
              </> : <IonLabel >Download</IonLabel>} 
            </IonButton> */}</>
            <CheckoutVerify CheckOutPapers={CheckOutPapers} costSum={costSum}></CheckoutVerify>
          </div> :
            <div style={{ padding: `10px`, textAlign: 'center' }}>
              <IonText color={`medium`}>No Papers Selected</IonText>
            </div>
          }


        </IonToolbar>
      </IonContent>

    </IonModal>
  )
}

export default CheckOutModal
 


// async function savePapersToDatabase() {
//   let tempObject: any = {}

//   for (let i = 0; i < CheckOutPapers.length; i++) {
//     const paper = CheckOutPapers[i]
//     tempObject[`${paper.id}`] = paper
//     setuploading(true)

//     if (user) {
//       app.firestore()
//         .collection(`users`)
//         .doc(user.tel)
//         .collection(`papers`)
//         .doc(`${paper.id}`)
//         .set(tempObject).then(async () => {
//           for (let i = 0; i < CheckOutPapers.length; i++) {
//             const paper = CheckOutPapers[i]
//             const newdownloads = parseInt(`${paper.downloads}`) != NaN ? parseInt(`${paper.downloads}`) + 1 : paper.downloads
//             app.database().ref(`allPapers`).child(paper.id).update({ downloads: newdownloads.toString() }).catch(alert)

//             //updating firestore uploaders downloads
//             const m = (new Date(Date.now())).getMonth(), y = (new Date(Date.now())).getFullYear();
//             const downloadId = paper.author + `` + Date.now()
//             const uploaderPaper: UploadersTotalDownloads = { cost: paper.cost, currency: paper.currency, date: `${Date.now()}`, month: `${Months[m]}`, tel: paper.author, year: y.toString() }
//             app.firestore().collection(`uploader/${paper.author}/totalDownloads`).doc(downloadId).set(uploaderPaper)
//             app.firestore().collection(`uploader/${paper.author}/papers/${paper.id}/downloads`).doc(downloadId).set(uploaderPaper)

//             removePaperFromAdded(i)
//           }
//           if (i >= CheckOutPapers.length - 1) {
//             Modals.confirm({ title: `Download SuccessFull`, message: `The Download has completed Successfully.\nGo to Downloads` })
//               .then(res => {
//                 if (res.value == true) {
//                   history.push(`/saved`)
//                   onDidDismiss()
//                 } else {
//                   onDidDismiss()
//                 }
//               })
//           }

//         }).catch((err) => {
//           Modals.alert({ message: `${err.message}`, title: `Upload Error`, buttonTitle: `ok` })
//         }).finally(() => {
//           setuploading(false)
//         })
//     } else {
//       const res = (await Modals.confirm({ title: `Authentication Error`, message: `unable to buy papers because user is not authenticated`, okButtonTitle: `login` })).value
//       if (res) {
//         history.push(`/login`)
//       }

//     }
//   }
//   console.log(tempObject)
// }