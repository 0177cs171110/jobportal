/* eslint-disable no-unused-vars */
import React,{useEffect, useState} from "react";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../shared/Navbar";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";
import { RadioGroup } from "../ui/radio-group";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
    const [input, setInput] = useState({
        fullname:"",
        email:"",
        phoneNumber:"",
        password:"",
        role:"",
        file:""
    });
    const {loading,user} = useSelector(store=>store.auth);
   
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const changeEventHandler = (e) =>{
       setInput({...input, [e.target.name]:e.target.value})        
    }
    const changeFileHandler = (e) => {
        setInput({...input, file:e.target.files?.[0]})
    }
    const submitHandler = async(e) => {
      e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if(input.file){
            formData.append("file", input.file);
        }
      
        try{
          dispatch(setLoading(true));
          const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
            headers:{
                "Content-Type":"multipart/form-data"
            },
            withCredentials:true,
          });
          if(res.data.success){
            navigate("/login")
            toast.success(res.data.message);
          }
        }catch(error){
          if (error.response) {
            console.error('Error response data:', error.response.data); // Server-side error details
            toast.error(error.response.data.message || "Registration failed");
          } else {
            console.error('Error message:', error.message); // Client-side or network error
            toast.error("Something went wrong. Please try again.");
          }
        }finally{
          dispatch(setLoading(false));
        }
    }
    useEffect(()=>{
      if(user){
        navigate("/");
      }
    },[])
  
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl max-auto">
        <form onSubmit={submitHandler} className="w-1/2 border-gray-200 rounded-md p-4 my-10">
          <h1 className="fontbold text-xl mb-5">Sign Up</h1>
          <div className="my-2">
            <label>Full Name</label>
            <Input type="text"
            value={input.fullname}
            name="fullname"
            onChange={changeEventHandler}
             placeholder="Enter" />
          </div>
          <div className="my-2">
            <label>Email</label>
            <Input type="email" 
            value={input.email}
            name="email"
            onChange={changeEventHandler}
            placeholder="" />
          </div>
          <div className="my-2">
            <label>Phone Number</label>
            <Input type="text" 
            value={input.phoneNumber}
            name="phoneNumber"
            onChange={changeEventHandler}
            placeholder="" />
          </div>
          <div className="my-2">
            <label>Password</label>
            <Input type="password" 
            value={input.password}
            name="password"
            onChange={changeEventHandler}
            placeholder="Enter" />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                type="radio"
                name='role'
                value="student"
                checked={input.role === 'student'}
                onChange={changeEventHandler}
                className="cursor-pointer"
                />
                <Label htmlFor="r1">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
              <Input
                type="radio"
                name='role'
                value="recruiter"
                checked={input.role === 'recruiter'}
                onChange={changeEventHandler}
                className="cursor-pointer"
                />
                <Label htmlFor="r2">Recruiter</Label>
              </div>
            </RadioGroup>
            <div className='flex items-center gap-2'>
               <Label>Profile</Label>
               <Input 
                  accept="image/*"
                  type="file"
                  onChange={changeFileHandler}
                  className="cursor-pointer"
                  />
            </div>
          </div>
          {
            loading ? <Button className='w-full my-4'><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</Button>: <Button type="submit" className="w-full my-4">
            SignUp
          </Button>
          }
         
          <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
