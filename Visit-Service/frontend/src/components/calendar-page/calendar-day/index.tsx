import {CalendarTile, DayAvailability, Order, TileType} from "../../../interfaces";
import {useEffect, useState} from "react";
import moment from "moment";

type Props = {
  orders:Order[]
  date: Date
  dayAvailability: DayAvailability
  onTilePressed: (date: Date) => void
}

const CalendarDay = ({orders, date, dayAvailability}: Props) => {

    const maxHour = 18
    const minHour = 8
    const slotMinuteIncrement = 60
    const [dayTiles, setDayTiles] = useState<CalendarTile[]>([])

    useEffect(() => {
        generateDayTiles();
    }, [orders]);

    const formatTime = (date: Date): string => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    };


    const customTimeToDate = (time: string) => {
        const res = new Date(date)
        res.setHours(parseInt(time.split(":")[0]))
        res.setMinutes(parseInt(time.split(":")[1]))
        res.setSeconds(0)
        res.setMilliseconds(0)
        return res
    }

    const dateToString = (date: Date)=>{
        return moment(date).format("HH:mm");
    }

    const generateDayTiles = () => {
        if(dayAvailability === null){
            /*In this case, there is no provided schedule for the day of the week, in that case, the whole day is
            displayed as not visible slots*/
            generateWholeDayAsNotVisible()
            return
        }
        const res: CalendarTile[] = []
        const serviceStartTime = customTimeToDate(dayAvailability.start)
        const serviceEndTime = customTimeToDate(dayAvailability.end)
        const currentTime = new Date(date.setHours(minHour,0,0,0))
        const maxTime = new Date(date.setHours(maxHour,0,0,0))

        while(currentTime < maxTime){
            const timeString = dateToString(currentTime)
            if(currentTime < serviceStartTime){
                /*If the time is before the service start time, we add a not visible slot*/
                res.push({type: TileType.NotVisible, date: timeString})
            }
            else if(currentTime>= serviceStartTime && currentTime <= serviceEndTime){
                let added = false
                orders.filter((element)=>{
                    if(element.date.split(" ")[1] == timeString){
                        res.push({type:TileType.Taken, date: timeString, order: element})
                        added = true
                    }
                })
                if(!added){
                    res.push({type: TileType.Free, date: timeString})
                }
            }
            else{
                res.push({type:TileType.NotVisible, date:timeString})
            }
            currentTime.setMinutes(currentTime.getMinutes() + slotMinuteIncrement);
        }
        setDayTiles(res)
    }

    const generateWholeDayAsNotVisible = () => {
        const res: CalendarTile[] = []
        const currentDate = new Date()
        currentDate.setHours(8, 0, 0, 0)
        while (currentDate.getHours() < maxHour) {
            const timeString = formatTime(currentDate)
            res.push({type: TileType.NotVisible, date: timeString})
            currentDate.setMinutes(currentDate.getMinutes() + slotMinuteIncrement);
        }
        setDayTiles(res)
    }

  const hashStringToInteger =  (str: string) => {
      let hash = 0
      for (let i = 0; i < str.length; ++i)
        hash = Math.imul(31, hash) + str.charCodeAt(i)

      return hash | 0
  };

  const getRandomColor = (date: string) =>  {
      const colors = [  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
  'bg-indigo-500', 'bg-teal-500', 'bg-gray-500', 'bg-orange-500', 'bg-red-400', 'bg-blue-400', 'bg-green-400', 'bg-yellow-400',
  'bg-purple-400', 'bg-pink-400', 'bg-indigo-400', 'bg-teal-400', 'bg-gray-400', 'bg-orange-400',];

      const hash =  hashStringToInteger(date)
        console.log(colors[hash % colors.length])
      return colors[hash % colors.length];
  }


  return (
    <div className="flex flex-col text-xs w-full">
        {dayTiles?.map((tile, index)=>(
            <div key={index} className="h-32 md:h-16 border-t-2 border-r-2 flex-grow hover:text-white cursor-pointer">
                <p className={`rounded p-2  h-full ${tile.type === TileType.Taken? getRandomColor(tile.date):""} ${tile.type == TileType.Free?"bg-green-100":""} ${tile.type == TileType.NotVisible?"bg-gray-50-100":""}`}>
                    {tile.type === TileType.Taken? tile.order?.service.name + " - " + tile.order?.customer.name:""}
                </p>
            </div>
        ))}
    </div>
  )
}

export default CalendarDay