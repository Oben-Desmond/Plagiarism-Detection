import { IonModal, IonHeader, IonToolbar, IonBackdrop, IonIcon, IonContent, IonSegment, IonSegmentButton, IonSlides, IonSlide, IonImg, IonLabel, IonButtons, IonButton, IonList, IonSpinner, IonFab, IonToast } from "@ionic/react";
import { arrowBack, download } from "ionicons/icons";
import "../css/previewModal.css";
import React, { useEffect, useRef, useState } from "react";
import { SearchPaperInterface } from "./componentTypes";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { urlToBase64 } from "../data/urlToBase64";
import { Plugins } from "@capacitor/core";
import "./style/readmodal.css";

const { Storage } = Plugins

const PreviewModal: React.FC<{ isOpen: boolean, thisPaper: SearchPaperInterface, onDidDismiss: () => void, DownloadThisPaper: () => void }> = ({ isOpen, onDidDismiss, DownloadThisPaper, thisPaper }) => {

    const slider = useRef<HTMLIonSlidesElement>(null);
    const [value, setValue] = useState("0");
    const [showToast, setshowToast] = useState(false);

    const slideOpts = {
        initialSlide: 0,
        speed: 400,
        loop: false,
        pagination: {
            el: null
        },

    };

    // a function to handle the segment changes
    const handleSegmentChange = (e: any) => {
        setValue(e.detail.value);
        slider.current!.slideTo(e.detail.value);
    };

    // a function to handle the slider changes
    const handleSlideChange = async (event: any) => {
        let index: number = 0;
        await event.target.getActiveIndex().then((value: any) => (index = value));
        setValue('' + index)
    }
    //function calls props to handle ad paper to cart
    function DownloadPaper() {
        DownloadThisPaper()
    }
    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={()=>{
                setshowToast(false)
                onDidDismiss()

            }}
            onDidPresent={()=>{}}
        >
            <IonHeader>
                <IonToolbar color='dark'>
                    <IonButtons slot="start">
                        <IonButton>
                            <IonBackdrop></IonBackdrop>
                            <IonIcon size='large' color="success" icon={arrowBack} ></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonLabel  >{thisPaper.title}</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonSegment onIonChange={handleSegmentChange} value={value}>
                <IonSegmentButton value="0">Question</IonSegmentButton>
                <IonSegmentButton value="1">Answer</IonSegmentButton>
            </IonSegment>
            <IonContent>

                {/* ------------          slides that contain preview Questions and Answers           ------------------- */}

                <IonSlides options={slideOpts} onIonSlideDidChange={(e) => handleSlideChange(e)} ref={slider} className="preview-slides">
                    <IonSlide >
                        <IonList>
                            {thisPaper?.questionUrl?.map((img, index) => {
                                if (index === 0) return (
                                    <React.Fragment key={index}>
                                        <PreviewPaperImage imageLoaded={()=>{setshowToast(true)}} style={{ maxHeight: `35vh`, margin: 0 }} className="" url={img} alt={thisPaper.description} />
                                        <PreviewPaperImage imageLoaded={()=>{}} style={{}} className="hide" key={index} url={img} alt={thisPaper.description} />
                                    </React.Fragment>)
                                return <PreviewPaperImage imageLoaded={()=>{}} style={{ margin: `0px`, padding: 0 }} className="hide" key={index} url={img} alt={thisPaper.description} />
                            })}
                        </IonList>
                    </IonSlide>
                    <IonSlide>
                        <IonList>
                            {thisPaper?.answerUrl?.map((img, index) => {
                                return <PreviewPaperImage imageLoaded={()=>{}} style={{}} className="hide" key={index} url={img} alt={thisPaper.description} />

                            })}
                        </IonList>
                    </IonSlide>
                </IonSlides>
                {/* <IonFab style={{transform:`translateX(45%) translateY(28px)`}} vertical={`center`} horizontal={`start`}>
                    <IonButton onClick={DownloadPaper}>
                        <IonIcon slot="start" icon={download} />
                        <IonLabel>Get full copy</IonLabel>
                    </IonButton>
                </IonFab> */}
                <IonToast onDidDismiss={()=>setshowToast(false)}  buttons={[{text:`GET FULL COPY`,cssClass:`get-full`, side:`end`, handler:()=>DownloadPaper()}]} isOpen={showToast} message={`content is intentionally blurred`}></IonToast>
            </IonContent>
            {/* ------------      Button tiggers the add to cart action for this event    ------------------- */}


        </IonModal>
    )
}

export default PreviewModal



export const PreviewPaperImage: React.FC<{ url: string, className: string, style: any, alt: string, imageLoaded:()=>void }> = ({ url, className, alt, style,imageLoaded }) => {
    const [img, setimg] = useState(``)
    const [imgLoaded, setimgLoaded] = useState(false)
    const [show, setshow] = useState(false)

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
            <IonImg className={className} style={style} onIonImgDidLoad={() =>{ setimgLoaded(true);imageLoaded()}} alt={alt} src={img} />
            <IonModal swipeToClose={true} mode={`ios`} onDidDismiss={() => setshow(false)} cssClass={`zoom-img`} isOpen={show}>
                <IonHeader>
                    <IonSlide style={{ height: `100vh` }}>
                        <TransformWrapper defaultScale={1.1} options={{ limitToBounds: false }} >
                            <TransformComponent>
                                <IonImg style={{ height: `100vh` }} src={img}></IonImg>
                            </TransformComponent>
                        </TransformWrapper>
                    </IonSlide>
                </IonHeader>
            </IonModal>
        </div>
    )
}


