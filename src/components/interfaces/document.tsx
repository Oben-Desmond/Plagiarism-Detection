export interface docBlockInterface {

    date: string,
    title: string,
    code: string,
    matricle: string,
    blockLength: string
    student_name: string,


}

export interface documentData extends docBlockInterface {

    url: string,
    status: `pending` | `accepted` | `rejected`,
    department: string,
    faculty: string,
    tutors: string,
    student_email: string,
    student_contact: string
    review_message:string


}
export interface TeacherDownloadQuery {
    faculty: string,
    department: string,
    code: string,
    year: string
}

export interface SourceDocuments{
    matricle: string,
    level: number,
    student_name:string
}


export interface GoogleUser{
    displayName:string,
    email:string,
    photoURL:string
}


export interface TeacherCourseData{
    credits:string
    department: string
    faculty: string|"FET"
    name: "Machine Learning"|string
    year: "2021"|string
    code:`920`|string
}