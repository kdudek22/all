import {Link, useSearchParams} from 'react-router-dom';

const SuccessPage = () => {
    const [searchParams] = useSearchParams()
    const orderId = searchParams.get("order_id")
    console.log(orderId)

  return (
      <div className="w-full h-full">
        <div className="w-4/5 m-auto max-w-screen-sm py-8">
            <div className="flex flex-col gap-3 border-2 border-primary-200 rounded-2xl p-5 bg-white">
                <h1 className="font-bold text-2xl">Sukces!</h1>
                <div className="text-sm">
                    <p>Twoja wizyta została zarezerwowana, i w krótce otrzymasz potwierdzenie email ze szczegółami. Do zobaczenia :)</p>
                </div>
                <div>
                    <p className="text-sm">Numer zamówienia: {orderId}</p>
                </div>
                <div className="flex justify-between">
                    <Link to="/" className='text-primary-100 hover:underline hover:cursor-pointer'>Powrót do sklepu</Link>
                    <Link to="/help" className='text-primary-100 hover:underline hover:cursor-pointer'>Kontakt z obsługą</Link>
                </div>
            </div>
        </div>
      </div>
  )
}

export default SuccessPage