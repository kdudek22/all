import ServiceTile from "./service-tile";
import {Service} from "../../interfaces";
import {useState, useEffect} from "react";
import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";

const ServicesPage = () => {
    const visit_api_url = import.meta.env.VITE_VISIT_API_URL
    const [services, setServices] = useState<Service[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [baseServices, setBaseServices] = useState<Service[]>([])

    useEffect(() => {
        requestServices()
    }, []);

    const requestServices = async() => {
        const response = await fetch(visit_api_url + "/api/services/")
        if(!response.ok){
            return
        }
        const data = await response.json()
        setBaseServices([...data])
        setServices([...data])
    }

    useEffect(() => {
        if(searchQuery){
            const servicesCopy = [...services]
            const filteredServices = servicesCopy.filter(service=>service.name.includes(searchQuery))
            setServices(filteredServices)
        }
        else{
            setServices([...baseServices])
        }
    }, [searchQuery]);

  return (
      <div className="w-full">
        <div className="w-4/5 m-auto max-w-screen-sm">
            <div className="w-full py-5 flex relative">
            <MagnifyingGlassIcon className="w-4 h-4  bottom-7 left-3 absolute"/>
                <input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} name="name" type="text" className="border-2 ps-8 w-full text-sm p-1 rounded-md focus:outline-none focus:border-primary-100" placeholder="Wyszukaj..."></input>
            </div>
            <div className='flex flex-col gap-5'>
              {services.map((service, index)=>(
              <ServiceTile key={index} service={service}/>
          ))}
          </div>
        </div>
      </div>
  )
}

export default ServicesPage