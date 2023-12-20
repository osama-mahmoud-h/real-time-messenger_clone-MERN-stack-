import {CorsOptions} from "cors";

export const getCorsOptions = (): CorsOptions =>{

    return {
        origin: ["http://localhost:3000","http://localhost:3001"],
    };
}