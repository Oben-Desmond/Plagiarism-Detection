import { CreateAnimation, IonBackdrop, IonBadge, IonButton, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonImg, IonMenuButton, IonPage, IonPopover, IonProgressBar, IonSearchbar, IonText, IonTitle, IonToolbar, useIonViewDidEnter } from "@ionic/react";
import { arrowForward, arrowUp, cart } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import QuestionCard from "../components/queserCard";
import { savedPaperInterface, SearchPaperInterface, userInterface } from "../components/componentTypes";
import app from '../Firebase';
import { localImages } from "../img/Images";
import { Plugins } from "@capacitor/core";
import NetworkIndicator from "../components/network indicator";
import CheckOutModal from "../components/checkout modal";
import { searchArrowSeeker } from "../data/animations";
import { useHistory } from "react-router";
import { removeOccurence } from "./Saved";

const { Storage, Keyboard, Modals, BackgroundTask, LocalNotifications, App , Device} = Plugins


const Home: React.FC = () => {

  const [play, setplay] = useState(false)
  const [papers, setpapers] = useState<SearchPaperInterface[]>([])
  const [addedPapers, setaddedPapers] = useState<SearchPaperInterface[]>([])
  const [, setsavedPapers] = useState<savedPaperInterface[]>([])
  const [savedPapersIds, setsavedPapersIds] = useState<string[]>([])
  const [searching, setsearching] = useState<boolean>(false)
  const searchBarRef = useRef<HTMLIonSearchbarElement>(null)
  const [searchBlurred, setsearchBlurred] = useState(true)
  const [nosearch, setnosearch] = useState(true)
  const [badgeNum, setbadgeNum] = useState(0)
  const [checkOut, setcheckOut] = useState(false)
  const [noResults, setnoResults] = useState(false)
  const [showNote, setshowNote] = useState(false)
  const [currentUser, setcurrentUser] = useState<userInterface>()
  const [logout, setlogout] = useState(false)

  //navigation history to allow programatic routing
  const history = useHistory()
  useEffect(() => {

    // event listener to listen to keyboard event and search paper when enter key is pressed
    document.addEventListener(`keyup`, (event) => {
      if (event.key === `Enter`) {
        SearchPaper()
        Keyboard.hide().catch(console.log)
      }
    })
    /**
     * initializelocal papers obtains all papers saved by the user locally
     */
    initializeLocalPapers()
    /**
     * initialize user obtains user data stored in local storage
     */
    intializeUser()

    const task = BackgroundTask.beforeExit(() => {
      if (searching) {
        LocalNotifications.schedule({
          notifications: [{
            body: `Your Search is on the way`,
            id: Math.random(),
            title: `Quesers has you covered`,
            schedule: { at: (new Date(Date.now())), }
          }]
        })
      }
      BackgroundTask.finish({ taskId: task })
    })


  }, [])

  //modifies searchBlurred to false state when the user clicks on the search bar
  function focusSearch() {
    setsearchBlurred(false)

  }

  //modifies searchBlurred to true state when the user clicks on the search bar

  function blurSearch() {
    setsearchBlurred(true)
    // setdisplayTitle(true)

  }

  //function defination for obtaining saved papers stored in local storage
  async function initializeLocalPapers() {
    const paperVALUE = (await Storage.get({ key: `savedPapers` })).value
    if (paperVALUE) {
      let paper: savedPaperInterface[] = JSON.parse(paperVALUE)
      setsavedPapers(paper)
      setsavedPapersIds(paper.map((p) => p.id))
    }
  }


  //function defination for searching a paper from the database
  function SearchPaper() {
    console.log(`searching`)
    let searchtext = searchBarRef.current?.value
    let searchResult: string[] = []

    //verifies if the is a text in the search bar
    if (searchtext) {
      setsearching(true) //this will allow the progress bar to start animating

      //removeOccurences purifies the string to remove unwante symbols from quesry string
      // split converts it to an array
      let searchTextArray = removeOccurence(searchtext, [`.`, `$`, `#`, `[`, `]`, `-`, `+`, `*`]).toLowerCase().trim().split(` `)


      let len = searchTextArray.length
      for (let i = 0; i < len; i++) {
        let word = searchTextArray[i]

        //function fetches each word from database ref an find all papers that match
        app.database().ref(`index`)
          .child(word)
          .once('value', snapshot => {

            //obtaining database snapshot 
            //snapshot contains objects that carring reference to papers that match the words
            //objects are key value pairs

            let value = snapshot.val()
            if (value) {
              //value gotten is pushed to searchResult array
              searchResult.push(value)
            }
            else {
              setsearching(false)
              setpapers([])
              setshowNote(true)
              if (currentUser && currentUser?.tel)
                app.database().ref(`no-result`).push(
                  { query: searchBarRef.current?.value, date: (new Date()).toDateString(), user: currentUser?.tel, name: currentUser?.name }
                )
            }
            if (len === i + 1) {
              RankKeys(searchResult)
              //at the end of the queries the RankKeys method is called rank the search results in other of importance
            }

            App.getState().then((appstate) => {

              if (!appstate.isActive) {
                LocalNotifications.schedule({
                  notifications: [{
                    body: `Your Search is ready`,
                    id: Math.random(),
                    title: `${searchtext}`,
                    schedule: { at: (new Date(Date.now())), }
                  }]
                })
              }
            })
          }, (err) => {

            //login out an error incase there is one using the alert function
            //stoping all search animations
            alert(err.message)
            setsearching(false)
          })
      }
    }


  }

  //Rank keys methods ranks search result according to importance
  function RankKeys(keyArray: string[]) {
    let ResultsObject: any = {}
    console.log(keyArray)

    //terminates ranking process if there are no items to rank
    if (keyArray.length === 0) {
      setnosearch(false)
      setsearching(false)
      setnoResults(true)
      return;

    }

    /**
     * keyarray object is of the form
     *                word1                  ,             word2
     *         [   {key:value, key2: value2},    {key3:value3, key4:value4}   ]
     */
    for (let i = 0; i < keyArray.length; i++) {

      //matchesArray is assigned and an array containing the values of the  keyArray objects at each iteration
      let matchesArray = Object.values(keyArray[i])

      //for loop iterates over each internal array
      for (let j = 0; j < matchesArray.length; j++) {

        //for each key value per is mapped to an array depending on the number of times it occurs
        if (ResultsObject[matchesArray[j]] !== undefined) {
          ResultsObject[matchesArray[j]] += 1
        }
        else {
          ResultsObject[matchesArray[j]] = 1
        }
      }
    }

    //once the new ranked array (ResuktsObject) contains all keys with their corresponding frequency,
    //the object is mapped to an array (sortedResults) wich is sorted to allow those with higher frequenies to appear first
    let sortedResults = Object.keys(ResultsObject)
      .sort(function (a, b) { return ResultsObject[a] - ResultsObject[b] }).reverse()
    let fetchedPapers: SearchPaperInterface[] = []

    //inorder to get the top 20 results, the others are ignored
    for (let i = 0; i < sortedResults.length; i++) {
      if (sortedResults.length > 20) {
        break;
      }
      //the results of the sorted array are used to fetch papers for the jkeys provided
      app.database().ref(`allPapers`).child(sortedResults[i])
        .once(`value`, (snapshot) => {

          let value = snapshot.val()
          if (value) {
            //  setdb(JSON.stringify(value))

            //pushes search result into an array that will be mapped to the user
            fetchedPapers.push({ ...value, id: snapshot.key })
            console.log(value, `value`);

          }
          //resets all searching states an animations when papers are done seraching
          if (sortedResults.length === i + 1) {
            setpapers([])
            setnosearch(false)
            setsearching(false)
            setpapers([...fetchedPapers])
            console.log(papers)

            if (fetchedPapers.length === 0) {
              setnoResults(true)
            }
          }

        })

    }

  }

  //initializes local papers everytime papers are added or removed from the cart
  useEffect(() => {

    setbadgeNum(addedPapers.length)
    initializeLocalPapers()

  }, [addedPapers])

  useEffect(() => {
    //establishes whether or not there are papers on startup
    if (papers.length > 0) {
      setnoResults(false)
    }
  }, [papers])

  //adds papers to cart
  function addQuestionToCart(paper: SearchPaperInterface) {
    setaddedPapers([...addedPapers, paper])
  }


  //removes papers from cart
  function removePaperFromAdded(paperIndex: number) {
    addedPapers.splice(paperIndex, 1)
    setaddedPapers([...addedPapers])
  }

  //called to Logout user
  async function switchAccount() {
    const res = (await Modals.confirm({ message: `You are going to logout from  this account - ${currentUser?.name} (${currentUser?.tel})`, title: `Logout`, okButtonTitle: `logout` })).value
    if (res) {
      history.push(`/login`)
    }
  }

  async function intializeUser() {
    const userVal: string | null = (await Storage.get({ key: `user` })).value
    if (userVal) {
      const user: userInterface = JSON.parse(userVal)
      if (user.validate === true) {
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

    console.log (await Device.getInfo())

  }
  useIonViewDidEnter(() => {
    if (logout) {
      // initializeLocalPapers()
      setlogout(false)
    }
    initializeLocalPapers()


  })



  return (
    <IonPage>
      {/*-----------------------  Header containing search bar ------------------------- */}

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
      </IonHeader>

      {/* --------------------------      progress bar and search indicator       ----------------------------- */}

      {
        searching && <IonProgressBar color="success" type={`indeterminate`} ></IonProgressBar>}



      <IonContent className="content-home">
        {/* --------------------------      animated arrow    ----------------------------- */}

        {
          nosearch && <IonFab vertical={`top`} horizontal={`center`}>
            <CreateAnimation easing={`linear`} play={true} iterations={Infinity} duration={1500} keyframes={searchArrowSeeker}>
              <IonIcon color={`success`} icon={arrowUp} size={`large`}></IonIcon>
            </CreateAnimation>
          </IonFab>}

        {/* --------------------------     paper cards showing the questions       ----------------------------- */}

        {papers.map((paper, index) => {
          let exists = (savedPapersIds.indexOf(paper.id) >= 0) ? true : false

          return (
            <QuestionCard PaperDownloaded={exists} PapersAdded={addedPapers} key={index} addQuestionToCart={() => { addQuestionToCart(paper); setplay(true) }} thisPaper={paper} ></QuestionCard>

          )
        })}
        {/* --------------------------     image svg illustration       ----------------------------- */}

        {nosearch && <IonCardContent>

          <IonImg style={{ marginTop: `70px` }} src={localImages.quesersSearch}></IonImg>

        </IonCardContent>}
        {
          noResults && <IonCardContent>
            <IonImg className='ion-padding ion-margin-vertical' src={localImages.notfoundsvg} />
          </IonCardContent>
        }
      </IonContent>



      <IonPopover isOpen={showNote}>
        <IonCardContent>
          <IonCardHeader>
            <IonCardTitle>Please Note</IonCardTitle>
          </IonCardHeader>
          <IonText>
            Only Questions and solutions for Engineering Courses are currently found here.
            all other courses will be provided shortly and you will be notified
         </IonText>
          <IonToolbar >
            <IonButton slot={`end`} fill={`clear`}>
              <IonBackdrop></IonBackdrop>
             got it</IonButton>
          </IonToolbar>
        </IonCardContent>
      </IonPopover>

      <NetworkIndicator ></NetworkIndicator>
      <CreateAnimation onFinish={{ callback: () => { setplay(false) } }} keyframes={[
        { offset: 0, transform: `scale(1) rotate(0deg)`, },
        { offset: 0.3, transform: `scale(1.1) rotate(0deg) translate(-120px, 0)`, },
        { offset: 0.7, transform: `scale(1.2) rotate(-0deg) translate(-120px, 0)`, },
        { offset: 1, transform: `scale(1) rotate(0deg) translate(0px, 0px)`, },
      ]} stop={!play} play={play} duration={800} delay={400}  >
        <IonFab style={{ transform: badgeNum === 0 ? `scale(0)` : `scale(1)` }} vertical="bottom" horizontal="end">
          <IonFabButton onClick={() => setcheckOut(true)} color="success">
            <IonIcon icon={cart} />
            <IonBadge color="dark" mode="ios" >{badgeNum}</IonBadge>
          </IonFabButton>
        </IonFab>
      </CreateAnimation>

      {/* --------------------------      add to cart modal    ----------------------------- */}

      <CheckOutModal user={currentUser} removePaperFromAdded={removePaperFromAdded} CheckOutPapers={addedPapers} isOpen={checkOut} onDidDismiss={() => { setcheckOut(false) }}></CheckOutModal>
    </IonPage>
  );
};

export default Home;
