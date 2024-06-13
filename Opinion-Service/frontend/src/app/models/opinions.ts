import { Opinion, OpinionApi } from "./opinion";

export interface Opinions {
    opinions : Opinion[],
    total_pages : number
}

export interface OpinionsApi {
    opinions : OpinionApi[],
    total_pages : number
}