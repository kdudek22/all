export interface User {
    id : string,
    name : string,
    email : string,
    role : string
}

export interface UserApi {
    currentPage : number,
    pages : number,
    total : number,
    users : User[]
}
