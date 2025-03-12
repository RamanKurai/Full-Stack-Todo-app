import React, { useState } from 'react'
import useNavigate from "react-router-dom"

const SignUp = () => {
    const [name , setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.get("http://localhost:3000/signup" , {
                name,
                email,
                password
            })
            alert(response.data.message);
            navigate("/signin")
        } catch (error) {
           alert("User already exists or invalid data")
        }
    }

  return (
    <div>
         <input type="text"
        placeholder='Enter Your Full Name'
       onChange={(e)=> setName(e.target.value)} 
        />
        <input type="text"
        placeholder='Enter Your Email'
       onChange={(e)=> setEmail(e.target.value)} 
        />
         <input type="text"
        placeholder='Enter Your Password'
       onChange={(e)=> setPassword(e.target.value)} 
        />
        <button onClick={handleSignup}>Signup</button>
    </div>
  )
}

export default SignUp
