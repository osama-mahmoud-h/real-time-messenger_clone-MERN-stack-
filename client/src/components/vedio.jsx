import React from "react";
import { Notification } from "./notifications";
import { Options } from "./options";
import { VedioPlayer } from "./vedioPlayer";

export const Vedio = ()=>{
    return (<div>
        vedio compont
        <VedioPlayer/>
        <Options>
            <Notification/>
        </Options>
    </div>);
}