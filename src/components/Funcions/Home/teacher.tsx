import app from "../../../Firebase";
import { documentData, TeacherCourseData } from "../../interfaces/document";
import { uploadDocumentParams } from "./home";



export async function getTeacherInfo(){
   let  docSnapshot = await app.firestore().collection(`teachers`).doc(`obend678@gmail.com`).get()

   return (docSnapshot.data())
}


export async function updateReview(data:documentData,status:`pending`|`accepted`|`rejected`,review_message:string, callback:()=>void){

     const doc:documentData= {...data, status, review_message}
     await uploadDocumentParams(doc);
     callback()
}


export  const downloadCourses:(email:string)=>Promise<TeacherCourseData[]>=async(email:string)=>{
  
   const docRes= await app.firestore().collection(`teachers`).doc(email).collection(`courses`).get()
   const documents:TeacherCourseData[]|any[]=docRes.docs.map((doc)=>doc.data())
   return  documents

}