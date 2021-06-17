import { IonItem, IonLabel, IonText, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonCardContent, IonCardSubtitle, IonProgressBar } from "@ionic/react"
import React, { useEffect, useState } from "react"
import { detectPlagiarismLevels } from "../pages/Teachers/functions"
import { documentData, SourceDocuments } from "./interfaces/document"



const PlagiarismLevel: React.FC<{ doc: documentData }> = ({ doc }) => {

    const [progress, setprogress] = useState(false)
    const [sources, setsources] = useState<SourceDocuments[]>([])
    const [allMatches, setallMatches] = useState<any>({})
    const [level, setlevel] = useState(0)

    useEffect(() => {

        analyzeDoc()

    }, [doc])


    async function analyzeDoc() {
        setprogress(true)
        detectPlagiarismLevels(doc, (lvl) => setlevel(lvl),(matches)=>{
            setprogress(false)
            if (matches?.detailForMatches) {
    
                //   const tempdocs:any[]=Object.values(matches?.detailForMatches).map(res=>Object)
                //   setsources(tempdocs)
                setsources(matches.detailForMatches)
                setallMatches(matches.matchedDocs)
                console.log(matches.detailForMatches)
            }
        });
      
    }
    return (
        < >
            <IonContent>

                <IonCardContent>
                    {progress ? <><IonText>Calculating level of Plagiarism</IonText>
                        <IonCardSubtitle>{level * 100}%</IonCardSubtitle></> :
                        sources.map((source, index) => {
                            const copies = allMatches ? (allMatches[source.matricle]) : 2;
                            const percent = copies / 60 * 100
                            return (
                                <IonToolbar key={index} >
                                    <IonLabel>{source.student_name} <IonLabel color={`danger`}> {percent}% ({copies} copies)</IonLabel></IonLabel>
                                    <IonProgressBar color={`danger`} value={percent / 100}></IonProgressBar>
                                </IonToolbar>
                            )
                        })

                    }
                    { sources.length<=0 && !progress && <IonText color={`primary`}>Original Report, NO COPIES FROM OTHER DOCUMENTS</IonText>}
                </IonCardContent>
            </IonContent>
        </>
    )
}

export default PlagiarismLevel