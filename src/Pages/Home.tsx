import { CreateAnimation, IonBadge, IonCardContent, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonMenuButton, IonPage, IonProgressBar, IonSearchbar, IonText, IonTitle, IonToolbar, useIonRouter, useIonViewDidEnter } from "@ionic/react";
import { arrowForward, arrowUp, cart } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import QuestionCard from "../components/queserCard";
import { savedPaperInterface, SearchPaperInterface, userInterface } from "../components/componentTypes";
import app from '../Firebase';
import { localImages } from "../img/Images";
import { Capacitor, Plugins } from "@capacitor/core";
import NetworkIndicator from "../components/network indicator";
import CheckOutModal from "../components/checkout modal";
import { searchArrowSeeker } from "../data/animations";
import { useHistory } from "react-router";
import { removeOccurence } from "./Saved";

const { Storage, Modals } = Plugins

const Home: React.FC = () => {
  let initobj = { downloads: 70, previewUrl: ``, title: `Past Questions`, id: `ajsdua`, description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.` }
  const [play, setplay] = useState(false)
  const [papers, setpapers] = useState<SearchPaperInterface[]>([])
  const [addedPapers, setaddedPapers] = useState<SearchPaperInterface[]>([])
  const [savedPapers, setsavedPapers] = useState<savedPaperInterface[]>([])
  const [savedPapersIds, setsavedPapersIds] = useState<string[]>([])
  const [searching, setsearching] = useState<boolean>(false)
  const searchBarRef = useRef<HTMLIonSearchbarElement>(null)
  const [searchBlurred, setsearchBlurred] = useState(true)
  const [nosearch, setnosearch] = useState(true)
  const [badgeNum, setbadgeNum] = useState(0)
  const [checkOut, setcheckOut] = useState(false)
  const [noResults, setnoResults] = useState(false)
  const [currentUser, setcurrentUser] = useState<userInterface>()
  const [logout, setlogout] = useState(false)

  const { Storage, Keyboard, App } = Plugins
  const history = useHistory()
  useEffect(() => {


    document.addEventListener(`keyup`, (event) => {
      if (event.key == `Enter`) {
        SearchPaper()
        Keyboard.hide().catch(console.log)
      }
    })
    initializeLocalPapers()
    intializeUser()
    //  alert(JSON.stringify(app.auth().))

  }, [])

  function focusSearch() {
    setsearchBlurred(false)

  }
  function blurSearch() {
    setsearchBlurred(true)
    // setdisplayTitle(true)

  }
  async function initializeLocalPapers() {
    const paperVALUE = (await Storage.get({ key: `savedPapers` })).value
    if (paperVALUE) {
      let paper: savedPaperInterface[] = JSON.parse(paperVALUE)
      setsavedPapers(paper)
      setsavedPapersIds(paper.map((p) => p.id))
    }
  }

  function SearchPaper() {
    console.log(`searching`)

    let searchtext = searchBarRef.current?.value
    let searchResult: string[] = []
    if (searchtext) {
      setsearching(true)


      let searchTextArray = removeOccurence(searchtext, [`.`, `$`, `#`, `[`, `]`, `-`, `+`, `*`]).toLowerCase().split(` `)

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
          }, (err) => {
            alert(err.message)
            setsearching(false)
          })
      }
    }


  }

  function RankKeys(keyArray: string[]) {
    let ResultsObject: any = {}
    console.log(keyArray)

    if (keyArray.length == 0) {
      setnosearch(false)
      setsearching(false)
      setnoResults(true)
      return;

    }

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
      if (sortedResults.length > 20) {
        break;
      }
      app.database().ref(`allPapers`).child(sortedResults[i])
        .once(`value`, (snapshot) => {

          let value = snapshot.val()
          if (value) {
            //  setdb(JSON.stringify(value))
            fetchedPapers.push({ ...value, id: snapshot.key })
            console.log(value, `value`)

          }
          if (sortedResults.length == i + 1) {
            setpapers([])
            setnosearch(false)
            setsearching(false)
            setpapers([...fetchedPapers])
            console.log(papers)

            if (fetchedPapers.length == 0) {
              setnoResults(true)
            }
          }

        })

    }

  }


  useEffect(() => {

    setbadgeNum(addedPapers.length)
    initializeLocalPapers()


  }, [addedPapers])

  useEffect(() => {
    if (papers.length > 0) {
      setnoResults(false)
    }
  }, [papers])

  function addQuestionToCart(paper: SearchPaperInterface) {
    setaddedPapers([...addedPapers, paper])
  }
  function removePaperFromAdded(paperIndex: number) {
    let temp = addedPapers
    addedPapers.splice(paperIndex, 1)
    setaddedPapers([...addedPapers])
  }
  async function switchAccount() {

    const res = (await Modals.confirm({ message: `You are going to logout from  this account - ${currentUser?.name} (${currentUser?.tel})`, title: `Logout`, okButtonTitle: `logout` })).value
    if (res) {
      history.push(`/login`)
    } else {

    }
  }
  async function intializeUser() {
    const userVal: string | null = (await Storage.get({ key: `user` })).value
    if (userVal) {
      const user: userInterface = JSON.parse(userVal)
      if (user.validate == true) {
        setcurrentUser(user)
      }
      else {
        setlogout(true)
        history.push(`/login`)
        return;
      }

    } else {
      setlogout(true)
      history.push(`/login`)
    }


  }
  useIonViewDidEnter(() => {
    if (logout) {
      // initializeLocalPapers()
      setlogout(false)
    }
    initializeLocalPapers()

  })

  const ionRouter = useIonRouter();
  useEffect(() => {
    if (Capacitor.isNative) {

      document.addEventListener('ionBackButton', (ev: any) => {
        ev.detail.register(-1, () => {
          if (history.location.pathname == `/search` || history.location.pathname == `/login`) {
            App.exitApp();
          }
        });
      });
    }
  }, [])


  return (
    <IonPage>
      {/*  Header containing search bar  */}
      <IonHeader>
        <IonToolbar color="dark">
          <IonMenuButton slot='start'></IonMenuButton>
          {<IonTitle onClick={switchAccount} style={{ transitionDelay: `0.3s`, transition: `0.2s`, fontSize: searchBlurred ? `20px` : `0`, transform: searchBlurred ? `scale(1) translateX(0)` : `scale(0) translateX(-20px)` }} slot="start">
            {" "}
            <b>
              Ques<IonText color="success">ers</IonText>{" "}
            </b>
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
          ></IonSearchbar>

          <IonFab style={{ transition: `0.3s`, transform: searchBlurred ? `scale(0)` : `scale(1)` }} horizontal="end" vertical="center" slot="end"  >
            <IonFabButton onClick={SearchPaper} size="small" className="search-button" color="success"  >
              <IonIcon icon={arrowForward} />
            </IonFabButton></IonFab>
        </IonToolbar>
        {/* <IonToolbar color={`dark`}>
        <IonItem color={`none`}>
          <IonIcon  size={`small`} slot={`start`} icon={search}></IonIcon>
          <IonLabel>past GCE questions</IonLabel>
          </IonItem>
          <IonItem  color={`none`} >
          <IonIcon  size={`small`} slot={`start`} icon={search}></IonIcon>
          <IonLabel>past GCE questions</IonLabel>
          </IonItem>
          <IonItem  color={`none`}>
          <IonIcon size={`small`} slot={`start`} icon={search}></IonIcon>
          <IonLabel>past GCE questions</IonLabel>
          </IonItem>
        </IonToolbar> */}
      </IonHeader>

      {
        searching && <IonProgressBar color="success" type={`indeterminate`} ></IonProgressBar>}



      <IonContent className="content-home">
        {
          nosearch && <IonFab vertical={`top`} horizontal={`center`}>
            <CreateAnimation easing={`linear`} play={true} iterations={Infinity} duration={1500} keyframes={searchArrowSeeker}>
              <IonIcon color={`success`} icon={arrowUp} size={`large`}></IonIcon>
            </CreateAnimation>
          </IonFab>}


        {papers.map((paper, index) => {
          let exists = (savedPapersIds.indexOf(paper.id) >= 0) ? true : false

          return (
            <QuestionCard PaperDownloaded={exists} PapersAdded={addedPapers} key={index} addQuestionToCart={() => { addQuestionToCart(paper); setplay(true) }} thisPaper={paper} ></QuestionCard>

          )
        })}
        {nosearch && <IonCardContent>

          <IonImg style={{ marginTop: `70px` }} src={localImages.quesersSearch}></IonImg>

        </IonCardContent>}
        {
          noResults && <IonCardContent>
            <IonImg className='ion-padding ion-margin-vertical' src={localImages.notfoundsvg} />
          </IonCardContent>
        }
      </IonContent>



      <NetworkIndicator ></NetworkIndicator>
      <CreateAnimation onFinish={{ callback: () => { setplay(false) } }} keyframes={[
        { offset: 0, transform: `scale(1) rotate(0deg)`, },
        { offset: 0.3, transform: `scale(1.1) rotate(0deg) translate(-120px, 0)`, },
        { offset: 0.7, transform: `scale(1.2) rotate(-0deg) translate(-120px, 0)`, },
        { offset: 1, transform: `scale(1) rotate(0deg) translate(0px, 0px)`, },
      ]} stop={!play} play={play} duration={800}  >
        <IonFab style={{ transform: badgeNum == 0 ? `scale(0)` : `scale(1)` }} vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setcheckOut(true)} color="success">
            <IonIcon icon={cart} />
            <IonBadge color="dark" mode="ios" >{badgeNum}</IonBadge>
          </IonFabButton>
        </IonFab>
      </CreateAnimation>
      <CheckOutModal user={currentUser} removePaperFromAdded={removePaperFromAdded} CheckOutPapers={addedPapers} isOpen={checkOut} onDidDismiss={() => { setcheckOut(false) }}></CheckOutModal>
    </IonPage>
  );
};

export default Home;
