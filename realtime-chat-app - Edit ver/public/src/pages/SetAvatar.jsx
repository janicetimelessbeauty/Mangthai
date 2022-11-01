import React, { useState, useEffect } from 'react'
import styled from "styled-components"
import {Link, useNavigate} from "react-router-dom"
import Loader from "../assets/loader.gif"
import {ToastContainer, toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios"
import { setAvatarRoute } from '../utils/APIRoute'
import {Buffer} from "buffer"
export default function SetAvatar() {
  const api1 = "http://api.multiavatar.com/45678945"
  const api2 = "/?apikey=FBYJfm5Vtrihwb"
  const navigate = useNavigate()
  const [avatars, SetAvatars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAvatar, setselectedAvatar] = useState(undefined)
  const ToastOptions = {
    position: 'bottom-right',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  }
  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login")
    }
  }, [])
  const setProfilePicture = async () => {
    if(selectedAvatar === undefined) {
      toast.error("Please select a picture", ToastOptions)

    }
    else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"))
      console.log(user)
      const {data} = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      })
      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem( "chat-app-user", JSON.stringify(user))
        navigate("/")
      }
      else {
        toast.error("Failed to set avatar")
      }
    }
  }
  const getData = async () => {
    const data = []
    for (let i = 0; i < 4; i++) {
      const image = await axios.get(
        `${api1}/${Math.round(Math.random() * 100)}/${api2}`
      )
      const buffer = new Buffer(image.data)
      data.push(buffer.toString("base64"))
    }
    SetAvatars(data)
    setIsLoading(false)
  }
  useEffect(() => {
    getData()
  }, []);
  return (
    <> 
    {isLoading ? <Container>
      <img src={Loader} alt="" className='loader'/>
    </Container> : 
    <Container>
    <div className="title-container">
        <h1>Pick an avatar as your profile</h1>
    </div>
    <div className="avatars">{
      avatars.map((avatar, index) => {
        return (
        <div key = {index} className={`avatar ${
          selectedAvatar === index ? "selected" : ""
        }`}>
        <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" 
        onClick = {() => setselectedAvatar(index)}/>
        </div>
      )})
    }
    </div> 
    <button className='submit-btn' onClick = {setProfilePicture}>Set as Profile Picture</button>
    <ToastContainer />
</Container>
    } 
    </>
  )
}
const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100vw;
.loader {
  max-inline-size: 100%;
}
.title-container {
  h1 {
    color: white;
  }
}
.avatars {
  display: flex;
  gap: 2rem;
  .avatar {
    border: 0.4rem solid transparent;
    padding: 0.4 rem;
    border-radius: 5rem;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;
    img {
      height: 6rem;
    }
  }
  .selected {
    border: 0.4rem solid #D9F430;

  }
}
.submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
}
`

