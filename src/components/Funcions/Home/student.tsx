import app from "../../../Firebase";
import { documentData, StudentProfile, TeacherCourseData } from "../../interfaces/document";
import { uploadDocumentParams } from "./home";


const StudentDocRef = (student: StudentProfile) => {
    const { matricle } = student
    let day: Date = new Date();
    let dateStr = `${day.getFullYear()}`;
    console.log(matricle, dateStr)
    return (app.storage().ref(`students`).child(matricle).child(dateStr))
}

export async function downloadReports(student: StudentProfile, setreports:(rpts:documentData[]|any[])=>void) {

    console.log(`${student.matricle}`)
   app.firestore().collection(`students`).doc(student.email).collection(`reports`).onSnapshot((reportSnapshot)=>{
         const rpts=reportSnapshot.docs.map(res=>res.data())
         console.log(rpts)
    setreports( rpts)
   })
   
}


export async function getStudentInfo(email: string) {

    const snapshot = await app.firestore().collection(`students`).doc(email).get()
    return snapshot.data()
}


export async function uploadProjectDocument(blob: File, studentInfo: StudentProfile, setprogress: (level: number) => void, seturl: (url: string) => void, setpdfText:(text:string)=>void) {

    const uploadTask = StudentDocRef(studentInfo).child(blob.name).put(blob)
    uploadTask.on('state_changed',
        (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes);
            setprogress(progress)
            console.log('Upload is ' + progress + '% done');
            // switch (snapshot.state) {
            //     case app.storage.TaskState.PAUSED: // or 'paused'
            //         console.log('Upload is paused');
            //         break;
            //     case app.storage.TaskState.RUNNING: // or 'running'
            //         console.log('Upload is running');
            //         break;
            // }
        },
        (error) => {
            // Handle unsuccessful uploads
            alert(error.message)
            return null
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
                seturl(downloadURL)
                const url = downloadURL
                console.log(downloadURL)
                console.log(`processing`)

                //   fetchData(studentInfo.matricle+`.pdf`,url,setpdfText)


            });
        }
    );
    return;

}



// export async function fetchData(path: string, pdfUrl:string, setpdfText:(text:string)=>void) {
//     console.log(`processing`)
//     // const res = await fetch(`http://localhost:3000/stored?pdfUrl=${pdfUrl}&name=${path}`)
//     const text=(await res.json()).value
//     console.log(text)
//     setpdfText(text)
//     return text
// }

export async function fetchData(docdata:documentData, setpdfText:(text:string)=>void) {
    console.log(`processing`)
    const res = await app.database().ref(`texts`).child(docdata.matricle).child(docdata.code).once(`value`,(snap)=>{
       const val=snap.val()
       if(val){
        setpdfText(val)
       }
       else{
           setpdfText(``)
       }
    })
  
}
