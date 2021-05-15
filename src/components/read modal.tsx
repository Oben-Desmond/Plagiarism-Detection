import { IonModal, IonHeader, IonToolbar, IonBackdrop, IonIcon, IonContent, IonSegment, IonSegmentButton, IonSlides, IonSlide, IonImg, IonLabel, IonButton, IonList, IonFooter, IonFab, IonActionSheet, CreateAnimation, IonSpinner, IonTitle, IonItem, IonFabButton, IonPopover, IonText, IonCardContent } from "@ionic/react";
import { add, chatbox, close, ellipsisVertical, shareSocial, star } from "ionicons/icons";
import "../css/previewModal.css";
import React, { useEffect, useRef, useState } from "react";
import { savedPaperInterface } from "./componentTypes";
import "./style/readmodal.css";
import { Plugins } from "@capacitor/core";
import { BounceStar } from "../data/animations";
import ReviewPopover from "./review popover";
import { urlToBase64 } from "../data/urlToBase64";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";


const { Storage, Share } = Plugins

const ReadModal: React.FC<{
    isOpen: boolean, onDidDismiss: () => void
    thisPaper: savedPaperInterface
}> = ({ isOpen, onDidDismiss, thisPaper }) => {


    const slider = useRef<HTMLIonSlidesElement>(null);
    const [value, setValue] = useState("0");
    const [starred, setstarred] = useState(false);
    const [viewPop, setviewPop] = useState(false);
    const [viewReview, setviewReview] = useState(false);

    const slideOpts = {
        initialSlide: 0,
        speed: 400,
        loop: false,
        pagination: {
            el: null
        },
        zoom: {
            scale: 3,
            enabled: true

        }
    };

    useEffect(() => {

        return (() => {
            setValue(`0`)
        })
    }, [])

    const handleSegmentChange = (e: any) => {
        setValue(e.detail.value);
        slider.current?.slideTo(e.detail.value);
    };

    const handleSlideChange = async (event: any) => {
        let index: number = 0;
        await event.target.getActiveIndex().then((value: any) => (index = value));
        setValue('' + index)
    }

    function readfunc() {
        Plugins.Accessibility.speak({ value: thisPaper.title + ` \n find the square are of a square with sides 6 centimeters` })
    }

    async function starThisPaper() {
        let papervalue = (await Storage.get({ key: `starredPapers` })).value

        let starredpaptemp: savedPaperInterface[] = []
        if (papervalue) {
            let starredpaptemp: savedPaperInterface[] = JSON.parse(papervalue)
            let temp = false;
            for (let i = 0; i < starredpaptemp.length; i++) {
                if (starredpaptemp[i].id == thisPaper.id) {
                    temp = true
                }
            }
            if (temp) {
                return
            }
            else {
                starredpaptemp.push(thisPaper)
                await Storage.set({ key: `starredPapers`, value: JSON.stringify(starredpaptemp) })

            }
        }
        else {
            starredpaptemp.push(thisPaper)
            await Storage.set({ key: `starredPapers`, value: JSON.stringify(starredpaptemp) })
        }
        setstarred(true)
        console.log(papervalue)


    }
    const sharePaper = () => {
        Share.share({
            dialogTitle: `Share Question with Friends`,
            text: `check out ${thisPaper.title} on Quesers`, title: `Quesers Questions and Answers`, url: `https://play.google.com/store/apps/details?id=io.ionic.quesers`
        })
    }

    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onDidDismiss}  >
            <IonHeader>
                <IonToolbar color='dark'>
                    <IonItem lines={`none`} color={`none`}>
                        <IonButton fill={`clear`} slot={`start`}>
                            <IonBackdrop></IonBackdrop>
                            <IonIcon color="success" icon={close} ></IonIcon>
                        </IonButton>
                        <IonLabel  >{thisPaper?.title}</IonLabel>
                        <IonButton onClick={() => {

                            setviewPop(true)

                        }} fill={`clear`} slot={`end`}>
                            <IonIcon icon={ellipsisVertical} ></IonIcon>
                            <IonActionSheet cssClass={`read-menu-action`} buttons={[{ text: `add Review`, icon: chatbox, handler: () => setviewReview(true) }
                                , { text: `star paper`, icon: star, handler: () => starThisPaper() }, { text: `share`, icon: shareSocial, handler: () => sharePaper() }]}
                                isOpen={viewPop} onDidDismiss={() => setviewPop(false)} />

                        </IonButton>
                    </IonItem>
                </IonToolbar>
            </IonHeader>

            <IonContent>
                <ReviewPopover thisPaper={thisPaper} isOpen={viewReview} onDidDismiss={() => { setviewReview(false) }}></ReviewPopover>



                <IonSlides options={slideOpts} onIonSlideDidChange={(e) => handleSlideChange(e)} ref={slider} className={`paper-slides`}>
                    <IonSlide>
                        <IonList    >
                            {thisPaper?.questionUrl?.map((url, index) => {
                                return <PaperImage key={index} url={url}></PaperImage>
                            })}
                        </IonList>
                    </IonSlide>
                    <IonSlide >
                        <IonList>
                            {thisPaper?.answerUrl?.map((url, index) => {
                                return <PaperImage key={index} url={url} />
                            })}
                        </IonList>
                    </IonSlide>
                </IonSlides>
            </IonContent>

            <IonFab horizontal={`center`} vertical={`center`}>
                <CreateAnimation onFinish={{ callback: () => { setstarred(false) } }} duration={2000} easing={`linear`} play={starred} keyframes={BounceStar}>
                    <IonIcon style={{ transform: `scale(0)` }} color={`warning`} size={`large`} icon={star}></IonIcon>
                </CreateAnimation>
            </IonFab>


            <IonFooter>
                <IonToolbar color={`dark`}>
                    <IonSegment className={`reader-controller`} color={`success`} onIonChange={handleSegmentChange} value={value}>
                        <IonSegmentButton value={`0`}>
                            <IonLabel>Question</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value={`1`}>
                            <IonLabel>Answer</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonFooter>

        </IonModal>
    )
}

