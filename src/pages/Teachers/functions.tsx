import { BLOCK_SIZE } from "../../components/CONSTANTS";
import { removeOccurence } from "../../components/Funcions/Home/general";
import { splitSentence } from "../../components/Funcions/Home/home";
import { docBlockInterface, documentData, TeacherDownloadQuery } from "../../components/interfaces/document";
import app from "../../Firebase";

let docText = `
A Simple PDF File
This is a small demonstration .pdf file -
just for use in the Virtual Mechanics tutorials. More text. And more
text. And more text. And more text. And more text.
And more text. And more text. And more text. And more text. And more
text. And more text. Boring, zzzzz. And more text. And more text. And
more text. And more text. And more text. And more text. And more text.
And more text. And more text.
And more text. And more text. And more text. And more text. And more
text. And more text. And more text. Even more. Continued on page 2 ...Simple PDF File 2
...continued from page 1. Yet more text. And more text. And more text.
And more text. And more text. And more text. And more text. And more
text. Oh, how boring typing this stuff. But not as boring as watching
paint dry. And more text. And more text. And more text. And more text.
Boring. More, a little more text. The end, and just as well.
`

docText=`

PDF Bookmark Sample Page 1 of 4 PDF BOOKMARK SAMPLESample Date: May 2001 Prepared by: Accelio Present Applied Technology Created and Tested Using: • Accelio Present Central 5.4 • Accelio Present Output Designer 5.4 Features Demonstrated: • Primary bookmarks in a PDF file. • Secondary bookmarks in a PDF file. Overview This sample consists of a simple form containing four distinct fields. The data file contains eight separate records. By default, the data file will produce a PDF file containing eight separate pages. The selective use of the bookmark file will produce the same PDF with a separate pane containing bookmarks. This screenshot of the sample output shows a PDF file with bookmarks. The left pane displays the available bookmarks for this PDF. You may need to enable the display of bookmarks in Adobe Acrobat Reader by clicking Window > Show Bookmarks. Selecting a date from the left pane displays the corresponding page within the document. Note that the index has been sorted according to the specification in the bookmark file, and that pages within the file are created according to the original order in the data file. 
PDF Bookmark Sample Page 2 of 4 Sample Data File ^reformat trunc^symbolset WINLATIN1^field trans_date2000-01-1^field descriptionDescription for item #1^field trans_typeTYPE1^field trans_amount11.00^page 1^field trans_date2000-01-2^field descriptionDescription for item #2^field trans_typeTYPE2^field trans_amount11.00^page 1^field trans_date2000-01-3^field descriptionDescription for item #3^field trans_typeTYPE3Sample Bookmark File [invoices]Invoices by Date=0trans_date=1,A[type]Invoices by Item Type=0trans_type=1,A[amount]Invoices by Transaction Amount=0trans_amount=1,DThe example bookmark file includes three distinct sections: • Invoices sorted, ascending, by date. • Invoices sorted, ascending, by item type. • Invoices sorted, descending, by transaction amount. 
PDF Bookmark Sample Page 3 of 4 Sample Files This sample package contains: Filename Description ap_bookmark.IFD The template design. ap_bookmark.mdf The template targeted for PDF output. ap_bookmark.dat A sample data file in DAT format. ap_bookmark.bmk A sample bookmark file. ap_bookmark.pdf Sample PDF output. ap_bookmark_doc.pdf A document describing the sample. Deploying the Sample To deploy this sample in your environment: 1.   Open the template design ap_bookmark.IFD in Output Designer and recompile the template for the appropriate presentment target. 2.   Modify   the   -z option in the ^job command in the data file ap_bookmark.dat to: • Identify the target output device. • Identify the bookmark file using the -abmk command. • Identify the section for which to generate bookmarks, if desired, using the -abmscommand. For example, To bookmark by Ö  Use the command line parameter Ö  Invoices -abmkap_bookmark.bmk-abmsinvoicesType -abmkap_bookmark.bmk-abmstypeAmount -abmkap_bookmark.bmk-abmsamount
PDF Bookmark Sample Page 4 of 4 3.   Place the accompanying files in directories consistent with your implementation: • Place ap_bookmark.IFD in the Designs subdirectory for Output Designer. • Place ap_bookmark.mdf in the forms subdirectory accessible to Central. • Place ap_bookmark.bmk in an addressable directory. Running the Sample • To run this sample, place ap_bookmark.dat in the collector directory scanned by Central. 
`


export async function getAllDocuments(queryData: TeacherDownloadQuery) {

    const docData = await app.firestore().collection(`faculty`).doc(queryData.faculty).collection(`department`).doc(queryData.department).collection(`reports`).doc(queryData.code).collection(queryData.year)
        .get();

    const documents:any[] = docData.docs.map((doc) => {
        return (doc.data())
    })

    return (documents)


}


export async function detectPlagiarismLevels(doc: documentData, setlevel: (lvl: number) => void) {

    //spliting text in 10 word sized arrays
    const blocks = splitSentence(docText, BLOCK_SIZE);
    let matchedDocs: any = {}, detailForMatches: any = [];
    for (let i in blocks) {
        //removing spaces from blocks
        const block = removeOccurence(blocks[i], [` `]);
        try {
            console.log(`start fetching...`)
            if(+i===blocks.length-1){ //execution statement for last block check
                await    app.database().ref(`blocks`).child(block).once(`value`, (snapshot) => {
                let val: any = snapshot.val();

                if (val) {
                    let key: string = Object.keys(val)[0]
                    if (doc.date < val[key].date) {

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
            }
             app.database().ref(`blocks`).child(block).once(`value`, (snapshot) => {
                let val: any = snapshot.val();

                if (val) {
                    let key: string = Object.keys(val)[0]
                    if (doc.date < val[key].date|| doc.matricle===val[key].matricle ) {

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
        } catch (err) {
            // console.log(err)
        }

    }

    return { matchedDocs, detailForMatches }

}