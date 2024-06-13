import {Service} from "../../../../interfaces";

type Props = {
    service: Service,
    onEditClicked: (serviceId: number) => void,
    onDeleteClicked: (serviceId: number) => void,
}

const ServiceTileDoctorView = ({service, onEditClicked, onDeleteClicked}: Props) => {


  return (
      <div className="flex flex-col shadow p-3 gap-3 text-left bg-white">
          <p>{service.name}</p>
          <p>{service.description}</p>
          <p>{service.price}zł</p>
          <div className="flex justify-around text-white">
              <div>
                  <button onClick={() => onEditClicked(service.id!)} className="bg-primary-200 py-1 px-2 rounded">Edytuj</button>
              </div>
              <div>
                  <button onClick={() => onDeleteClicked(service.id!)} className="bg-red-500 py-1 px-2 rounded">Usun</button>
              </div>
          </div>
      </div>
  )
}

export default ServiceTileDoctorView