import './App.css'
import {Route, Routes} from 'react-router-dom';
import Navbar from "./components/navbar";
import LandingPage from "./components/landing-page";
import ServicesPage from "./components/services-page";
import CalendarPage from "./components/calendar-page";
import CustomerAccountPage from "./components/account-page/customer-page";
import DoctorAccountPage from "./components/account-page/doctor-page";
import EditOrCreateServicePage from "./components/account-page/doctor-page/edit-or-create-service-page";
import ServicePage from "./components/service-page";
import OrderPage from "./components/order-page/checkout-page";
import SuccessPage from "./components/order-page/success-page";
import NotFound from "./components/404-page";

function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/services" element={<ServicesPage/>}></Route>
        <Route path="/calendar" element={<CalendarPage/>}></Route>
        <Route path="/account/customer" element={<CustomerAccountPage/>}></Route>
        <Route path="/account/doctor" element={<DoctorAccountPage/>}></Route>
        <Route path="/edit" element={<EditOrCreateServicePage/>}></Route>
        <Route path="/service/:id" element={<ServicePage/>}></Route>
        <Route path="/order" element={<OrderPage/>}></Route>
        <Route path="/order_succesfull" element={<SuccessPage/>}></Route>
        <Route path="*" element={<NotFound/>}></Route>
      </Routes>
    </>
  )
}

export default App
