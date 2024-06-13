import {useState} from "react";
import { ArrowUturnLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";

import {AvailabilityScheduleType} from "../../../../interfaces";

type Props = {
    availabilitySchedule: AvailabilityScheduleType,
    isCreating: boolean,
    cancelCreation: () => void
    onAvailabilityTableUpdate: (a: AvailabilityScheduleType) => void
}
const AvailabilitySchedule = ({availabilitySchedule, isCreating, cancelCreation, onAvailabilityTableUpdate}: Props) => {

    const [formSchedule, setFormSchedule] = useState(structuredClone(availabilitySchedule))
  const handleTimeChange = (day: string, field: string, value: string) => {
      const newSchedule = {...formSchedule}
      if(newSchedule[day] === null){
          return
      }
      else{
          newSchedule[day]![field] = value
      }
      setFormSchedule({...newSchedule})
  }

  const handleDayAvailabilityChange = (day: string, availability: string) => {
      const newSchedule = {...formSchedule}
      if(availability === "Nie"){
          newSchedule[day] = null
      }
      else{
          newSchedule[day] = {start: "8:00", end: "16:00"}
      }
      setFormSchedule({...newSchedule})
  }

  const canUpdateSchedule = () => {
      for(const key of Object.keys(formSchedule)){
          if((formSchedule[key] === null && availabilitySchedule[key]!== null) ||((formSchedule[key] !== null && availabilitySchedule[key]=== null))){
              return true
          }
          else if(formSchedule[key] !== null && availabilitySchedule[key] !==null){
              if(formSchedule[key]!.start !== availabilitySchedule[key]!.start || formSchedule[key]!.end !== availabilitySchedule[key]!.end){
                  return true
              }
          }
      }
      return false
  }

  const restoreScheduleToDefault = () => {
      setFormSchedule(structuredClone(availabilitySchedule))
  }

  const updateSchedule = () => {
      onAvailabilityTableUpdate(formSchedule)
  }



  return (
      <div className="shadow rounded-2xl p-3 w-con w-max border-4 border-primary-200 bg-white">
          <table className="text-xs text-left">
              <thead>
                  <tr>
                      <th className="px-1">Dzień</th>
                      <th className="px-1">Start</th>
                      <th className="px-1">Koniec</th>
                      <th className="px-1">Dostępny</th>
                  </tr>
              </thead>
              <tbody>
                  {Object.entries(formSchedule!).map(([day, val]) => (
                      <tr key={day}>
                          <td className="px-1">{day}</td>
                          <td className="px-1">
                              <input className="w-10" type="text" value={val?.start || "-"} onChange={(e) => handleTimeChange(day, "start", e.target.value)}></input>
                          </td>
                          <td className="px-1">
                              <input className="w-12" type="text" value={val?.end || "-"} onChange={(e) => handleTimeChange(day, "end", e.target.value)}></input>
                          </td>
                          <td className="px-1">
                              <select value={val === null? "Nie":"Tak"} onChange={(e) => handleDayAvailabilityChange(day, e.target.value)}>
                                  <option>Tak</option>
                                  <option>Nie</option>
                              </select>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          <div className="flex justify-center pt-5 items-center relative">
            <div className={` ${isCreating?"block": "invisible"} absolute left-8 hover:cursor-pointer`} onClick={()=>cancelCreation()}>
                  <XMarkIcon className="w-4 h-4"/>
              </div>
              <button onClick={updateSchedule} disabled={!canUpdateSchedule()} className="disabled:bg-gray-200 bg-primary-100 px-2 py-1 rounded text-white">
                  {isCreating?"Stwórz":"Zaktualizuj!"}
              </button>
              <div className={` ${canUpdateSchedule()?"block": "invisible"} absolute right-8 hover:cursor-pointer`} onClick={()=>restoreScheduleToDefault()}>
                  <ArrowUturnLeftIcon className="w-4 h-4"/>
              </div>
          </div>

          
      </div>
  )
}

export default AvailabilitySchedule