import { IonContent, IonFooter, IonLabel, IonNote, IonPage, IonProgressBar, IonTitle } from '@ionic/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../css/Validate.css';
import app from '../Firebase';
import { userInterface } from '../components/componentTypes';
import { Capacitor, Plugins } from '@capacitor/core';
import { useHistory } from 'react-router';
import { UserContext } from '../components/RouterOutlet';

const { Storage, Modals, App ,Toast} = Plugins

const Validate: React.FC = () => {


    const { userInfo, setuserInfo } = useContext(UserContext)

    let history = useHistory()
    let t: any
    useEffect(() => {

        ValidateApp()
    }, [])


    //initializes login validation and user credentials
    async function ValidateApp() {
        if (t) {
            window.clearTimeout(t)
        } else {
            t = setTimeout(async () => {
               
                init()
                window.clearTimeout(t)
            }, 3000);
        }
    }

    //useeffect adds an event listener to trigger the app to close once the app is on the search page and the back button is pressed
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

    async function init() {
        const userVal: string | null = (await Storage.get({ key: `user` })).value
        if (userVal) {
            let user: userInterface = JSON.parse(userVal)
            if (user && user.tel) {
                if (user.validate == `pending`) {
                    user = { ...user, validate: true }
                    app.firestore().collection(`users`).doc(user.tel).set({ name: user.name }).then(() => {
                        Storage.set({ key: `user`, value: JSON.stringify(user) })
                        setuserInfo(user)
                        history.push(`/search`)
                    }).catch(() => {
                        Modals.alert({ title: `Validation Error`, message: `Please try again` }).then(() => {
                            history.push(`/login`)
                        })
                    })

                }
                else if (user.validate == true) {
                    history.push(`/search`)
                    const userVal = (await Storage.get({ key: `user` })).value
                    if (userVal) {
                        setuserInfo(JSON.parse(userVal))
                        console.log(JSON.parse(userVal))
                    }
                }
                else {
                    history.push(`/login`)
                }

            }
            else {
                history.push(`/login`)
            }
        }
        else {
            history.push(`/login`)
        }
    }



    return (
        <IonPage>
            <IonContent>
                <div className="loading">
                    <div >
                        <IonTitle>Ques<IonLabel color={`success`}>ers</IonLabel></IonTitle>
                    </div>
                    <IonProgressBar type={`indeterminate`}></IonProgressBar>
                </div>

                <div className={`from-finie`}>
                    <IonNote>from findie</IonNote>
                </div>

            </IonContent>

        </IonPage>
    );
};

export default Validate;
