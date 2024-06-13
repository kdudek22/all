import {Service} from "../../../interfaces";
import {Link} from "react-router-dom";

type Props = {
  service:Service
}

const ServiceTile = ({service}: Props) => {


  return (
      <div className="shadow-lg rounded p-5 bg-white">
        <div className="flex flex-col gap-3">
            <div>
                <h2 className="font-bold text-xl">Dr. {service.doctor?.name} {service.doctor?.email} {service?.doctor?.title}</h2>
            </div>
           <div className="flex justify-between">
               <Link className="hover:text-primary-200" to={"/service/"+service.id}>{service.name}</Link>
               <p>Cena: <strong>{service.price}zł</strong> </p>
           </div>
        </div>
      </div>
  )
}

export default ServiceTile