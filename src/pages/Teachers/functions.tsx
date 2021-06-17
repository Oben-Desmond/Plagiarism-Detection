import { BLOCK_SIZE } from "../../components/CONSTANTS";
import { removeOccurence } from "../../components/Funcions/Home/general";
import { splitSentence } from "../../components/Funcions/Home/home";
import { fetchData } from "../../components/Funcions/Home/student";
import { docBlockInterface, documentData, TeacherDownloadQuery } from "../../components/interfaces/document";
import app from "../../Firebase";

export async function getAllDocuments(queryData: TeacherDownloadQuery) {

    console.log(queryData)
    const docData = await app.firestore().collection(`faculty`).doc(queryData.faculty).collection(`department`).doc(queryData.department).collection(`reports`).doc(queryData.code).collection(queryData.year)
        .get();

    const documents: any[] = docData.docs.map((doc) => {
        return (doc.data())
    })

    return (documents)


}


export async function detectPlagiarismLevels(doc: documentData, setlevel: (lvl: number) => void, callback: (matches: any) => void) {

    //spliting text in 10 word sized arrays
    setlevel(0.01)
    fetchData(doc, (text) => {
        console.log(text)
        const docText = text
        const blocks = splitSentence(docText, BLOCK_SIZE);
        console.log(blocks, `blocks`)
        let matchedDocs: any = {}, detailForMatches: any = [];

            for (let i in blocks) {
                //removing spaces from blocks
                const block = removeOccurence(blocks[i], [` `]);
                try {

                    //execution statement for last block check

                    app.database().ref(`blocks`).child(block).once(`value`, (snapshot) => {
                        let val: any = snapshot.val();

                        if (val) {
                            let key: string = Object.keys(val)[0]
                            console.log(val[key])
                            console.log(doc.date < val[key].date || doc.matricle == val[key].matricle)
                            if ( doc.matricle == val[key].matricle) {

                            }
                            else if (matchedDocs[key]) {
                                matchedDocs[key] += 1;
                            } else {
                                matchedDocs[key] = 1
                                detailForMatches.push(val[key])

                            }

                        }
                        setlevel((+i / blocks.length))

                    });
                    // } console.log(`start fetching...`)

                    // app.database().ref(`blocks`).child(block).once(`value`, (snapshot) => {
                    //     let val: any = snapshot.val();
                    //     console.log(val, i, block)
                    //     if (val) {
                    //         console.log(blocks)
                    //         let key: string = Object.keys(val)[0]
                    //         if (doc.date < val[key].date || doc.matricle === val[key].matricle) {

                    //         }
                    //         else if (matchedDocs[key]) {
                    //             matchedDocs[key] += 1;
                    //         } else {
                    //             matchedDocs[key] = 1
                    //             detailForMatches.push(val[key])

                    //         }

                    //     }
                    //     setlevel((+i / blocks.length))

                    // });
                    // } catch (err) {
                    //     // console.log(err)
                    // }

                }
                catch {

                }
            }

            callback({ matchedDocs, detailForMatches })


        })
        // await fetchData(doc.matricle+`.pdf`,doc.url,()=>{})

    }
