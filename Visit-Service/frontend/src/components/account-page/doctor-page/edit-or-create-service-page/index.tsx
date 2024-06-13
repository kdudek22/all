import {useSearchParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Service} from "../../../../interfaces";
import useStore from "../../../../store/store.ts";

const EditOrCreateServicePage = () => {
  const visit_api_url = import.meta.env.VITE_VISIT_API_URL
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("serviceId") || 0
  const [formService, setFormService] = useState<Service>({
      name:"",
      description:"",
      price: 0
  })

    useEffect(() => {
        if(serviceId !== 0){
            requestService()
        }
    }, []);

  const requestService = async () => {
      const response = await fetch(visit_api_url + "/api/services/"+serviceId)
      if(!response.ok){
          console.log("request error")
          return
      }
      const data = await response.json()
      setFormService(data)
  }

  const handleChange = (e: any) => {
      const {name, value} = e.target
      setFormService({...formService, [name]: value})
  }

  const handleSubmit = async () => {
        if(serviceId === 0 ){
            postService()
        }
        else{
            patchService()
        }
  }

  const postService = async() =>{
      const body = {...formService, doctor_id:useStore.getState().userId!}
      const response = await fetch(visit_api_url + "/api/services/",{
          method: "POST",
          headers:{
              "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
      })

      if(!response.ok){
          console.log("request error")
          return
      }
    navigate("/account/doctor")
    }

  const patchService = async() => {
      const body = {...formService}
      const response = await fetch(visit_api_url + "/api/services/"+serviceId,{
          method: "PATCH",
          headers:{
              "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
      })

      if(!response.ok){
          console.log("request error")
          return
      }
      navigate("/account/doctor")
  }


  return (
      <div className="w-full">
        <div className="w-4/5 m-auto py-8 max-w-screen-2xl">
            {/*<form>*/}
                <div className="flex flex-col gap-3">
                    <label>Service Name</label>
                    <input name="name" type="text"  value={formService.name} onChange={handleChange} className="border-2 p-1 rounded-md focus:outline-none focus:border-primary-100"></input>
                    <label>Service Description</label>
                    <textarea name="description" value={formService.description} onChange={handleChange} className="border-2 p-1 rounded-md focus:outline-none focus:border-primary-100"></textarea>
                    <label>Service Price</label>
                    <input name="price" type="number" value={formService.price} onChange={handleChange} className="border-2 p-1 rounded-md focus:outline-none focus:border-primary-100"></input>
                    <div className="flex justify-center">
                        <button onClick={handleSubmit} type="submit" className="bg-primary-100 px-2 py-1 rounded">{serviceId === 0?"Utwórz":"Zapisz"}</button>
                    </div>
                </div>
            {/*</form>*/}
        </div>
      </div>
  )
}

export default EditOrCreateServicePage