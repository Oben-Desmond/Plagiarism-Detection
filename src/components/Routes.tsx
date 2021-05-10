import { IonRouterOutlet } from "@ionic/react";
import React from "react";
import { Route, Redirect } from "react-router";
import Home from "../Pages/Home";
import Saved from "../Pages/Saved";
import Starred from "../Pages/Starred";



const Routes:React.FC=()=>{

    return(
        <>
        <Route path="/search" component={Home} exact></Route>
        <Route path="/saved" component={Saved} exact></Route>
        <Route path="/starred" component={Starred} exact></Route>
        <Redirect exact from="/" to="/validate"  />
      </>
    )
}

export default Routes