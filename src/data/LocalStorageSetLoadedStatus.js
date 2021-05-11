import { Plugins } from "@capacitor/core";

export  function LocalStorageSetLoadedStatus(status=false){
   status=`${status}`
   Plugins.Storage.set({key:`pending_notification`,value:status})
   .then (()=>console.log(`loaded ${status}`))
   .catch(console.log)
   return ;
}

export  async function getLocalStorageStatus(){
     const val = (await  Plugins.Storage.get({key:`pending_notification`})).value;
     return val
}