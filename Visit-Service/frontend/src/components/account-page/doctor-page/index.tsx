import AvailabilitySchedule from "./availaiblity-schedule";
import {Service} from "../../../interfaces";
import {AvailabilityScheduleType} from "../../../interfaces";
import ServiceTileDoctorView from "./service-tile";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import useStore from "../../../store/store.ts";

const DoctorAccountPage = () => {
    const navigate = useNavigate();
    const userId = useStore.getState().userId
    const visit_api_url = import.meta.env.VITE_VISIT_API_URL
    const [isCreatingAvailabilitySchedule, setIsCreatingAvailabilitySchedule] = useState(false)
    const [availabilitySchedule, setAvailabilitySchedule] = useState<AvailabilityScheduleType | null>(null)
    const [services, setServices] = useState<Service[]>([])

    useEffect(() => {
        requestAvailabilityTable()
        requestDoctorServices()
    }, []);

    const requestAvailabilityTable = async () =>{
        const response = await fetch(visit_api_url + "/api/doctors/" + userId + "/availability_table/")
        if (!response.ok){
            console.log("request error")
            return
        }
        const data = await response.json()
        setAvailabilitySchedule(data)
    }

    const requestDoctorServices = async () =>{
        const response = await fetch(visit_api_url + "/api/doctors/" + userId + "/services/")
        if (!response.ok){
            console.log("request error")
            return
        }
        const data = await response.json()
        setServices(data)
    }

  const onServiceEditClicked = (serviceId: number) => {
      navigate("/edit?serviceId="+serviceId)
  }

  const onServiceDeleteClicked = (serviceId: number) => {
      console.log("Deleting " + serviceId)
  }

  const handleCreateAvailabilityTable = () => {
        setIsCreatingAvailabilitySchedule(true)
        setAvailabilitySchedule({monday:null, tuesday:null, wednesday: null, thursday:null, friday:null, saturday:null, sunday:null})
  }

  const handleAvailabilityTableCreationCancel = () => {
        setAvailabilitySchedule(null)
  }

  const handleAvailabilityTableUpdate = async (newAvailabilityTable: AvailabilityScheduleType)=>{
      const method = isCreatingAvailabilitySchedule? "POST" : "PATCH"
      const body = newAvailabilityTable
      const doctorId = useStore.getState().userId
      const response = await fetch(visit_api_url + "/api/doctors/"+doctorId+"/availability_table/",{
          method: method,
          headers:{
              "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
      })

      if(!response.ok){
          console.log("request error")
          return
      }
      const data = await response.json()
      setAvailabilitySchedule(data)
  }


  return (
      <div className="w-full">
        <div className="w-4/5 m-auto max-w-screen-2xl py-8 flex flex-col lg:flex-row">
            <div className="lg:w-2/3 text-center lg:text-left">
                <h1 className="text-2xl py-3 font-bold">Witaj {useStore.getState().username}!</h1>
                <div className="flex flex-col gap-3 py-3">
                    <h2>Twoje serwisy:</h2>
                    {services.length > 0 ?
                        <div className="flex flex-col gap-5">
                            {services.map((service, index)=> (
                                <ServiceTileDoctorView key={index} service={service} onEditClicked={onServiceEditClicked} onDeleteClicked={onServiceDeleteClicked}/>
                            ))}
                        </div>
                        :
                        <>Nie masz jeszcze serwisów :(</>
                    }
                    <div>
                        <Link to={"/edit"} className="bg-primary-100 px-2 py-1 rounded text-white">Dodaj serwis</Link>
                    </div>
                </div>
            </div>
            <div className="lg:w-1/3 flex flex-col lg:py-8 items-center">
                <h2 className="font-bold">Twój grafik:</h2>
                <div>
                {availabilitySchedule !== null ?
                    <AvailabilitySchedule onAvailabilityTableUpdate={handleAvailabilityTableUpdate} availabilitySchedule={availabilitySchedule} isCreating={isCreatingAvailabilitySchedule} cancelCreation={handleAvailabilityTableCreationCancel}/>
                        :
                    <div>
                        <button onClick={handleCreateAvailabilityTable} className="bg-primary-200 px-3 py-2 rounded">Stwórz swój grafik!</button>
                    </div>
                }
                </div>
                {availabilitySchedule &&
                    <div className="my-16">
                        <Link to="/add_out_of_office" className="px-2 py-1 rounded bg-primary-200 text-white hover:text-blue-200">Dodaj nieobecności</Link>
                    </div>}
            </div>
        </div>
      </div>
  )
}

export default DoctorAccountPage