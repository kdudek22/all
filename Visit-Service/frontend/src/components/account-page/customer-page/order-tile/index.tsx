import {Order} from "../../../../interfaces";
import moment from 'moment';
import {Link} from "react-router-dom";
import {CalendarIcon} from "@heroicons/react/24/solid";


type Props = {
    order: Order
    handleDeleteOrder: (orderId: number) => void
}

const OrderTile = ({order, handleDeleteOrder}: Props) => {

    const date = moment(order.date, "DD-MM-YYYY HH:mm").toDate()



  return (
      <div className={`shadow p-3 ${new Date() < date? "bg-white": "bg-gray-300"} `}>
        <div className="flex flex-col gap-3">
            <div className="flex justify-between">
                <Link to={"/service/"+order.service.id}>{order.service.name} - Dr. {order.service.doctor?.firstName} {order.service.doctor?.lastName}</Link>
                <div className="flex justify-center items-center">
                    <CalendarIcon className="w-5 h-4 inline"></CalendarIcon>
                    <h2 className="inline">{moment(date).format('YYYY-MM-DD HH:mm')}</h2>
                </div>

            </div>
            <div>
                <p>{order.service.description}</p>
            </div>
            <div>
                {new Date() < date &&
                    <div>
                        <button onClick={()=>handleDeleteOrder(order.id)} className="bg-orange-500 px-2 py-1 rounded">Anuluj</button>
                    </div>
                }
            </div>
        </div>
      </div>
  )
}

export default OrderTile