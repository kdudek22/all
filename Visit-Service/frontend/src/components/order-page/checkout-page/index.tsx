import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Order, Service} from "../../../interfaces";
import {CalendarIcon} from "@heroicons/react/24/solid";
import moment from "moment/moment";
import useStore from "../../../store/store.ts";


const OrderPage = () => {
    const navigate = useNavigate()
    const parseDateString = (dateString: string)=> {
        return new Date(dateString)
    }
    const visit_api_url = import.meta.env.VITE_VISIT_API_URL
    const [searchParams] = useSearchParams()
    const serviceId = searchParams.get("serviceId")
    const serviceDate = parseDateString(searchParams.get("date")||"")
    const [service, setService] = useState<Service| null>()

    useEffect(() => {
        requestForService()
    }, []);

    const requestForService= async() => {
        const response = await fetch(visit_api_url + "/api/services/"+serviceId)
        if(!response.ok){
            console.log("request error")
        }
        const data = await response.json()

        setService(data)
    }

    const formatDate = (date: Date) => {
        return moment(date).format("MMMM Do YYYY, HH:mm");
    }

    const handleOrderSubmit = async() => {
        const formattedDate = serviceDate.toISOString()
        const userId = useStore.getState().userId
        const body = {date: formattedDate, customer_id: userId, service_id: serviceId}
        console.log(body)
        const response = await fetch(visit_api_url + "/api/doctors/"+service?.doctor?.id+"/orders/",{
          method: "POST",
          headers:{
              "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
      })
        if(!response.ok){
            console.log("request error")
        }
      const data: Order = await response.json()

      const orderNumber = data.id
      navigate("/order_succesfull?order_id="+orderNumber)
    }




  return (
      <div className="w-full">
        <div className="w-4/5 m-auto max-w-screen-sm py-8 flex flex-col gap-3">
            <h1 className="text-2xl font-bold px-3">Podsumowanie:</h1>
            <div className="bg-gray-200 p-3 ">
                <h1 className="font-bold">{service?.doctor?.name} {service?.doctor?.email}</h1>
                <h2>{service?.name}</h2>
                <div className="flex items-center">
                    <CalendarIcon className="w-4 h-4"></CalendarIcon>
                    <p>{formatDate(serviceDate)}</p>
                </div>
            </div>
            <div className="flex justify-between px-3">
                <p>Cena:</p>
                <p>120zł</p>
            </div>
            <div className="">
                <button onClick={handleOrderSubmit} className="bg-blue-400 py-2 px-3 text-white rounded hover:text-blue-200">Płatnośc</button>
            </div>
        </div>
      </div>
  )
}

export default OrderPage