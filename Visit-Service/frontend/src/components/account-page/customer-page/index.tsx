import {Order} from "../../../interfaces";
import OrderTile from "./order-tile";
import {useEffect, useState} from "react";
import useStore from "../../../store/store.ts";


const CustomerAccountPage = () => {
    const visit_api_url = import.meta.env.VITE_VISIT_API_URL
    const customerId = useStore.getState().userId
    const [orders, setOrders] = useState<Order[]>([])
    useEffect(() => {
        requestOrders()
    }, []);

    const requestOrders = async () => {
        const response = await fetch(visit_api_url + "/api/customers/" + customerId + "/orders/")
        if(!response.ok){
            console.log("request error")
        }
        const data = await response.json()
        setOrders(data)
    }

    const requestDeleteOrder = async (orderId: number) => {
        console.log(orderId)
        const response = await fetch(visit_api_url + "/api/orders/"+orderId+"/",{
            method: "DELETE",
        })
        if(!response.ok){
            console.log("request error")
            return
        }
        const newOrders = [...orders].filter(order=> order.id != orderId)
        setOrders(newOrders)
    }

  return (
      <div className="w-full">
        <div className="w-4/5 m-auto max-w-screen-2xl py-8">
            <h1 className="text-2xl font-bold">Witaj {useStore.getState().username}!</h1>
            <div className="flex flex-col gap-3">
                <h2>Twoja historia zamówień:</h2>
                {orders.length !== 0?
                    <>
                        {orders.map((order, index) => (
                        <OrderTile handleDeleteOrder={requestDeleteOrder} key={index} order={order}/>
                        ))}
                    </>
                    :
                    <>
                        <h2>Nie masz żadnych zamówionych wizyt :(</h2>
                    </>
                }

            </div>
        </div>
      </div>
  )
}

export default CustomerAccountPage