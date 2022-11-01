import React, {useState, useRef, useEffect} from 'react'
import styled from "styled-components"
import axios from "axios"
import {useNavigate} from "react-router-dom"
import { allusersRoute, host } from '../utils/APIRoute'
import Contact from "../components/Contact"
import Welcome from '../components/Welcome'
import ChatContainer from '../components/ChatContainer'
import {io} from "socket.io-client"
function Chat() {
  const socket = useRef()
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [currentUser, setCurrentuser] = useState(undefined)
  const [currentChat, setCurrentChat] = useState(undefined)
  const [loaded, setisLoaded] = useState(false)
  const checkUser = async () => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login")
    }
    else {
      setCurrentuser( await JSON.parse(localStorage.getItem("chat-app-user")))
      setisLoaded(true)
    }
  }
  const handleChatChange = (chat) => {
    setCurrentChat(chat)
  }
  const getUserData = async () => {
    if (currentUser) {
       if(currentUser.isAvatarImageSet) {
        const data = await axios.get(`${allusersRoute}/${currentUser._id}`);
        setContacts(data.data)
       }
       else {
        navigate("/setavatar")
       }
    }
  }
  useEffect(() => {
    checkUser()
  },[])
  useEffect(() => {
    if(currentUser) {
      socket.current = io(host)
      socket.current.emit("add-user", currentUser._id)
    }
  }, [currentUser])
  useEffect(() => {
    getUserData()
  }, [currentUser])
  return (
    <Container>
      <div className="container">
        <Contact contacts = {contacts} currentUser = {currentUser} changeChat = {handleChatChange} />
        {
          loaded && currentChat === undefined ? (<Welcome currentUser = {currentUser}/>) :
            (<ChatContainer currentChat={currentChat} currentUser = {currentUser} socket = {socket}/>)
        }
      </div>
    </Container>
  )
}
const Container = styled.div `
height: 100vh;
width: 100vw;
display: flex;
flex-direction: column;
justify-content:center;
background-color: #131324;
align-items: center;
gap: 1rem;
.container {
  height: 85vh;
  width: 85vw;
  background-color: #00000076;
  display: grid;
  grid-template-columns: 25% 75%;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-columns: 35% 65%;
  }
}

`
export default Chat