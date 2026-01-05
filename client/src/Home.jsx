import React from 'react'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios"

const Home = () => {
  axios.defaults.withCredentials = true
  const navigate = useNavigate()

  useEffect(()=>{
    axios.get('http://localhost:3001/home')
    .then(result => {
        console.log(result)
        if(result.data !== "Success!"){
          navigate("/login")
        }
    })
    .catch(err => console.log(err))
  },[])

  return (
    <h2>Home page 🫡</h2>
  )
}

export default Home
