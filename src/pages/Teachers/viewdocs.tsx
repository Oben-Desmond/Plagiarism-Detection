import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonModal, IonPage, IonProgressBar, IonRow, IonSpinner, IonText, IonTitle, IonToolbar } from "@ionic/react"
import React, { useEffect, useState } from "react"
import { documentData, SourceDocuments } from "../../components/interfaces/document"
import { detectPlagiarismLevels, getAllDocuments } from "./functions"


const ViewDocs: React.FC = () => {

    const [loading, setloading] = useState(false)
    const [allDocs, setallDocs] = useState<documentData[]>([])

    useEffect(() => {
         
            getDocuments();
    }, [])

    async function getDocuments() {
        const queryData = {
            faculty: `FET`,
            department: `CE`,
            code: `920`,
            year: `2021`
        }
        setloading(true)
        const documents: any[] = await getAllDocuments(queryData)
        setallDocs([...documents])
        setloading(false);
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>welcome teacher</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol></IonCol>
                        <IonCol>
                            <IonCardHeader>
                                <IonCardTitle>your courses</IonCardTitle>
                            </IonCardHeader>
                            <IonCard>
                                <IonList>
                                    {loading ? <IonSpinner></IonSpinner> : allDocs?.map((doc, index) => {
                                        return <StudentDocCard doc={doc} key={index}></StudentDocCard>
                                    })}
                                </IonList>
                            </IonCard>
                        </IonCol>
                        <IonCol></IonCol>
                    </IonRow>

                </IonGrid>
            </IonContent>

        </IonPage>
    )
}

export default ViewDocs


const StudentDocCard: React.FC<{ doc: documentData }> = ({ doc }) => {

    const [viewthisDoc, setviewthisDoc] = useState(false)
    const [progress, setprogress] = useState(false)
    const [sources, setsources] = useState<SourceDocuments[]>([])
    const [ allMatches, setallMatches] = useState<any>({})
    const [level, setlevel] = useState(0)

    
    function openDoc() {
        setviewthisDoc(true)
    }
    

   async function analyzeDoc(){
      setprogress(true)
       const matches= await detectPlagiarismLevels(doc, (lvl)=>setlevel(lvl) );
          setprogress(false)
       if(matches?.detailForMatches){
          
        //   const tempdocs:any[]=Object.values(matches?.detailForMatches).map(res=>Object)
        //   setsources(tempdocs)
          setsources(matches.detailForMatches)
          setallMatches(matches.matchedDocs)
       }
    }
    return (
        <>
        <IonItem button onClick={openDoc} key={`${Math.random()}`}>
            <IonLabel>{doc.student_name}</IonLabel>
            <IonText>{doc.matricle}</IonText>
            
        </IonItem>
        <IonModal onDidPresent={()=> analyzeDoc()} isOpen={viewthisDoc} onDidDismiss={() => setviewthisDoc(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{doc.title}</IonTitle>
                    </IonToolbar>

                </IonHeader>
                <IonContent>
                    <p>
                        {Object.values(doc).map(res => <IonItem>{res}</IonItem>)}
                    </p>
                    <IonButton target={`__blank`} href={`${doc.url}`}>
                        view document
                     </IonButton>
                    <IonCardContent>
                        {progress ? <><IonText>Calculating level of Plagiarism</IonText>
                            <IonCardSubtitle>{level*100}%</IonCardSubtitle></> :
                            sources.map((source, index) => {
                                const copies=allMatches?(allMatches[source.matricle]):2;
                               const percent= copies/60*100
                                return (
                                    <IonToolbar key={index} >
                                        <IonLabel>{source.matricle} <IonLabel color={`danger`}> {percent}% ({copies} copies)</IonLabel></IonLabel>
                                        <IonProgressBar color={`danger`} value={percent/100}></IonProgressBar>
                                    </IonToolbar>
                                )
                            })

                        }
                    </IonCardContent>
                </IonContent>
            </IonModal>
        </>
    )
}