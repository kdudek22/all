import {Order, AvailabilityScheduleType} from "../../../../interfaces";
import {useEffect, useState} from "react";
import moment from 'moment';
import {ArrowLeftIcon, ArrowRightIcon} from "@heroicons/react/24/solid";
import CalendarDay from "../calendar-day";


type Props = {
  orders:Order[]
  availabilitySchedule: AvailabilityScheduleType
  onServiceDateTimePicked: (date:Date) => void
}

const Calendar = ({orders, availabilitySchedule, onServiceDateTimePicked}: Props) => {
    const currentDate = new Date()
    const [currentDisplayDate, setCurrentDisplayDate] = useState(currentDate)
    const [currentDisplayedWeekDays, setCurrentDisplayedWeekDays] = useState<Date[]>([])
    const [weekIndex, setWeekIndex] = useState(0)

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
        setCurrentDisplayDate(subtractWeekFromDate(currentDisplayDate))
        setWeekIndex(prevState => prevState - 1)
    }
    const goToNextWeek = () => {
        setCurrentDisplayDate(addWeekToDate(currentDisplayDate))
        setWeekIndex(prevState => prevState + 1)
    }

    const subtractWeekFromDate = (date:Date) => {
        return moment(date).clone().subtract(7, "days").toDate()
    }
    const addWeekToDate = (date:Date) => {
        return moment(date).clone().add(7, "days").toDate()
    }

    const handleServiceDateTimePicked = (date: Date) => {
        onServiceDateTimePicked(date)
    }

  return (
        <div>
            <div className="flex justify-center items-center">
                <div className="flex justify-center items-center bg-white p-3 border-2 border-primary-100">
                    <div>
                        <button disabled={weekIndex <= 0}>
                            <ArrowLeftIcon onClick={goToPrevWeek} className={`w-8 h-8 ${weekIndex<=0? "text-gray-300":""}`}></ArrowLeftIcon>
                        </button>
                    </div>
                    <div className="p-3">
                        <div className="flex gap-1">
                            {currentDisplayedWeekDays.map((day, index)=>(
                                <div key={index} className="flex flex-col items-center">
                                    <div className="pb-3">
                                        <span className="font-bold">{day.getDate()}.{day.getMonth() + 1}</span>
                                    </div>
                                    {(availabilitySchedule !== null && eventsMap !== null) &&
                                        <CalendarDay orders={eventsMap.get(day.toLocaleDateString("en-GB"))!} date={day} dayAvailability={availabilitySchedule[dayNumberToValue(day.getDay())]!} onTilePressed={handleServiceDateTimePicked}></CalendarDay>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <button disabled={weekIndex >= 5}>
                            <ArrowRightIcon onClick={goToNextWeek} className={`w-8 h-8 ${weekIndex >= 5?"text-gray-300":""}`}>next</ArrowRightIcon>
                        </button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Calendar