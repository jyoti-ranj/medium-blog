import { SignupInput } from "@jyoti_ranj/common";
import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";

export const Auth = ({type}:{type:"signup" | "signin"}) =>{
    const [postInputs , setPostInputs] = useState<SignupInput>({
        name: "",
        username: "",
        password:""
    })
    return <div className="h-screen flex justify-center flex-col">
        
    <div className="col-span-1 grid grid-rows-5">
         <div className="p-10 py-17">  
        </div>
        <div className="row-span-4 m-5 p-10 mx-20 px-20 py-6">
            <div className="flex justify-center ">
            <div className="font-bold"><div className="text-3xl font-lexend font-extrabold">Create an account</div></div>
        </div>
        <div className="flex justify-center p-0.5">
            <div className="text-slate-500">Already have an account?</div>
            <Link to = {"/signin"} className="underline text-blue-800 px-1.5">Login</Link>
        </div>
        <div className="p-2 my-1"><LabelledInput label = "Username" placeholder = "Jyoti Ranjan Sethi"  onChange = {(e)=>{
                setPostInputs(c=>({
                    ...c, name:e.target.value
                }))
        }} />
        <LabelledInput label ="Email" placeholder = "m@example.com"  onChange = {(e)=>{
                setPostInputs(c=>({
                    ...c, name:e.target.value
                }))
        }} />
        <LabelledInput label ="Password" placeholder = ""  onChange = {(e)=>{
                setPostInputs(c=>({
                    ...c, name:e.target.value
                }))
        }} /></div>
        </div> 
        </div>
        </div> 
}

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelledInput({ label, placeholder, onChange, type }: LabelledInputType) {
    return <div className="m-3">
        <label className="block mb-2 text-sm text-black font-semibold pt-4">{label}</label>
        <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-md p-2.5" placeholder={placeholder} required />
    </div>
}

 