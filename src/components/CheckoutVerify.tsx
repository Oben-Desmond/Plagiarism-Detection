import { Plugins } from "@capacitor/core";
import { IonButton, IonLabel } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { localPendingPapers, SearchPaperInterface } from "./componentTypes";
import PaymentModal from "./payment modal";
import PaymentVerifierPopover from "./paymentVerifierPopover";
import { formUrlEncoder } from "./pendingPapersSaved";
import { UserContext } from "./RouterOutlet";


const { Storage } = Plugins

const CheckoutVerify: React.FC<{ CheckOutPapers: SearchPaperInterface[], costSum: string }> = ({ CheckOutPapers, costSum }) => {


    const [initializePayment, setinitializePayment] = useState(false)
    const [reference, setreference] = useState(Math.floor(Math.random() * 1000) + `` + Date.now())
    const [paymentStatus, setpaymentStatus] = useState<boolean | `pending`>(false);
    const [verifyPayment, setverifyPayment] = useState<boolean>(false);
    const [verifyPopOver, setverifyPopOver] = useState<true | false>(false);
    const [uploading, setuploading] = useState<true | false>(false);

    const { setuserInfo, userInfo } = useContext(UserContext)

    useEffect(()=>{
       setreference(Math.floor(Math.random() * 1000) + `` + Date.now())
    },[CheckOutPapers])

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
    function verifyPaymentSuccess() {
        setverifyPopOver(true)
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

        fetch(url, {
            method: 'POST',
            headers: headers,
            body: formUrlBody
        }).then(async response => {
            const data: any = (await response.json())
            console.log(data)
            if (data.status == 1 && data.status_msg == "COMPLETED") {
                setpaymentStatus(true)
            } else {
                setpaymentStatus(false)
            }
           
        }).catch((err) => {
            setpaymentStatus(false)
            console.log(err)
            
        });
    }

    return (
        <React.Fragment>
            <div style={{ textAlign: `center`, padding: `6px` }}>
                <IonButton onClick={() => setinitializePayment(true)} color={`dark`}> <IonLabel color={`primary`}>Download</IonLabel></IonButton>
            </div>
            <PaymentVerifierPopover retryTransaction={()=>verifyPaymentSuccess()} isOpen={verifyPayment} onDidDismiss={() => setverifyPayment(false)} paymentStatus={paymentStatus} />
            <PaymentModal reference={reference} cost={costSum} isOpen={initializePayment} 
            onDidDismiss={() => {
                setinitializePayment(false);
                verifyPaymentSuccess()
            }}></PaymentModal>

        </React.Fragment>
    )
}

export default CheckoutVerify

