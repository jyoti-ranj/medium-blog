import { Avatar } from "./Blogcard"


export const Appbar = () =>{
    return <div className="border-b flex justify-between px-10 py-4">
     <div>
        Medium
     </div>
     <div>
        <Avatar name = {"Jyoti Ranjan Sethi"}/>
     </div>
    </div>
}