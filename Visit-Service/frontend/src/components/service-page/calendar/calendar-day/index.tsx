import {CalendarTile, DayAvailability, Order, TileType} from "../../../../interfaces";
import {useEffect, useState} from "react";
import moment from "moment";

type Props = {
  orders:Order[]
  date: Date
  dayAvailability: DayAvailability
  onTilePressed: (date: Date) => void
}

const CalendarDay = ({orders, date, dayAvailability, onTilePressed}: Props) => {

    const maxHour = 18
    const minHour = 8
    const slotMinuteIncrement = 60
    const [dayTiles, setDayTiles] = useState<CalendarTile[]>()

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
        if(dayAvailability === null || date.setHours(0,0,0,0) < new Date().setHours(0,0,0,0)){
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
                /*If the time is in the active times of the service, we have to either make it an available slot or put
                * a taken tile. We simply check if the eventTile does not contain an entry for the given time*/
                if(new Date()> currentTime){
                    res.push({type: TileType.NotVisible, date: timeString})
                }
                else{
                    let added = false
                    orders.filter((element)=>{
                        if(element.date.split(" ")[1] == timeString){
                            res.push({type:TileType.Taken, date: timeString})
                            added = true
                        }
                })
                if(!added){
                    res.push({type: TileType.Free, date: timeString})
                }
                }
            }
            else{
                /*If the time is above the service end time, we add a not visible slot*/
                res.push({type:TileType.NotVisible, date:timeString})
            }
            /*Increment the time for the next iteration*/
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


    const tilePressed = (e:any) => {
        const hour = parseInt(e.target.textContent.split(":")[0])
        const minute = parseInt(e.target.textContent.split(":")[1])
        const datetime = new Date(date.setHours(hour, minute, 0, 0))
        onTilePressed(datetime)
    }

  return (
    <div className="flex flex-col gap-1 items-center text-xs">
        {dayTiles?.map((tile, index)=>(
            <div key={index}>
                <button onClick={tilePressed} disabled={tile.type === TileType.NotVisible || tile.type === TileType.Taken}
                        className={`rounded w-12 py-1  ${tile.type===TileType.Taken?"line-through":""}
                        ${tile.type===TileType.Free?"bg-emerald-100 hover:bg-primary-100":""}`}>
                    {tile.type!==TileType.NotVisible? tile.date:"-"}
                </button>
            </div>
        ))}
    </div>
  )
}

export default CalendarDay