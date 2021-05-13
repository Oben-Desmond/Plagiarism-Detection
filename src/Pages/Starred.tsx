import { CreateAnimation, IonCardContent, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import React, { useEffect, useRef, useState } from 'react'
import { localImages } from '../img/Images'
import '../css/Starred.css'
import { Plugins } from '@capacitor/core'
import { savedPaperInterface } from '../components/componentTypes'
import StarredPaperCard from '../components/starred paper card'
import { star } from 'ionicons/icons'
import { fallKeyFrame } from '../data/animations'

const { Storage } = Plugins

const Starred: React.FC = () => {
    const [starredPaper, setstarredPaper] = useState<savedPaperInterface[]>([])

    const refresherRef = useRef<HTMLIonRefresherElement>(null)
    const [deletAnim, setdeleteAnim] = useState(false)
    const [fallStar, setfallStar] = useState(false)

    useIonViewDidEnter(() => {
        initialLizeLocalPapers()
    })


    //obtaining locally saved starred papers
    async function initialLizeLocalPapers() {
        const paperValue = (await Storage.get({ key: `starredPapers` })).value

        if (paperValue) {
            const paper: savedPaperInterface[] = JSON.parse(paperValue)
            setstarredPaper([...paper])
        }
    }

    //refreshing starred papers
    async function refreshStarred() {
        await initialLizeLocalPapers()
        refresherRef.current?.complete()
    }

    //animating falling star
    useIonViewDidEnter(() => {
        setfallStar(true)
    })

    //removing a paper from all the starred papers store locally
    async function deleteFromStarred(index: number) {
        const temp = starredPaper
        temp.splice(index, 1)
        await Storage.set({ key: `starredPapers`, value: JSON.stringify(temp) })
        initialLizeLocalPapers()
        setdeleteAnim(true)
    }



    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color='dark'>
                    <IonTitle>Star<IonLabel color='success'>red</IonLabel></IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={refreshStarred} ref={refresherRef} pullFactor={0.5} pullMin={100} pullMax={200}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                {starredPaper.length <= 0 && <>
                    <IonImg className='starred svg' src={localImages.quesersStarred} />
                    <IonCardContent>
                        <IonTitle color='medium'>  No Papers Starred</IonTitle>
                    </IonCardContent>
                </>
                }
                {/* <QuestionCard desc='' downloads='' title=''  addToCart={()=>{}}></QuestionCard> */}

                {/* ------------------           starred papers are displayed here     --------------------- */}
                {
                    starredPaper.map((paper, index) => {
                        const colors = [`danger`, `secondary`, `tertiary`, `warning`, `dark`, `success`, `medium`, `dark`]

                        return <StarredPaperCard deleteFromStarred={() => deleteFromStarred(index)} color={colors[index % colors.length]} key={index} thisPaper={paper}></StarredPaperCard>
                    })
                }

            </IonContent>
            {<CreateAnimation onFinish={{ callback: () => setfallStar(false) }} stop={!fallStar} play={fallStar} duration={1200} keyframes={fallKeyFrame}  >
                <IonIcon style={{ transform: `translateX(39vw)`, opacity: 0, position: `fixed`, top: `10vh` }} color={`warning`} size={`large`} icon={star} ></IonIcon>
            </CreateAnimation>}
        </IonPage>

    )
}

export default Starred;

