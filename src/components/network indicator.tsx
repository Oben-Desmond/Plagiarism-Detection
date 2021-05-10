import { Plugins } from "@capacitor/core";
import { IonItem, IonLabel, IonIcon } from "@ionic/react";
import { earth, logoIonic, refresh, reload, wifi } from "ionicons/icons";
import  React, { useEffect ,useState} from "react";


const NetworkIndicator:React.FC= function( ){
  const [networkConnected, setnetworkConnected] = useState(true)
    
    useEffect(()=>{
        Plugins.Network.addListener(`networkStatusChange`,res=>{
            if(res.connected){
              setnetworkConnected(true)
            }else{
             setnetworkConnected(false)
            }
         })
        Plugins.Network.getStatus().then(res=>{
           if(res.connected){
              setnetworkConnected(true)
            }else{
             setnetworkConnected(false)
            }
        })
        
    },[])
    return (
        <>
       { !networkConnected&&<IonItem  color='medium' >
           <IonLabel>No Internet Connection</IonLabel>
          <IonIcon slot='end' icon={earth}/>
        </IonItem >
        }
        </>
    )
}

export default NetworkIndicator