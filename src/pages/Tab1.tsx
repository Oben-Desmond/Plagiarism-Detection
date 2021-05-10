import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonPopover, IonProgressBar, IonRippleEffect, IonRow, IonSearchbar, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import app from '../Firebase';
import { arrowForward, cart, cloudDone, logoTwitter, search } from 'ionicons/icons';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { SearchPaperInterface } from '../components/componentTypes';

 
const Tab1: React.FC = () => {
  const [spinner, setspinner] = useState(false)
  const [papers, setpapers] = useState<SearchPaperInterface[]>([]) 
  const [searching, setsearching] = useState<boolean>(false)
  const searchBarRef = useRef<HTMLIonSearchbarElement>(null)
  useEffect(() => {

  }, [])
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signedIn',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      app.auth.GoogleAuthProvider.PROVIDER_ID,
      app.auth.FacebookAuthProvider.PROVIDER_ID,
      app.auth.PhoneAuthProvider.PROVIDER_ID
    ],
  };
  
  function SearchPaper() {
    let searchtext = searchBarRef.current?.value
    let searchResult: string[] = []
    if (searchtext) {
      setsearching(true)
      let searchTextArray = searchtext.toLowerCase().split(` `)
      let len = searchTextArray.length
      for (let i = 0; i < len; i++) {
        let word = searchTextArray[i]
        app.database().ref(`index`)
          .child(word)
          .once('value', snapshot => {
            let value = snapshot.val()
            if (value) {
              searchResult.push(value)
            }
            else {
              setsearching(false)
              setpapers([])
            }
            if (len == i + 1) {
              RankKeys(searchResult)

            }
          },(err)=>{
            alert(err.message)
            setsearching(false)
          })
      }
    }

  }

  function RankKeys(keyArray: string[]) {
    let ResultsObject: any = {}
    console.log(keyArray)
    for (let i = 0; i < keyArray.length; i++) {
      let matchesArray = Object.values(keyArray[i])
      for (let j = 0; j < matchesArray.length; j++) {
        if (ResultsObject[matchesArray[j]] != undefined) {
          ResultsObject[matchesArray[j]] += 1
        }
        else {
          ResultsObject[matchesArray[j]] = 1
        }
      }
    }

    let sortedResults = Object.keys(ResultsObject)
      .sort(function (a, b) { return ResultsObject[a] - ResultsObject[b] }).reverse()
    let fetchedPapers: SearchPaperInterface[] = []
    for (let i = 0; i < sortedResults.length; i++) {

      app.database().ref(`papers`).child(sortedResults[i])
        .once(`value`, (snapshot) => {

          let value = snapshot.val()
          if (value) {
            //  setdb(JSON.stringify(value))
            fetchedPapers.push(value)
            console.log(value, `value`)
          }
          if (sortedResults.length == i + 1) {
            setsearching(false)
            setpapers([...fetchedPapers])
            console.log(papers)
          }

        })

    }

  }
  return (
    <IonPage>
      <IonHeader className='main-Header' >
        <div className='header-div'>
          <IonTitle  >Ques<IonText color='primary'>ers</IonText></IonTitle>
        </div>
      </IonHeader>
      <IonHeader>
        <div className='header-div'>
         <IonButtons>
         <IonSearchbar ref={searchBarRef} mode='ios'>
          </IonSearchbar>

          <IonFabButton slot='end' onClick={SearchPaper} mode='ios' size='small' >
            <IonIcon icon={arrowForward}></IonIcon>
          </IonFabButton>
         </IonButtons>
        </div>
      </IonHeader>
      {
        searching && <IonProgressBar type='indeterminate'></IonProgressBar>}
      <IonContent>
        {spinner && <IonSpinner></IonSpinner>}
        {papers.map((paper, index) => {
          return (
            <IonCard button key={index}>
              <IonCardHeader>
                <IonCardTitle>{paper.title}</IonCardTitle>firebase
              </IonCardHeader>
              <IonCardContent>
                <IonLabel>
                  {paper.description}
                </IonLabel>
              </IonCardContent>
              <IonItem color='none' lines='none'>
                <IonChip>
                  <IonIcon icon={cloudDone} />
                  <IonLabel>{paper.downloads}</IonLabel>
                </IonChip>

              </IonItem>
            </IonCard>
          )
        })}
 <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={app.auth()} />
      </IonContent>
      <IonFab vertical='bottom' horizontal='end'>
        <IonFabButton  >
          <IonIcon icon={cart} />
          <IonBadge color='dark'>3</IonBadge>
        </IonFabButton>
      </IonFab>
      
    </IonPage>
  );
};

export default Tab1;

// function AddPopOverContent() {

//   function submitPaper(Event: any) {
//     Event.preventDefault()
//     let title: string = Event.target.title.value;
//     let description = Event.target.desc.value;
//     let downloads = Event.target.downloads.value;
//     let paper: SearchPaperInterface = { title, description, downloads,previewUrl }
//     //  alert(JSON.stringify(paper))
//     let titleArray = title.toLowerCase().trim().split(` `)

//     app.database()
//       .ref(`papers`)
//       .push(paper).then((res) => {
//         for (let i = 0; i < titleArray.length; i++) {
//           app.database().ref(`index`)
//             .child(titleArray[i]).push(res.key).then(() => {
//               if (titleArray.length - 1 == i) {
//                 alert(`successfull !!`)
//               }
//             })
//         }
//       })
//   }

//   return (
//     <IonContent>
//       <IonCardHeader color='secondary'>
//         <IonLabel>Add</IonLabel>
//       </IonCardHeader>
//       <form onSubmit={submitPaper}>
//         <IonCardContent>
//           <IonItem>
//             <IonLabel position='floating'>
//               title
//         </IonLabel>
//             <IonInput name="title"></IonInput>
//           </IonItem>
//           <IonItem>
//             <IonLabel position='floating'>
//               description
//         </IonLabel>
//             <IonTextarea name="desc"></IonTextarea>
//           </IonItem>
//           <IonItem>
//             <IonLabel position='floating'>
//               downloads
//         </IonLabel>
//             <IonInput name="downloads"></IonInput>
//           </IonItem>
//           <IonButton type="submit" expand="block">ADD</IonButton>
//         </IonCardContent>
//       </form>
//     </IonContent>
//   )
// }