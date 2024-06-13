import { Order, Service, AvailabilityScheduleType} from "../../interfaces";
import {useState, useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Calendar from "./calendar/calendar";
import moment from "moment";


const ServicePage = () => {
    const visit_api_url = import.meta.env.VITE_VISIT_API_URL
    const navigate = useNavigate()
    const {id} = useParams();
    const [service, setService] = useState<Service | null>(null)
    const [orders, setOrders] = useState<Order[] | null>(null)
    const [availabilitySchedule, setAvailabilitySchedule] = useState<AvailabilityScheduleType | null>(null)

    useEffect(() => {
        requestService()
            .then((doctorId) => {
                requestDoctorOrders(doctorId)
                requestDoctorAvailabilitySchedule(doctorId)
            })
    }, []);

    const requestService = async() => {
        const response = await fetch(visit_api_url + "/api/services/" + id)
        if(!response.ok){
            return
        }
        const data = await response.json()
        setService(data)
        return data.doctor.id
    }

    const requestDoctorOrders = async (doctorId: string) => {
        const response = await fetch(visit_api_url + "/api/doctors/" + doctorId + "/orders/")
        if(!response.ok){
            console.log("request error")
            return
        }
        const data = await response.json()
        setOrders(data)
    }

    const requestDoctorAvailabilitySchedule = async (doctorId: string) => {
        const response = await fetch(visit_api_url + "/api/doctors/" + doctorId + "/availability_table/")
        if(!response.ok){
            console.log("request error")
            return
        }
        const data = await response.json()
        setAvailabilitySchedule(data)
    }

    const onServiceDateTimePicked = (date: Date) => {
        const resDate = moment(date).add(2, "hour").toDate()
        navigate("/order?serviceId="+service?.id+"&date="+resDate.toISOString())
    }


  return (
      <div className="w-full">
        <div className="w-4/5 m-auto max-w-screen-2xl py-3">
          <div className="flex flex-col gap-3 py-5">
              <div>
                  <h1 className="text-2xl font-bold">Dr. {service?.doctor?.name} {service?.doctor?.email} - {service?.name}</h1>
              </div>
              <div>
                  <p><strong>Opis:</strong> {service?.description}</p>
              </div>
              <div>
                  <p className="text-xl">Dostępne wolne terminy:</p>
              </div>
          </div>
            {(orders!== null && availabilitySchedule !== null) && <Calendar orders={orders} availabilitySchedule={availabilitySchedule!} onServiceDateTimePicked={onServiceDateTimePicked}/>}
        </div>
      </div>
  )
}

export default ServicePage