import {Link} from 'react-router-dom';
import useStore from "../../store/store.ts";

const Navbar = () => {

    const userType = useStore((state) => state.userType)

    return (
        <div className="w-full py-3 items-center bg-primary-100 text-white">
            <div className="w-4/5 m-auto max-w-screen-2xl flex items-center justify-between">
              <span className="hover:text-blue-200">
                  <Link to="/">System Wizyt</Link>
              </span>
                <div className="flex justify-between gap-8">
                    {(userType === null || userType === "patient") && <Link to="/services" className="hover:text-blue-200">Usługi</Link>}
                    {userType === "doctor" && <Link to="/calendar" className="hover:text-blue-200">Kalendarz</Link>}
                    <div>
                        {userType !== null ?
                            <div className="flex gap-8">
                                <Link to={useStore.getState().userType === "doctor"?"/account/doctor":"/account/customer"} className="hover:text-blue-200">Moje konto</Link>
                            </div>
                            :
                            <></>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar