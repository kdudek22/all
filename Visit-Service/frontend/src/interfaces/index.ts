export interface AvailabilityScheduleType {
    [key: string]: DayAvailability | null
    monday:DayAvailability | null
    tuesday:DayAvailability | null
    wednesday:DayAvailability | null
    thursday:DayAvailability | null
    friday:DayAvailability | null
    saturday:DayAvailability | null
    sunday:DayAvailability | null
}
export interface DayAvailability {
    [key: string] : string
    start: string
    end: string
}

export interface Doctor {
  id: number
  name: string
  email: string
  title: string
}


export interface Customer{
    id: number
    name: string
    email: string
}

export interface Service {
  id?: number
  name: string
  description: string
  price: number
  doctor?: Doctor
}

export interface Order {
    id: number
    date: string
    service: Service
    customer: Customer
}


export enum TileType{
    Free,
    Taken,
    NotVisible
}

export interface CalendarTile {
    type: TileType
    date: string
    order?: Order
}
