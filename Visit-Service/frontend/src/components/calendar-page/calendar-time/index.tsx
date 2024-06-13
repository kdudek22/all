import {useEffect, useState} from "react";
import moment from "moment/moment";

interface Time{
    time:string
}

const CalendarTime = () => {

  const maxHour = 18
  const minHour = 8
  const slotMinuteIncrement = 60
  const [times, setTimes] = useState<Time[]>([])


    useEffect(() => {
        generateTimes()
    }, []);

  const dateToString = (date: Date)=>{
        return moment(date).format("HH:mm");
    }

  const generateTimes = () => {
      const res:Time[] = []
      const currentTime = new Date(new Date().setHours(minHour,0,0,0))
      const maxTime = new Date(new Date().setHours(maxHour,0,0,0))
      while(currentTime<maxTime){
          res.push({time:dateToString(currentTime)})
          currentTime.setMinutes(currentTime.getMinutes() + slotMinuteIncrement);
      }
      setTimes(res)
  }


  return (
      <div className='flex flex-col'>
          <div className="h-8 md:h-16">
              <span className="font-bold">Godz</span>
          </div>
          {times.map((time, index)=>(
              <div className="h-32 md:h-16 border-t-2 border-l-2 border-r-2" key={index}>{time.time}</div>
          ))}
      </div>
  )
}

export default CalendarTime