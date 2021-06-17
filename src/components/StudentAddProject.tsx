import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPopover, IonProgressBar, IonSelect, IonSelectOption, IonSlide, IonSlides, IonSpinner, IonToolbar } from "@ionic/react";
import { add, arrowForward, book, bookmark, removeOutline, sync, trash, trashBin } from "ionicons/icons";
import React, { useRef, useState } from "react";
import { splitSentence, uploadBlocks, uploadDocument, uploadDocumentParams } from "./Funcions/Home/home";
import { fetchData, uploadProjectDocument } from "./Funcions/Home/student";
import app from "../Firebase";
import { docBlockInterface, documentData, StudentProfile } from "./interfaces/document";




const StudentAddProject: React.FC<{ isOpen: boolean, onDidDismiss: () => void; student: StudentProfile }> = ({ isOpen, onDidDismiss, student }) => {

    let colors = [`success`, `success`, `secondary`, `secondary`, `tertiary`, `tertiary`, `dark`, `dark`, `success`, `success`, `warning`]

    const [docurl, setdocurl] = useState<string>(``)
    const [colorIndex, setcolorIndex] = useState<number>(0)
    const [pdfText, setpdfText] = useState<string>(``)
    const [progress, setprogress] = useState<number | undefined>()
    const [docFile, setdocFile] = useState<File>()
    const [showDeleteAlert, setshowDeleteAlert] = useState(false)
    const filePicker = useRef<HTMLInputElement>(null)
    const [tab, settab] = useState<number>(0)
    const [code, setcode] = useState<string>(``)
    const [title, settitle] = useState<string>(``)
    const [tutor, settutor] = useState<string>(``)
    const [loading, setloading] = useState(false)

    async function uploadDoc(event: any | { target: { files: any[]; }; }) {
        const file = event.target.files[0]
        setdocFile(file)
        console.log(file)

        const url: string | null | any = await uploadProjectDocument(file, student, (level: number) => { setprogress(level) }, (url: string) => { setdocurl(url); setprogress(undefined); settab(1) }, setpdfText)
    }

    function deleteDoc() {
        console.log(`delete alert`)
        setshowDeleteAlert(true);
    }

    function changeColor() {
        setcolorIndex((colorIndex) => ((colorIndex + 1) % colors.length))
    }
    function goNext() {
        settab(1)
    }
    function goPrev() {
        settab(0)

    }


    function changeUrl(event: any) {

     event.preventDefault()
     const url=event.target.url.value.toString()
     setdocurl(url)
      
    //  fetchData(`document.pdf`,url,(text)=>{
    //      setpdfText(text)
    //  }) 
     settab(1)


    }

    async function submit(event: any) {

        const { matricle, faculty, department, name, email } = student
       console.log(pdfText)
        const text = pdfText
        let blocks = splitSentence(text, 10);
        console.log(blocks.length)
        const blockData: docBlockInterface = {
            date: `${Date.now()}`,
            code,
            title,
            matricle,
            student_name: name,
            blockLength: blocks.length + ``,
        }
        const docData: documentData = {
            ...blockData,
            department,
            faculty,
            url: docurl,
            status: `pending`,
            tutor,
            student_contact: `6720000000`,
            student_email: email,
            review_message: ``


        }

        setloading(true)

        console.log(docData)
        uploadBlocks(blocks, blockData); 
        app.database().ref(`texts`).child(docData.matricle).child(docData.code).set(text)

        await uploadDocumentParams({ ...docData})
        setloading(false)
        settitle(``)
        setcode(``)
        settutor(``)
        setshowDeleteAlert(false)
        setdocurl(``)
        settab(0)

    }

return (
    <IonModal isOpen={isOpen} onDidDismiss={onDidDismiss}>
        <IonHeader>
            <IonToolbar >
                <IonLabel className={`ion-margin`}>upload</IonLabel>
            </IonToolbar>
        </IonHeader>
        {  !!progress && <IonProgressBar value={progress}></IonProgressBar>}
        <IonContent>
            <IonLoading message={`uploading`} onDidDismiss={()=>setloading(false)} isOpen={loading}></IonLoading>
            <IonAlert header={`delete this document`} buttons={[{ text: `cancel`, role: `destructive` }, { text: `ok`, handler: () => setdocurl(``) }]} message={`confirm deleting of this document`} onDidDismiss={() => setshowDeleteAlert(false)} isOpen={showDeleteAlert}></IonAlert>
            {!!progress && <IonSpinner onAnimationEnd={changeColor} color={colors[colorIndex]}></IonSpinner>}
            <IonToolbar style={{ textAlign: `center`, minHeight: `130px` }}>
                {tab == 0 && <div style={{ margin: `20px`, display: `block` }}>
                    {docurl && <><IonCard><IonItem button href={`${docurl}`} lines={`none`} >
                        <IonIcon color={`success`} slot={`start`} icon={book}></IonIcon>
                        <IonLabel>{docFile?.name}</IonLabel>
                    </IonItem>
                        <IonToolbar>
                            <IonButtons slot={`end`} >
                                <IonButton onClick={deleteDoc} color={`secondary`}>
                                    <IonIcon icon={trash} />
                                </IonButton>
                                <IonButton onClick={() => filePicker.current?.click()} color={`tertiary`}>
                                    <IonIcon icon={sync} />
                                </IonButton>


                            </IonButtons>
                        </IonToolbar>
                    </IonCard>
                        <IonToolbar className={`ion-padding`}>
                            <IonFabButton slot={`end`} onClick={() => goNext()} color={`dark`} >
                                <IonIcon icon={arrowForward} />
                            </IonFabButton>
                        </IonToolbar>
                    </>
                    }
                    {!docurl && <>
                        <IonButton onClick={() => filePicker.current?.click()} style={{ marginTop: `40px` }}>Upload PDF document</IonButton>
                    </>}
                    {/* {
                        !docurl && <form onSubmit={changeUrl}><IonItem >
                            <IonLabel position={`floating`}>Enter URL of Document</IonLabel>
                            <IonInput required name={`url`} ></IonInput>
                            <IonButton type={`submit`} slot={`end`}>OK</IonButton>
                        </IonItem>
                        </form>
                    } */}
                </div>}

                {tab !== 0 && <div style={{ margin: `20px` }}>
                    {docurl && <IonCardContent>
                        <IonCardHeader>
                            <IonCardTitle>Fill in the information Required</IonCardTitle>
                        </IonCardHeader>
                        <IonItem>
                            <IonLabel position={`floating`}>Course Title</IonLabel>
                            <IonInput onIonChange={(e:any) => settitle(e.detail.value)} value={title} name={`title`} />
                        </IonItem>

                        <IonItem>
                            <IonLabel position={`floating`}>Course Code</IonLabel>
                            <IonInput onIonChange={(e:any) => setcode(e.detail.value)} value={code} name={`code`} />
                        </IonItem>
                        <IonItem>
                            <IonLabel position={`floating`}>Tutor name</IonLabel>
                            <IonInput onIonChange={(e:any) => settutor(e.detail?.value)} value={tutor} name={`tutor`} />
                        </IonItem>
                        <IonItem>
                            <IonLabel position={`floating`}>Copy all the text in your document and paste here</IonLabel>
                            <IonInput onIonChange={(e:any) => setpdfText(e.detail.value)} value={pdfText} name={`title`} />
                        </IonItem>
                        <IonToolbar>
                            <IonButton fill={`outline`} onClick={() => goPrev()} slot={`start`} color={`dark`} style={{ marginTop: `40px` }}>previous</IonButton>
                            <IonButton onClick={submit} slot={`end`} color={`dark`} style={{ marginTop: `40px` }}>submit</IonButton>
                        </IonToolbar>
                    </IonCardContent>}
                </div>}
            </IonToolbar>
            <input style={{ visibility: `hidden` }} ref={filePicker} type="file" onChange={uploadDoc} name="" id="" />
        </IonContent>
    </IonModal>
)
                    }

export default StudentAddProject