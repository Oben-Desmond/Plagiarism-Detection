import { Plugins } from "@capacitor/core";
import app from "../../../Firebase";
import { docBlockInterface, documentData } from "../../interfaces/document";
import { removeOccurence } from "./general";



const dbBlocksRef = app.database().ref(`blocks`)
const firestoreDocRef = (docData: documentData) => app.firestore().collection(`students`).doc(docData.matricle).collection(`reports`).doc(docData.code)

const firestoreReportRef = (docData: documentData) => app.firestore().collection(`faculty`).doc(docData.faculty).collection(`department`).doc(docData.department).collection(`reports`).doc(docData.code).collection(`${(new Date()).getFullYear()}`).doc(docData.matricle)

const storageDocRef = (blockData: docBlockInterface) => {
    const { code, date, matricle } = blockData
    const day = (new Date(+date)).toDateString()
    return (app.storage().ref(`students`).child(matricle).child(day).child(`CEF - ${code}`));
}







export function splitSentence(text: string, block_size: number) {

    
    const words = removeOccurence(text.toString(),[".", "#", "$", "[",  "]","/","\\", ",","-", ]).toLowerCase().trim().split(` `)
    const blocks = [];
    let newblock = ``
    for (let i in words) {
        let word = words[i]
        if (+i === 0) {

        }
        else if (+i % block_size === 0 || +i === words.length - 1) {
            newblock += word
            blocks.push(newblock)
            newblock = ``
        }
        newblock += word + ` `
    }
    return (blocks)
}


export function uploadBlocks(blocks: string[], docData: docBlockInterface) {

    for (const i in blocks) {
        const block = removeOccurence(blocks[i], [` `]);
        try {
            dbBlocksRef.child(block).child(docData.matricle).set(docData).catch(console.log)
        }
        catch (err) {
            console.log(err)
        }

    }
}


export async function uploadDocument(doc: Blob, blockData: docBlockInterface) {

    await storageDocRef(blockData).put(doc)
    return await storageDocRef(blockData).getDownloadURL()

}

export async function uploadDocumentParams(docData: documentData) {

    firestoreDocRef(docData).set(docData)
    await firestoreReportRef(docData).set(docData)

}



