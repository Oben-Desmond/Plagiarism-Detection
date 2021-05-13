import { Plugins } from "@capacitor/core";
import { IonButton, IonLabel, IonNote } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getLocalStorageStatus, LocalStorageSetLoadedStatus } from "../data/LocalStorageSetLoadedStatus";
import { localPendingPapers, SearchPaperInterface } from "./componentTypes";
import PaymentModal from "./payment modal";
import PaymentVerifierPopover from "./paymentVerifierPopover";
import { formUrlEncoder } from "./pendingPapersSaved";
import { UserContext } from "./RouterOutlet";


const { Storage } = Plugins
const Months = [`January`, `Febuary`, `March`, `April`, `May`, `June`, `July`, `August`, `September`, `October`, `December`]

const CheckoutVerify: React.FC<{ CheckOutPapers: SearchPaperInterface[], costSum: string ,validateSavedPapers:()=>void}> = ({ CheckOutPapers, costSum ,validateSavedPapers}) => {


    const [initializePayment, setinitializePayment] = useState(false)
    const [reference, setreference] = useState(Math.floor(Math.random() * 1000) + `` + Date.now())
    const [paymentStatus, setpaymentStatus] = useState<boolean | `pending`>(false);
    const [verifyPayment, setverifyPayment] = useState<boolean>(false);
    const [verifyPopOver, setverifyPopOver] = useState<true | false>(false);
    const [uploading, setuploading] = useState<true | false>(false);

    const { setuserInfo, userInfo } = useContext(UserContext)

    useEffect(() => {
        //generates a unique refrence for Zitopay 
        setreference(Math.floor(Math.random() * 1000) + `` + Date.now())
    }, [CheckOutPapers])

    //saves transactions which are pending and yet to be confirmed
    async function savePapersToStorage() {

        const temp = (await Storage.get({ key: `pending` })).value
        let pending: localPendingPapers[] = []
        if (temp) {
            pending = JSON.parse(temp)
        }

        const arrayGroup = [...CheckOutPapers.map((info) => ({ ...info, reference }))]
        pending = { ...pending, [reference]: arrayGroup }

        const value = JSON.stringify(pending)
        Storage.set({ key: `pending`, value }).catch(alert)


        for (let i = 0; i < CheckOutPapers.length; i++) {
            // removePaperFromAdded(i);
        }

    }

    //verifies if a transaction with a speific ref has been confirmed
    function verifyPaymentSuccess() {
        setverifyPopOver(true)
        
        //get request payload is initialized
        const data: any = {
            "ref": `${reference}`,
            "reciever": `akumah`
        }

        setpaymentStatus(`pending`)
        setverifyPayment(true)

        const url = 'https://quesers.herokuapp.com/zito-pay';
        const params = {
            ...data
        };
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        });

        let formUrlBody: any = [];
        formUrlBody = formUrlEncoder(params, formUrlBody);


// fetch is made to Zito pay inorder to proces transaction status

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: formUrlBody
        }).then(async response => {
            const data: any = (await response.json())
            console.log(data)

            //on transaction complete payment states are set that will allow user to access papers saved
            if (data.status == 1 && data.status_msg == "COMPLETED") {
                validateSavedPapers();
                setuploading(true)
                setpaymentStatus(true)
                
            } else {
                setpaymentStatus(false)
            }

        }).catch((err) => {
            setpaymentStatus(false)
            console.log(err)

        });
    }


    //action executed when the payment modal is closed
    async function onPaymentModalDismissed() {
        const status = await getLocalStorageStatus()
        if (status && status == `true`) {
            verifyPaymentSuccess()
        }
        setinitializePayment(false);


    }
    return (
        <React.Fragment>
            {/* -----------    button to initialize payment --------- */}
            <div style={{ textAlign: `center`, padding: `6px` }}>
             {  !uploading&& <IonButton onClick={() => setinitializePayment(true)} color={`dark`}> <IonLabel color={`primary`}>Download</IonLabel></IonButton>}
            </div>

            {/* ----------- popover for verifying payments -------- */}
            <PaymentVerifierPopover retryTransaction={() => verifyPaymentSuccess()} isOpen={verifyPayment} onDidDismiss={() => setverifyPayment(false)} paymentStatus={paymentStatus} />
          
          
           {/* ------------  Payment modal with Zito Iframe----------------- */}
            <PaymentModal reference={reference} cost={costSum} isOpen={initializePayment}
                onDidDismiss={onPaymentModalDismissed}></PaymentModal>

        </React.Fragment>
    )
}

export default CheckoutVerify


