import { Plugins } from "@capacitor/core";

 
export function urlToBase64(url: string, CallBack: (newVal: string) => void) {

    fetch(url).then(async (res) => {
        const blob = await res.blob();

        const fr = new FileReader();

        fr.onload = () => {
            console.log(fr.result)
            const text = fr.result + ``
            if (fr.result) {
                CallBack(text)
            }
            else{
                return (url)
            }
        }

        fr.readAsDataURL(blob);

        //  if(text){
        //      CallBack(text)
        //  }
    })

}