import { Auth } from "../components/Auth"
import { Quote } from "../components/Quote"
export const Signup = () =>{
    return <div className="flex flex-col lg:flex-row min-h-screen">
      <div className="w-full lg:w-1/2">
        <Auth type="signup" />
      </div>
      <div className="w-full lg:w-1/2">
        <Quote />
      </div>
    </div>
}