export default ReadModal

let a = -1;

export const PaperImage: React.FC<{ url: string }> = ({ url }) => {
    const [img, setimg] = useState(``)
    const [imgLoaded, setimgLoaded] = useState(false)
    const [show, setshow] = useState(false)
    const [ZoomHint, setZoomHint] = useState(false)
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
            <IonPopover isOpen={ZoomHint} >
                <IonCardContent>
                    <IonText><b> Tap the Page</b>. It will pop up to allow you zoom</IonText>
                    <IonToolbar>
                        <IonButton slot={`end`} fill={`clear`}>
                            <IonBackdrop>
                            </IonBackdrop>
                        got it</IonButton>

                    </IonToolbar>
                </IonCardContent>
            </IonPopover>
            {!imgLoaded && <IonSpinner color={`primary`}></IonSpinner>}
            <TransformWrapper pinch={{ disabled: true }} zoomIn={{ disabled: true }} zoomOut={{ disabled: true }} 
            onPinchingStop={() => {
                a=a+1
                if (!a) setZoomHint(true);
                setshow(true)
            }} wheel={{ disabled: true }} pan={{ disabled: true }} options={{ limitToBounds: true, }} >
                <TransformComponent>
                    <div >
                        <IonImg style={{ opacity: 1, transition: `opacity 1s` }} onClick={() => setshow(true)} onIonImgDidLoad={() => setimgLoaded(true)} src={img} />
                    </div>
                </TransformComponent>
            </TransformWrapper>
            <IonModal swipeToClose={true} mode={`ios`} onDidDismiss={() => setshow(false)} cssClass={`zoom-img`} isOpen={show}>
                <IonHeader>
                    <TransformWrapper defaultPositionX={-21.27} defaultPositionY={-95.63} defaultScale={1.32} options={{ limitToBounds: true }} >
                        <TransformComponent>
                            <IonImg style={{ height: `100vh` }} src={img}></IonImg>
                        </TransformComponent>
                    </TransformWrapper>
                </IonHeader>
                <IonFab vertical={`bottom`} horizontal={`center`}>
                    <IonFabButton>
                        <IonBackdrop></IonBackdrop>
                        <IonIcon icon={close}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonModal>
        </div>
    )
}


