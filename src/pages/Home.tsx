import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonLoading, IonPage, IonRow, IonTextarea, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { splitSentence, uploadBlocks, uploadDocument, uploadDocumentParams } from '../components/Funcions/Home/home';
import { docBlockInterface, documentData } from '../components/interfaces/document';
import { removeOccurence } from '../components/Funcions/Home/general';

const Home: React.FC = () => {
  const [text, settext] = useState(``)
  const [root,setroot]=useState<any>({})
  const [loading,setloading]=useState<boolean>(false)

   
  async function submit(event: any) {
    event.preventDefault()
    const text =  event.target.text.value.toString() 
    console.log(text)
    const file = event.target.file.files[0]
    settext(text)
    let blocks= splitSentence(text,10);
    const blockData:docBlockInterface={
      date:`${Date.now()}`,
      code:`920`,
      title:`Amazing Paper Here`,
      matricle:`FE18A060`,
      student_name:`Sax`,
      blockLength:blocks.length+``,
    }
    const docData:documentData={
      ...blockData,
      department:`CE`,
      faculty:`FET`,
      url:`http://www.africau.edu/images/default/sample.pdf`,
      status:`pending`,
      tutor:`Madam Zille`,
      student_contact:`6724688839`,
      student_email:`l0oo@gmail.com`,
      review_message:`bb`
      

    }
    
    setloading(true)
       uploadBlocks(blocks,blockData);
    const url =  await uploadDocument(file,blockData)
      await uploadDocumentParams({...docData,url})
     setloading(false)
   
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
             <IonLoading isOpen={loading} message={`uploading`} onDidDismiss={()=>setloading(false)} ></IonLoading>
        <IonGrid>
          <IonRow>
            <IonCol></IonCol>
            <IonCol>
              <IonCard>
                <IonCardHeader>
                  Upload words
                </IonCardHeader>
                <IonCardContent>
                  <form onSubmit={submit}>
                    <IonItem color={`light`}>
                      <IonLabel position={`floating`}>Upload Text</IonLabel>
                      <IonTextarea name={`text`} rows={6}></IonTextarea>
                    </IonItem>
                    <IonItem>
                      <input name={`file`} type={`file`}></input>
                    </IonItem>
                    <IonButton type={`submit`}>upload</IonButton>
                  </form>
                </IonCardContent>
              </IonCard>
               
            </IonCol>
            <IonCol>
              <IonLabel>
                {text}
              </IonLabel>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* <ExploreContainer /> */}
      </IonContent>
    </IonPage>
  );
};

export default Home;
