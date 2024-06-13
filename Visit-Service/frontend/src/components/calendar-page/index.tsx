import useStore from "../../store/store.ts";
import {useEffect, useState} from "react";
import {AvailabilityScheduleType, Order} from "../../interfaces";
import Calendar from "./calendar";


const CalendarPage = () => {
  const visit_api_url = import.meta.env.VITE_VISIT_API_URL
  const doctorId = useStore.getState().userId
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState(false)
  const [availabilitySchedule, setAvailabilitySchedule] = useState<AvailabilityScheduleType | null>(null)

  useEffect(() => {
    requestForOrders()
        .then(() => requestAvailabilitySchedule())

  }, []);

  const requestForOrders =async () => {
    const response = await fetch(visit_api_url + "/api/doctors/" + doctorId + "/orders/")
    if(!response.ok){
      console.log("request error")
      return
    }
    const data = await response.json()
    setOrders(data)
  }

  const requestAvailabilitySchedule = async() => {
    const response = await fetch(visit_api_url + "/api/doctors/" + doctorId + "/availability_table/")
    if(!response.ok){
      console.log("request error")
      setError(true)
      return
    }
    const data = await response.json()
    setAvailabilitySchedule(data)
  }

  return (
      <div className="w-full">
        <div className="w-4/5 m-auto max-w-screen-2xl py-5">
          {error?
              <h1>Wystąpił błąd lub nie masz kalendarza, możesz go dodać w zakładce moje konto</h1>
              :
              <>
                {(orders!== null && availabilitySchedule !== null) && <Calendar orders={orders} availabilitySchedule={availabilitySchedule}></Calendar>}
              </>
          }

        </div>
      </div>
  )
}

export default CalendarPage