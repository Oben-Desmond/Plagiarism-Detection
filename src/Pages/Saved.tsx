import { Plugins } from '@capacitor/core'
import { IonCardContent, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonLabel, IonPage, IonSearchbar, IonSpinner, IonText, IonTitle, IonToast, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import React, { useEffect, useState, useRef, useContext } from 'react'
import { localImages } from '../img/Images'
import app from '../Firebase'
import { localPendingPapers, savedPaperInterface, SearchPaperInterface, userInterface } from '../components/componentTypes'
import SavedPapersCard from '../components/savedPapersCard'
import { useHistory } from 'react-router'
import { star } from 'ionicons/icons'
import PendingPapersSaved from '../components/pendingPapersSaved'
import { UserContext } from '../components/RouterOutlet'

const { Storage, Modals, Toast } = Plugins

const Saved: React.FC = () => {
    const queserStarredMessage = `Queser Starred`
    const [savedPapers, setsavedPapers] = useState<savedPaperInterface[]>([])
    const [starredPapers, setstarredPapers] = useState<savedPaperInterface[]>([])
    const [starredPapersKeys, setstarredPapersKeys] = useState<string[]>([])
    const [pendingPapers, setpendingPapers] = useState<(localPendingPapers[])[]>([])
    const [displaySavedPapers, setdisplaySavedPapers] = useState<savedPaperInterface[]>([])
    const [loadingPapers, setloadingPapers] = useState<boolean>(false)
    const [noPapersSaved, setnoPapersSaved] = useState<boolean>(false)
    const searchBarRef = useRef<HTMLIonSearchbarElement>(null)
    const [searchBlurred, setsearchBlurred] = useState(true) 
    const [starToast, setstarToast] = useState(``)
    const [startup, setstartup] = useState(true)


    const {userInfo,setuserInfo} = useContext(UserContext)
    const history = useHistory()

    useEffect(() => {
        setloadingPapers(true)

        initializeLocalPapers()


    }, [])

    function SearchPaper() {

    }
    useEffect(() => {

        document.addEventListener(`keyup`, (event) => {
            if (event.key == `Enter`) {
                SearchPaper()
                Plugins.Keyboard.hide().catch(console.log)
            }
        })


    }, [])
    async function initializeLocalPapers() {
        const paperVALUE = (await Storage.get({ key: `savedPapers` })).value 

        if (paperVALUE) {
            let paper = JSON.parse(paperVALUE)
            setsavedPapers(paper)
        }
        if (userInfo?.tel) {
            let user: userInterface = userInfo
             if (user) {
                app.firestore()
                    .collection(`users`)
                    .doc(user.tel)
                    .collection(`papers`)
                    .onSnapshot((snapshot) => {

                        if (snapshot.docs) {
                            let paps: any[] = snapshot.docs.map(doc => {

                                return doc.data()[doc.id]
                            })
                            if (paps.length > 0) {
                                setsavedPapers([...paps])
                                Storage.set({ key: `savedPapers`, value: JSON.stringify(paps) })
                            }
                        }
                        else {
                            setnoPapersSaved(true)
                        }
                        setloadingPapers(false)
                        setstartup(true)
                    })
            }
            else {
                const res = (await Modals.confirm({ title: `Authentication Error`, message: `unable to buy papers because user is not authenticated`, okButtonTitle: `login` })).value
                if (res) {
                    history.push(`/login`)
                }
            }
        }



    }
    async function initializeLocalStarred() {
        const starredVALUE = (await Storage.get({ key: `starredPapers` })).value
        if (starredVALUE) {
            let paper: savedPaperInterface[] = JSON.parse(starredVALUE)
            setstarredPapers(paper)
            setstarredPapersKeys([...(paper.map(paper => paper.id))])
        }
    }
    function focusSearch() {
        setsearchBlurred(false)

    }
    function blurSearch() {
        setsearchBlurred(true)
        // setdisplayTitle(true)

    }


    async function initiatlizePendingPapers() {
        const pendingVALUE: string | null = (await Storage.get({ key: `pending` })).value
        if (pendingVALUE) {
            const pendingObj = JSON.parse(pendingVALUE)
            const pendingArr: any[] = Object.values(pendingObj)
            setpendingPapers([...pendingArr])
        }
       
    }
    function handleSearch() {
        let value = removeOccurence(searchBarRef.current?.value?.toLowerCase(), [` `])
        if (value == ``) {
            setdisplaySavedPapers([...savedPapers])
        }
        if (value) {
            const newdisplay = savedPapers.filter(paper => removeOccurence(paper.title, [` `]).toLowerCase().match(value + ``))
            setdisplaySavedPapers([...newdisplay])
        }

    }
    function navigateTo(path: string) {
        history.push(path)
    }

    async function deleteSavedPaper(paper: savedPaperInterface) {
        const { title, id } = paper
        const currentUser= userInfo 
        if (currentUser) {
            const res = (await Modals.confirm({ title: `Delete Paper`, message: `Are you sure you want to Delete ${title}?`, okButtonTitle: `Delete` })).value
            if (!res) {
                return
            }
            if (savedPapers.length == 1) {
                setsavedPapers([])
                Storage.set({ key: `savedPapers`, value: JSON.stringify([]) })
            }
            app.firestore()
                .collection(`users`)
                .doc(currentUser.tel)
                .collection(`papers`)
                .doc(id).delete()
                .then(() => {
                    Toast.show({ text: `paper deleted` })

                })

        }
    }

    useEffect(() => {
        if (savedPapers) {
            setdisplaySavedPapers([...savedPapers])
        }
    }, [savedPapers])
    async function starPaper(index: number) {
        const paper = savedPapers[index]
        if (starredPapersKeys.indexOf(paper.id) < 0) {

            await Storage.set({ key: `starredPapers`, value: JSON.stringify([...starredPapers, paper]) })
            initializeLocalStarred()
            setstarToast(queserStarredMessage)

        } else {

            setstarToast(`Queser already starred`)

        }

    }

    useIonViewDidEnter(() => {
        initializeLocalStarred()
        initiatlizePendingPapers()
    })
    return (
        <IonPage>
            <IonToast color={starToast !== queserStarredMessage ? `medium` : `primary`} buttons={[{ text: `view`, side: `end`, handler: () => { navigateTo(`/starred`) } }]} mode={`ios`} duration={2000} message={starToast} isOpen={starToast != ``} onDidDismiss={() => setstarToast(``)}></IonToast>
            <IonHeader>
                <IonToolbar color='dark'>
                    <IonToolbar color="dark">
                        {<IonTitle style={{ transitionTimingFunction: `ease-out`, transitionDelay: `0.3s`, transition: `0.2s`, fontSize: searchBlurred ? `20px` : `0`, transform: searchBlurred ? `scale(1) translateX(0)` : `scale(0) translateX(-20px)` }} slot="start">

                            Sav<IonLabel color='success'>ed</IonLabel>

                        </IonTitle>}
                        <IonSearchbar
                            aria-autocomplete="list"
                            autocomplete="on"
                            autocorrect="on"
                            ref={searchBarRef}
                            onIonFocus={focusSearch}
                            onIonBlur={blurSearch}
                            mode='md'
                            className="search-bar"
                            slot="start"
                            animated={true}
                            onIonChange={handleSearch}
                        ></IonSearchbar>

                        {/* <IonFab style={{ transition: `0.3s`, transform: searchBlurred ? `scale(0)` : `scale(1)` }} horizontal="end" vertical="center" slot="end"  >
                            <IonFabButton onClick={SearchPaper} size="small" className="search-button" color="success"  >
                                <IonIcon icon={arrowForward} />
                            </IonFabButton></IonFab> */}
                    </IonToolbar>

                </IonToolbar>

            </IonHeader>

            <IonContent>
                {loadingPapers && <IonSpinner></IonSpinner>}
                
                {displaySavedPapers.length <= 0 && <><IonImg style={{ marginTop: `20%`, padding: `20px` }} src={localImages.quesersSave} />
                    <IonCardContent>
                        <IonTitle color='medium'>  No Papers Saved Yet</IonTitle>
                    </IonCardContent>
                </>

                } 
                {
                    displaySavedPapers.map((paper, index) => {
                        const starred = (starredPapersKeys.indexOf(paper.id) >= 0) ? true : false;
                        return <SavedPapersCard deleteSavedPaper={() => deleteSavedPaper(paper)} starred={starred} key={index} starPaper={() => starPaper(index)} thisPaper={paper} ></SavedPapersCard>
                    })
                }

            </IonContent>
        </IonPage>
    )
}

export default Saved;


export function removeOccurence(str: string | undefined, litarray: string[]) {
    if (!str) {
        return ``
    }
    for (let i = 0; i < litarray.length; i++) {
        const lit = litarray[i]
        while (str.indexOf(lit) >= 0) {
            str = str.replace(lit, ``)
        }
    }
    return str
}