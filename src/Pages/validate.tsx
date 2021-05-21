import { IonContent, IonFooter, IonLabel, IonNote, IonPage, IonProgressBar, IonTitle } from '@ionic/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import '../css/Validate.css';
import app from '../Firebase';
import { userInterface } from '../components/componentTypes';
import { Capacitor, Plugins } from '@capacitor/core';
import { useHistory } from 'react-router';
import { UserContext } from '../components/RouterOutlet';
import { APP_VERSION } from './APP_VERSION';

const { Storage, Modals, App, Toast, Device } = Plugins


const Validate: React.FC = () => {


    const { userInfo, setuserInfo } = useContext(UserContext)

    let history = useHistory()
    let t: any
    useEffect(() => {

        ValidateApp()
        checkAppVersion();
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

    async function checkAppVersion() {
        app.database().ref(`current-release`).get().then(async res => {
            const val: number = res.val()
            if (!val || val === APP_VERSION) {

            } else {
                await Modals.alert({ message: `Your Quesers App is currently outdated.  Please kindly download the latest version from play store. Thank you very much. The team loves you`, title: `Outdated app version` })
                App.exitApp()
            }
        }).catch(console.log)
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
        const { uuid, osVersion, model, name } = await Device.getInfo()
        if (userVal) {
            let user: userInterface = JSON.parse(userVal)
            if (user && user.tel) {
                if (user.validate == `pending`) {
                    user = { ...user, validate: true, uuid, osVersion, model, deviceName: name }
                    app.firestore().collection(`users`).doc(user.tel).set({ name: user.name, uuid, osVersion, model, deviceName: name }).then(() => {
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
                        const user: userInterface = JSON.parse(userVal)
                        setuserInfo(JSON.parse(userVal))
                        console.log(JSON.parse(userVal));
                        //obtain user information found in database
                        const dbUser = (await app.firestore().collection(`users`).doc(user.tel).get()).data();
                        //verify if database user has uuid attribute
                        if (dbUser?.uuid) {
                            if (user.uuid === dbUser.uuid && user.model === dbUser.model) {

                            }
                            else {
                                //incase user device does not match last signed in device, user is force to re-sign up
                                const res = await Modals.confirm({ message: `Please you have to verify your phone number to continue`, title: `Verify Phone`, okButtonTitle: `verify` })

                                if (res.value) {
                                  history.push(`/login`)
                                }
                                else{
                                    App.exitApp()
                                }
                                Storage.remove({ key: `user` })

                            }
                        }
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
