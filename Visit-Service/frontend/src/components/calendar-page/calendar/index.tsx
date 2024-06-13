import {Order, AvailabilityScheduleType} from "../../../interfaces";
import {useEffect, useState} from "react";
import moment from 'moment';
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/solid";
import CalendarDay from "../calendar-day";
import CalendarTime from "../calendar-time";


type Props = {
  orders:Order[]
  availabilitySchedule: AvailabilityScheduleType
}

const Calendar = ({orders, availabilitySchedule}: Props) => {
    const currentDate = new Date()
    const [currentDisplayDate, setCurrentDisplayDate] = useState(currentDate)
    const [currentDisplayedWeekDays, setCurrentDisplayedWeekDays] = useState<Date[]>([])
    const [currentWeekIndex, setCurrentWeekIndex] = useState<number>(0)

    const createEventsMapFromOrders = (orders: Order[]) => {
        const res: Map<string, Order[]> = new Map()
        for(const order of orders){
            const day = order.date.split(" ")[0]
            if(res.has(day)){
                res.get(day)!.push(order)
            }
            else{
                res.set(day, [order])
            }
        }
        return res
    }

    const [eventsMap, setEventsMap] = useState<Map<string, Order[]>>(createEventsMapFromOrders(orders))

    useEffect(() => {
        const weekDays = generateWeek(currentDisplayDate)
        updateEventsMap(weekDays)
        setCurrentDisplayedWeekDays(weekDays)
    }, [currentDisplayDate]);

      const generateWeek = (randomDayFromWeek: Date) => {
        const day = randomDayFromWeek.getDay()
        const monday = new Date(randomDayFromWeek)
        monday.setDate(randomDayFromWeek.getDate() - day + 1)
        const res = []

        for(let i =0; i<7; i++){
            const date = moment(monday).clone().add(i, "days")
            res.push(date.toDate())
        }
        return res
    }

    const updateEventsMap = (weekDays: Date[]) => {
        const newMap = new Map(eventsMap)
        for(const day of weekDays){
            if(!newMap.has(day.toLocaleDateString("en-GB"))){
                newMap.set(day.toLocaleDateString("en-GB"), [])
            }
        }
        setEventsMap(newMap)
    }

    const dayNumberToValue = (day_number: number):string =>  {
        switch (day_number) {
            case 0:
                return "sunday"
            case 1:
                return "monday"
            case 2:
                return "tuesday"
            case 3:
                return "wednesday"
            case 4:
                return "thursday"
            case 5:
                return "friday"
            case 6:
                return "saturday"
        }
        return ""
    }

    const goToPrevWeek = () => {
        setCurrentWeekIndex(index => index - 1)
        setCurrentDisplayDate(subtractWeekFromDate(currentDisplayDate))
    }
    const goToNextWeek = () => {
        setCurrentWeekIndex(index => index + 1)
        setCurrentDisplayDate(addWeekToDate(currentDisplayDate))
    }

    const subtractWeekFromDate = (date:Date) => {
        return moment(date).clone().subtract(7, "days").toDate()
    }
    const addWeekToDate = (date:Date) => {
        return moment(date).clone().add(7, "days").toDate()
    }

    const handleServiceDateTimePicked = (date: Date) => {
        console.log(date)
    }


  return (
        <div className="text-xs md:text-lg p-3 border-4 border-primary-200 rounded-2xl bg-white">
            <div className="flex justify-center items-center">
                <div>
                    <button disabled={currentWeekIndex < -25}>
                        <ArrowLeftIcon onClick={goToPrevWeek} className={`w-8 h-8 ${currentWeekIndex < -25?"text-gray-300":""}`}></ArrowLeftIcon>
                    </button>
                </div>
                <div className="w-full">
                    <div className="flex justify-around">
                        <CalendarTime/>
                        {currentDisplayedWeekDays.map((day, index)=>(
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div className="h-8 md:h-16">
                                    <span className="font-bold">{day.getDate()}.{day.getMonth() + 1}</span>
                                </div>
                                {(eventsMap!== null && availabilitySchedule!==null) &&
                                    <CalendarDay orders={eventsMap.get(day.toLocaleDateString("en-GB"))!} date={day} dayAvailability={availabilitySchedule[dayNumberToValue(day.getDay())]!} onTilePressed={handleServiceDateTimePicked}></CalendarDay>
                                }
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <button disabled={currentWeekIndex > 25}>
                        <ArrowRightIcon onClick={goToNextWeek} className={`w-8 h-8 ${currentWeekIndex >= 25?"text-gray-300":""}`}>next</ArrowRightIcon>
                    </button>
                </div>
            </div>
        </div>
  )
}

export default Calendar