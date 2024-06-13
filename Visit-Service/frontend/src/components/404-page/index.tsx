import {Link} from "react-router-dom";


const NotFound = () => {

  return (
      <div className="w-full">
        <div className="w-4/5 m-auto max-w-screen-sm py-8">
            <div className="flex flex-col items-center gap-3">
                <h1 className="text-5xl font-bold">404</h1>
                <div>
                    <p className="inline">This page does not exist yet... </p>
                    <Link to="/" className='text-primary-100 hover:underline hover:cursor-pointer inline'>go back to the store</Link>
                </div>
            </div>
        </div>
      </div>
  )
}

export default NotFound