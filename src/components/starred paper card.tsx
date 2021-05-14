import { Plugins } from "@capacitor/core";
import { IonCard, IonIcon, IonButton, IonCardHeader, IonCardTitle, IonProgressBar, IonToolbar, IonButtons, IonBackdrop, IonFab, IonFabButton, IonHeader, IonImg, IonModal, IonSpinner } from "@ionic/react";
import { close } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { urlToBase64 } from "../data/urlToBase64";
import { savedPaperInterface } from "./componentTypes";
import ReadModal, { PaperImage } from "./read modal";
import "./style/starredCard.css";

const {Modals,Storage}=Plugins
const StarredPaperCard: React.FC<{ deleteFromStarred:()=>void,thisPaper: savedPaperInterface, color: string }> = (props) => {
    const [readPaper, setreadPaper] = useState(false)
    const [paperColor, setpaperColor] = useState(props.color)

    const { thisPaper,deleteFromStarred } = props
    const { title, answerUrl, questionUrl } = thisPaper

    function removePaper() {
         Modals.confirm({message:`This will remove this paper from starred list`,title:`Remove From Starred`})
          .then((res)=>{
              if(res.value){
                deleteFromStarred()
              }else{

              }
          })
        }
    return (
        <IonCard  className={`starred-card`} >
            <IonToolbar className={`header`}>
                <IonButtons onClick={() => removePaper()} slot={`end`}>
                    <IonButton>
                        <IonIcon icon={close} />
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <div onClick={() => setreadPaper(true)} className={`saved-container-img`}>
                <PaperStarredImage url={questionUrl[0]} />
            </div >
            <IonCardHeader  onClick={() => setreadPaper(true)}  >
                <IonToolbar color={`none`}>
                    <IonCardTitle>{title}</IonCardTitle>
                </IonToolbar>
            </IonCardHeader>
             <ReadModal thisPaper={thisPaper} isOpen={readPaper} onDidDismiss={() => { setreadPaper(false) }}> </ReadModal>
            <IonProgressBar color={paperColor}></IonProgressBar>

        </IonCard>
    )
}

export default StarredPaperCard





 const PaperStarredImage: React.FC<{ url: string }> = ({ url }) => {
    const [img, setimg] = useState(``)

    const [imgLoaded, setimgLoaded] = useState(false)

    useEffect(() => {
        async function initImg() {
            try {
                const str = (await Storage.get({ key: url })).value;

                if (str) {
                    setimg(str);
                    console.log(`img stored`);
                    return;
                }
                else {
                    urlToBase64(url, (newVal) => {
                        Storage.set({ key: url, value: newVal });
                        setimg(url);
                    })
                }
            }
            catch (err) {
                console.log(err)
            }

        }
        if (url) {
            initImg()
        }
    }, [])
    return (
        <div style={{ textAlign: `center`, minHeight: imgLoaded ? `auto` : `200px` }}>
            {!imgLoaded && <IonSpinner color={`primary`}></IonSpinner>}
            <div style={{ background: `#b0daa9`, transition: `background 1s` }}>
                <IonImg style={{ opacity: 1, transition: `opacity 1s` }}   onIonImgDidLoad={() => setimgLoaded(true)} src={img} />
            </div>
             
        </div>
    )
}


