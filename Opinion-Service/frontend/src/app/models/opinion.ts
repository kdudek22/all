
export interface Opinion {
    id : number,
    userId : string,
    content : string,
    rating : number,
    doctorId : string,
    doctorName : string,
    username : string
}

export interface OpinionApi {
    id : number,
    userId : string,
    content : string,
    rating : number,
    doctorId : string
}
