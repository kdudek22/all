import {AcademicCapIcon, ArrowTrendingUpIcon, RocketLaunchIcon, ShieldCheckIcon} from "@heroicons/react/24/solid";
import {useEffect} from "react";
import useStore from "../../store/store.ts";


const LandingPage = () => {
    const user_service_api_url =  import.meta.env.VITE_USER_API_URL

    useEffect(() => {
        getCurrentUser()
    }, []);
    const getCurrentUser = async () => {
        const url = user_service_api_url + "/api/v1/users/current"
        const response = await fetch(url, {credentials: 'include',})
        if(!response.ok){
            console.log("response error")
            return
        }
        // console.log(url)
        // console.log(response)
        const body = await response.json()

        const {email, id, name, role} = body

        useStore.getState().setUserId(id)
        useStore.getState().setUserType(role)
        useStore.getState().setUserEmail(email)
        useStore.getState().setUsername(name)
    }
  return (
      <div className="w-full">
        <div className="w-4/5 m-auto py-8 max-w-screen-2xl flex flex-col gap-8 items-center">
          <h1 className="text-5xl font-bold underline">Umów się na wizytę ze specjalistą!</h1>
            <div className="flex flex-col gap-3">
                <h2 className="font-bold text-2xl">Dlaczego warto skorzystać z naszego serwisu?</h2>
                <div className="">
                    <RocketLaunchIcon className="w-6 h-6 inline text-primary-100 "></RocketLaunchIcon>
                    <p className="inline"><strong className="text-primary-100">Szybkość </strong> - rezerwuj wizytę w kilka chwil, bez czekania w kolejkach.</p>
                </div>
                <div>
                    <AcademicCapIcon className='w-6 h-6 inline text-primary-200'></AcademicCapIcon>
                    <p className='inline'><strong className="text-primary-200">Doświadczeni</strong> - w ofercie mamy wizyty u najbardziej renomowanych polskich lekarzy</p>
                </div>
                <div>
                    <ArrowTrendingUpIcon className="w-6 h-6 inline text-pink-400"></ArrowTrendingUpIcon>
                    <p className="inline"><strong className="text-pink-400">Wygodny podgląd</strong> - intuacyjny UI, proste zarządzanie wizytami</p>
                </div>
                <div>
                    <ShieldCheckIcon className="w-6 h-6 inline text-orange-400"></ShieldCheckIcon>
                    <p className="inline"><strong className="text-orange-400">Bezpieczeństwo</strong> - dbamy o bezpieczeństwo twoich danych</p>
                </div>
            </div>
        </div>
      </div>
  )
}

export default LandingPage