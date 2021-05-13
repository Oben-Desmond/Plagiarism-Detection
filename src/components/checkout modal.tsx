import { IonModal, IonHeader, IonToolbar, IonLabel, IonBadge, IonButtons, IonButton, IonBackdrop, IonIcon, IonContent, IonText, IonSpinner } from "@ionic/react";
import { close } from "ionicons/icons";
import React, { useContext, useEffect, useState } from "react";
import CheckoutQuestionCard from "./checkoutQuestionCard";
import { SearchPaperInterface, userInterface } from "./componentTypes";
import "./style/checkoutModal.css";
import { Plugins } from "@capacitor/core";
import app from "../Firebase";
import CheckoutVerify from "./CheckoutVerify";
import { useHistory } from "react-router";
import { UserContext } from "./RouterOutlet";




const { Modals } = Plugins
const CheckOutModal: React.FC<{ user: userInterface | undefined, removePaperFromAdded: (index: number) => void, isOpen: boolean, onDidDismiss: () => void, CheckOutPapers: SearchPaperInterface[] }> = ({ removePaperFromAdded, isOpen, onDidDismiss, CheckOutPapers }) => {

  const [uploading, setuploading] = useState(false)
  const [costSum, setcostSum] = useState(0 + `FCFA`)
  const { userInfo} = useContext(UserContext)

  const history = useHistory()

  //calculating the ammount for a paper assuming all papers are bought in FCFA
  useEffect(() => {

    let sum = 0
    for (let i = 0; i < CheckOutPapers.length; i++) {
      sum += +CheckOutPapers[i].cost
    }
    setcostSum(sum + ` FCFA`)
  }, [CheckOutPapers])


// this method triggers the prop function that removes all papers from the cart
  function removePaperFromCheckOut(index: number) {
    removePaperFromAdded(index)
  }


  // this function saves papers under the user's reference in firestore database
  async function SavePapersForUser() {
    let tempObject: any = {}
    const user = userInfo
    const papers = CheckOutPapers
    //for loop iterates through Checkout papers
    for (let i = 0; i < CheckOutPapers.length; i++) {
      const paper = CheckOutPapers[i]
      tempObject[`${paper.id}`] = paper
      setuploading(true)

      //condition verifies if the user exists and if he has a number
      if (user && user.tel) {

        //for each iteration firestore is queried and each paper is stored under the users reference in 
        app.firestore()
          .collection(`users`)
          .doc(user.tel)
          .collection(`papers`)
          .doc(`${paper.id}`)
          .set(tempObject).then(async () => {
             //once a paper is stored it is removed from cart
            removePaperFromCheckOut(i);


            /**--------- other sections of the database are updated to persist download information ------------------ */

            // const newdownloads = parseInt(`${paper.downloads}`) != NaN ? parseInt(`${paper.downloads}`) + 1 : paper.downloads
            // app.database().ref(`allPapers`).child(paper.id).update({ downloads: newdownloads.toString() }).catch(alert)

            // //updating firestore uploaders downloads
            // const m = (new Date(Date.now())).getMonth(), y = (new Date(Date.now())).getFullYear();
            // const downloadId = paper.author + `` + Date.now()
            // const uploaderPaper: UploadersTotalDownloads = { cost: paper.cost, currency: paper.currency, date: `${Date.now()}`, month: `${Months[m]}`, tel: paper.author, year: y.toString() }
            // app.firestore().collection(`uploader/${paper.author}/totalDownloads`).doc(downloadId).set(uploaderPaper)
            // app.firestore().collection(`uploader/${paper.author}/papers/${paper.id}/downloads`).doc(downloadId).set(uploaderPaper)

          }).catch((err) => {
            Modals.alert({ message: `${err.message}`, title: `Upload Error`, buttonTitle: `ok` })
          }).finally(() => {
            setuploading(false)
          })
        if (i >= papers.length - 1) {


          //once the process is complete for all papers a confirmation modal is show to take the users to the saved page where they can view papers

          Modals.confirm({ title: `Download SuccessFull`, message: `The Download has completed Successfully.\nGo to Downloads` })
            .then(res => {
              if (res.value === true) {
                history.push(`/saved`)
                onDidDismiss()
              } else {
                onDidDismiss()
              }
            })
        }
      } else {

        //redirects the user to the login page in the case where user does not locally exist
         await Modals.confirm({ title: `Authentication Error`, message: `unable to buy papers because user is not authenticated`, okButtonTitle: `login` })
         history.push(`/login`)
        

      }

      console.log(tempObject)
    }
  }
  return (
    <IonModal mode='ios' cssClass="cart-modal" onDidDismiss={onDidDismiss} isOpen={isOpen}>
     
     {/* ----------------     modal  header            -------------- */}
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
        {/* ----------------        all added papers appear here             ---------------- */}
        <IonToolbar mode='md' style={{ minHeight: `100%`, overflow: `scroll` }} color='light'>
          {
            CheckOutPapers.map((paper, index) => {

              return <CheckoutQuestionCard key={index} thisPaper={paper}
                removePaper={() => removePaperFromCheckOut(index)} />
            })
          }

          {/* -----------------        Displaying the total cost of all the papers         ------------------- */}
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


            {/*---------------- buttons an spinners to initialize and process payments and modals-------------------------------  */}
            <div style={{ textAlign: `center` }}>
              {uploading && <IonButton color={`dark`}><IonSpinner color={`success`}></IonSpinner>
                <IonLabel className={`ion-margin-start`}> saving...</IonLabel></IonButton>}
            </div>

            
             {/* ------------------- controls processing and payment verification-----------------------   */}
            <CheckoutVerify validateSavedPapers={() => SavePapersForUser()} CheckOutPapers={CheckOutPapers} costSum={costSum}></CheckoutVerify>
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